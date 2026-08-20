import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../db/index.js';
import { AppError } from '../middlewares/errorHandler.js';

export class OrgService {
  /**
   * Create an employee record and generate a registration invitation token.
   * Runs in a transaction to guarantee atomic persistence.
   */
  async createEmployee(tenantId, data, invitedBy) {
    const {
      first_name,
      last_name,
      email,
      employee_id = null,
      phone_number = null,
      avatar_url = null,
      position_id = null,
      role_id = null,
    } = data;

    if (!first_name || !last_name || !email) {
      throw new AppError('First name, last name, and email are required to invite an employee', 400);
    }

    if (!employee_id) {
      throw new AppError('Employee ID is required. Please assign a unique ID for this employee (e.g. EMP-001).', 400);
    }

    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 1. Check if email is already taken in this organization
      const emailCheck = await client.query(
        'SELECT id FROM persons WHERE organization_id = $1 AND email = $2',
        [tenantId, email.toLowerCase().trim()]
      );

      if (emailCheck.rows.length > 0) {
        throw new AppError(`Employee with email "${email}" already exists in this organization`, 409);
      }

      // 1b. Check if employee_id is already taken in this org
      const idCheck = await client.query(
        'SELECT id FROM persons WHERE organization_id = $1 AND employee_id = $2',
        [tenantId, employee_id.trim()]
      );

      if (idCheck.rows.length > 0) {
        throw new AppError(`Employee ID "${employee_id}" is already assigned to another employee in this organization`, 409);
      }

      // 2. Generate a secure high-entropy placeholder password (persons.password_hash is NOT NULL)
      const placeholderPlain = crypto.randomBytes(32).toString('hex');
      const placeholderHash = await bcrypt.hash(placeholderPlain, 12);

      // 3. Create the person record
      const personResult = await client.query(
        `INSERT INTO persons (organization_id, first_name, last_name, email, employee_id, password_hash, phone_number, avatar_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
         RETURNING id, first_name, last_name, email, employee_id, phone_number, avatar_url, is_active, joined_at`,
        [
          tenantId,
          first_name.trim(),
          last_name.trim(),
          email.toLowerCase().trim(),
          employee_id.trim(),
          placeholderHash,
          phone_number ? phone_number.trim() : null,
          avatar_url ? avatar_url.trim() : null,
        ]
      );
      const employee = personResult.rows[0];

      // 4. Assign position if provided
      let primaryPosition = null;
      if (position_id) {
        // Validate position exists in this organization
        const posCheck = await client.query(
          'SELECT id, title, path FROM positions WHERE organization_id = $1 AND id = $2',
          [tenantId, position_id]
        );

        if (posCheck.rows.length === 0) {
          throw new AppError(`Position with ID "${position_id}" not found in this organization`, 404);
        }

        const assignmentResult = await client.query(
          `INSERT INTO position_assignments (person_id, position_id, is_primary, start_date)
           VALUES ($1, $2, true, current_date)
           RETURNING id, position_id`,
          [employee.id, position_id]
        );

        primaryPosition = {
          id: posCheck.rows[0].id,
          title: posCheck.rows[0].title,
          path: posCheck.rows[0].path,
          assignment_id: assignmentResult.rows[0].id,
        };
      }

      // 4b. Assign role if provided (or default to Employee role)
      let targetRoleId = role_id;
      if (!targetRoleId) {
        const empRole = await client.query("SELECT id FROM roles WHERE organization_id = $1 AND name = 'Employee'", [tenantId]);
        if (empRole.rows.length > 0) targetRoleId = empRole.rows[0].id;
      }
      if (targetRoleId) {
        await client.query("INSERT INTO person_roles (person_id, role_id) VALUES ($1, $2)", [employee.id, targetRoleId]);
      }

      // 5. Generate secure registration invitation token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = await bcrypt.hash(rawToken, 10);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

      // Save token info
      // Save token info
      const inviteResult = await client.query(
        `INSERT INTO org_invite_tokens (organization_id, email, token_hash, invited_by, expires_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [tenantId, employee.email, tokenHash, invitedBy, expiresAt]
      );
      
      const inviteId = inviteResult.rows[0].id;

      // 6. Queue email in outbox
      // Fetch org name for the email
      const orgResult = await client.query('SELECT name FROM organizations WHERE id = $1', [tenantId]);
      const orgName = orgResult.rows[0].name;
      
      const { env } = await import('../config/env.js');
      const { emailService } = await import('./email/email.service.js');
      
      const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${rawToken}`;
      
      await emailService.queue({
        client,
        organizationId: tenantId,
        to: employee.email,
        templateKey: 'employeeInvite',
        payload: {
          employeeName: employee.first_name,
          organizationName: orgName,
          inviteUrl
        },
        idempotencyKey: `invite:${inviteId}:v1`
      });

      // 7. Log in audit trail
      await client.query(
        `INSERT INTO audit_logs (organization_id, entity_type, entity_id, action, new_data, changed_by, reason)
         VALUES ($1, 'person', $2, 'CREATE', $3::jsonb, $4, 'Employee registration invitation generated')`,
        [
          tenantId,
          employee.id,
          JSON.stringify({ first_name, last_name, email, position_id }),
          invitedBy,
        ]
      );

      await client.query('COMMIT');

      // We return the raw plain token for test/verification flows
      return {
        employee: {
          ...employee,
          primary_position: primaryPosition,
        },
        invite: {
          invite_link: inviteUrl
        }
      };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Resend an invite email for a given employee.
   * Invalidates old token and queues a new one via email_outbox.
   */
  async resendInvite(tenantId, employeeId, invitedBy) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // 1. Find employee
      const employeeRes = await client.query(
        'SELECT id, first_name, email, is_active FROM persons WHERE organization_id = $1 AND id = $2',
        [tenantId, employeeId]
      );
      if (employeeRes.rows.length === 0) {
        throw new AppError('Employee not found', 404);
      }
      const employee = employeeRes.rows[0];

      if (!employee.is_active) {
        throw new AppError('Cannot send invite to a deactivated employee', 400);
      }

      // 2. Rate limiting check (e.g. check if they already requested one within last minute)
      // This is a basic check.
      const rateLimitRes = await client.query(
        `SELECT id FROM org_invite_tokens 
         WHERE organization_id = $1 AND email = $2 
           AND created_at > current_timestamp - interval '1 minute'`,
        [tenantId, employee.email]
      );
      if (rateLimitRes.rows.length > 0) {
        throw new AppError('Please wait at least a minute before resending an invite to this employee.', 429);
      }

      // 3. Generate new token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = await bcrypt.hash(rawToken, 10);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // 4. Invalidate old tokens (Optional but good practice)
      await client.query(
        `UPDATE org_invite_tokens SET expires_at = current_timestamp WHERE organization_id = $1 AND email = $2 AND used_at IS NULL`,
        [tenantId, employee.email]
      );

      // 5. Save new token
      const inviteResult = await client.query(
        `INSERT INTO org_invite_tokens (organization_id, email, token_hash, invited_by, expires_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [tenantId, employee.email, tokenHash, invitedBy, expiresAt]
      );
      const inviteId = inviteResult.rows[0].id;

      // 6. Queue email
      const orgResult = await client.query('SELECT name FROM organizations WHERE id = $1', [tenantId]);
      const orgName = orgResult.rows[0].name;

      const { env } = await import('../config/env.js');
      const { emailService } = await import('./email/email.service.js');
      
      const inviteUrl = `${env.FRONTEND_URL}/accept-invite?token=${rawToken}`;
      
      await emailService.queue({
        client,
        organizationId: tenantId,
        to: employee.email,
        templateKey: 'employeeInvite',
        payload: {
          employeeName: employee.first_name,
          organizationName: orgName,
          inviteUrl
        },
        idempotencyKey: `invite:${inviteId}:v1`
      });

      // 7. Audit log
      await client.query(
        `INSERT INTO audit_logs (organization_id, entity_type, entity_id, action, new_data, changed_by, reason)
         VALUES ($1, 'person', $2, 'UPDATE', $3::jsonb, $4, 'Employee registration invitation resent')`,
        [tenantId, employee.id, JSON.stringify({ email: employee.email }), invitedBy]
      );

      await client.query('COMMIT');

      return {
        invite: {
          invite_link: inviteUrl
        }
      };

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Update an employee's details, position assignment, role assignment, or activation status
   */
  async updateEmployee(tenantId, employeeId, updates, changedBy) {
    const { first_name, last_name, employee_id, is_active, position_id, role_id } = updates;

    const fields = [];
    const values = [tenantId, employeeId];
    let vIdx = 3;

    if (first_name !== undefined) {
      fields.push(`first_name = $${vIdx++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${vIdx++}`);
      values.push(last_name);
    }
    if (employee_id !== undefined) {
      fields.push(`employee_id = $${vIdx++}`);
      values.push(employee_id);
    }
    if (is_active !== undefined) {
      fields.push(`is_active = $${vIdx++}`);
      values.push(is_active);
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      let person = null;
      if (fields.length > 0) {
        fields.push(`updated_at = current_timestamp`);
        const result = await client.query(
          `UPDATE persons 
           SET ${fields.join(', ')}
           WHERE organization_id = $1 AND id = $2
           RETURNING id, first_name, last_name, employee_id, is_active`,
          values
        );

        if (result.rows.length === 0) {
          throw new AppError('Employee not found', 404);
        }
        person = result.rows[0];
      } else {
        const check = await client.query(
          `SELECT id, first_name, last_name, employee_id, is_active FROM persons WHERE organization_id = $1 AND id = $2`,
          [tenantId, employeeId]
        );
        if (check.rows.length === 0) {
          throw new AppError('Employee not found', 404);
        }
        person = check.rows[0];
      }

      // Handle position assignment update if position_id is explicitly provided
      if (position_id !== undefined) {
        // End existing active primary assignment(s)
        await client.query(
          `UPDATE position_assignments 
           SET end_date = current_date, is_primary = false 
           WHERE person_id = $1 AND (end_date IS NULL OR end_date >= current_date)`,
          [employeeId]
        );

        if (position_id && position_id.trim() !== '') {
          // Verify position exists in organization
          const posCheck = await client.query(
            'SELECT id, title, path FROM positions WHERE organization_id = $1 AND id = $2',
            [tenantId, position_id]
          );
          if (posCheck.rows.length === 0) {
            throw new AppError(`Position with ID "${position_id}" not found in this organization`, 404);
          }

          // Create new primary assignment
          await client.query(
            `INSERT INTO position_assignments (person_id, position_id, is_primary, start_date)
             VALUES ($1, $2, true, current_date)`,
            [employeeId, position_id]
          );
        }
      }

      // Handle role assignment update if role_id is explicitly provided
      if (role_id !== undefined) {
        await client.query('DELETE FROM person_roles WHERE person_id = $1', [employeeId]);
        if (role_id && role_id.trim() !== '') {
          const roleCheck = await client.query(
            'SELECT id FROM roles WHERE organization_id = $1 AND id = $2',
            [tenantId, role_id]
          );
          if (roleCheck.rows.length === 0) {
            throw new AppError(`Role with ID "${role_id}" not found in this organization`, 404);
          }
          await client.query(
            'INSERT INTO person_roles (person_id, role_id) VALUES ($1, $2)',
            [employeeId, role_id]
          );
        }
      }

      await client.query(
        `INSERT INTO audit_logs (organization_id, entity_type, entity_id, action, new_data, changed_by, reason)
         VALUES ($1, 'person', $2, 'UPDATE', $3::jsonb, $4, 'Employee details or role/position updated')`,
        [tenantId, employeeId, JSON.stringify(updates), changedBy]
      );

      await client.query('COMMIT');
      return person;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * List all employees in the organization (paginated).
   */
  async listEmployees(tenantId, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const result = await db.query(
      `SELECT 
         p.id, p.first_name, p.last_name, p.email, p.employee_id, p.phone_number, p.avatar_url, p.is_active, p.joined_at,
         pos.id AS position_id, pos.title AS position_title, pos.path AS position_path,
         (
           SELECT pr.role_id FROM person_roles pr
           WHERE pr.person_id = p.id
           LIMIT 1
         ) AS role_id,
         (
           SELECT r.name FROM person_roles pr
           JOIN roles r ON r.id = pr.role_id
           WHERE pr.person_id = p.id
           LIMIT 1
         ) AS role_name,
         (
           SELECT dept.name FROM departments dept
           WHERE dept.id = pos.department_id
         ) AS department_name
       FROM persons p
       LEFT JOIN position_assignments pa ON pa.person_id = p.id AND pa.is_primary = true AND (pa.end_date IS NULL OR pa.end_date >= current_date)
       LEFT JOIN positions pos ON pos.id = pa.position_id
       WHERE p.organization_id = $1
       ORDER BY p.last_name ASC, p.first_name ASC
       LIMIT $2 OFFSET $3`,
      [tenantId, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(id) FROM persons WHERE organization_id = $1',
      [tenantId]
    );

    return {
      employees: result.rows.map((row) => ({
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        employee_id: row.employee_id,
        phone_number: row.phone_number,
        avatar_url: row.avatar_url,
        is_active: row.is_active,
        joined_at: row.joined_at,
        role: row.role_name || 'Employee',
        role_id: row.role_id || null,
        department: row.department_name || 'General',
        primary_position: row.position_id
          ? {
              id: row.position_id,
              title: row.position_title,
              path: row.position_path,
            }
          : null,
      })),
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  /**
   * Get an employee by ID.
   */
  async getEmployeeById(tenantId, employeeId) {
    const result = await db.query(
      `SELECT 
         p.id, p.first_name, p.last_name, p.email, p.phone_number, p.avatar_url, p.is_active, p.joined_at,
         pos.id AS position_id, pos.title AS position_title, pos.path AS position_path
       FROM persons p
       LEFT JOIN position_assignments pa ON pa.person_id = p.id AND pa.is_primary = true AND (pa.end_date IS NULL OR pa.end_date >= current_date)
       LEFT JOIN positions pos ON pos.id = pa.position_id
       WHERE p.organization_id = $1 AND p.id = $2`,
      [tenantId, employeeId]
    );

    if (result.rows.length === 0) {
      throw new AppError(`Employee not found with ID "${employeeId}"`, 404);
    }

    const row = result.rows[0];

    // Fetch employee roles
    const rolesResult = await db.query(
      `SELECT r.name FROM person_roles pr
       JOIN roles r ON r.id = pr.role_id
       WHERE pr.person_id = $1`,
      [row.id]
    );

    return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone_number: row.phone_number,
      avatar_url: row.avatar_url,
      is_active: row.is_active,
      joined_at: row.joined_at,
      primary_position: row.position_id
        ? {
            id: row.position_id,
            title: row.position_title,
            path: row.position_path,
          }
        : null,
      roles: rolesResult.rows.map((r) => r.name),
    };
  }
}

import bcrypt from 'bcryptjs';
import { db } from '../../db/index.js';
import { generateTokens } from '../../utils/token.js';
import { AppError } from '../../middlewares/errorHandler.js';

/**
 * EmployeeAuthService
 * Handles standard employee login.
 *
 * Employees log in with:
 *   org_slug    — identifies the tenant (workspace code)
 *   employee_id — unique ID assigned by the org admin (e.g. EMP-001)
 *   password    — set by the employee when they accepted their invite
 *
 * Using employee_id instead of email as a login credential prevents spoofing:
 * an attacker who knows someone's email still cannot log in without their
 * admin-assigned ID.
 */
export class EmployeeAuthService {

  /**
   * @param {Object} credentials
   * @param {string} credentials.org_slug    - The organization's unique slug
   * @param {string} credentials.employee_id - Admin-assigned employee identifier
   * @param {string} credentials.password
   */
  async login({ org_slug, employee_id, password }) {
    // 1. Resolve org by slug
    const orgResult = await db.query(
      `SELECT id, name, slug, is_active FROM organizations WHERE slug = $1`,
      [org_slug]
    );

    if (orgResult.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const org = orgResult.rows[0];

    if (!org.is_active) {
      throw new AppError('This organization account has been suspended.', 403);
    }

    // 2. Find the person by employee_id within this specific organization
    const personResult = await db.query(
      `SELECT
         p.id, p.first_name, p.last_name, p.email, p.employee_id,
         p.password_hash, p.is_active, p.organization_id
       FROM persons p
       WHERE p.organization_id = $1 AND p.employee_id = $2`,
      [org.id, employee_id.trim()]
    );

    if (personResult.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const person = personResult.rows[0];

    if (!person.is_active) {
      throw new AppError('Your account has been deactivated. Please contact your admin.', 403);
    }

    // 3. Verify password
    const isValid = await bcrypt.compare(password, person.password_hash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // 4. Fetch primary position + ltree path (used for hierarchy-scoped queries)
    const positionResult = await db.query(
      `SELECT
         pa.id AS assignment_id,
         pa.position_id,
         pos.title AS position_title,
         pos.path AS position_path
       FROM position_assignments pa
       JOIN positions pos ON pos.id = pa.position_id
       WHERE pa.person_id = $1
         AND pa.is_primary = true
         AND (pa.end_date IS NULL OR pa.end_date >= current_date)
       LIMIT 1`,
      [person.id]
    );

    const primaryPosition = positionResult.rows[0] || null;

    // 5. Fetch roles
    const rolesResult = await db.query(
      `SELECT r.name FROM person_roles pr
       JOIN roles r ON r.id = pr.role_id
       WHERE pr.person_id = $1`,
      [person.id]
    );
    const roles = rolesResult.rows.map((r) => r.name);

    // 6. Generate JWT
    const tokens = generateTokens({
      person_id: person.id,
      organization_id: person.organization_id,
      type: 'employee',
      position_path: primaryPosition?.position_path ?? null,
      roles,
    });

    return {
      person: {
        id: person.id,
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        employee_id: person.employee_id,
        organization: { id: org.id, name: org.name, slug: org.slug },
        primary_position: primaryPosition
          ? { id: primaryPosition.position_id, title: primaryPosition.position_title, path: primaryPosition.position_path }
          : null,
      },
      roles,
      tokens,
    };
  }
}

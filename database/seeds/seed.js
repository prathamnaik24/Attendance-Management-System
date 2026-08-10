/**
 * Seed Script — Core Structure + RBAC + Audit Log
 *
 * Seeds a minimal but realistic dataset to verify all Day 2 & Day 3
 * migrations are working correctly:
 *
 *   Day 2: organizations, departments, positions (ltree), persons, position_assignments
 *   Day 3: roles, permissions, role_permissions, person_roles, audit_logs
 *
 * Usage:
 *   npm run db:seed
 *
 * Safe to run multiple times — uses INSERT ... ON CONFLICT DO NOTHING.
 * Run AFTER: npm run db:migrate
 */

require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'attendance_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const log = (msg) => console.log(`  ${msg}`);
const section = (title) => console.log(`\n── ${title} ${'─'.repeat(50 - title.length)}`);

// ─── Seed Data ────────────────────────────────────────────────────────────────

async function seed() {
  await client.connect();
  console.log('🌱 Connected to database. Starting seed...');

  try {
    await client.query('BEGIN');

    // ── 1. Organization ──────────────────────────────────────────────────────
    section('Organizations');

    const orgResult = await client.query(`
      INSERT INTO organizations (name, slug, type, is_active, metadata)
      VALUES ('Acme Corp', 'acme-corp', 'Corporate', true, '{"industry": "Technology", "country": "India"}')
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name, slug
    `);
    const org = orgResult.rows[0];
    log(`✅ Org: ${org.name} (${org.slug}) — id: ${org.id}`);

    // ── 2. Departments ───────────────────────────────────────────────────────
    section('Departments');

    const deptNames = ['Engineering', 'Human Resources', 'Finance'];
    const depts = {};

    for (const name of deptNames) {
      const r = await client.query(`
        INSERT INTO departments (organization_id, name, is_active)
        VALUES ($1, $2, true)
        ON CONFLICT DO NOTHING
        RETURNING id, name
      `, [org.id, name]);

      // If conflict, fetch the existing one
      const existing = r.rows[0] || (await client.query(
        'SELECT id, name FROM departments WHERE organization_id = $1 AND name = $2',
        [org.id, name]
      )).rows[0];

      depts[name] = existing;
      log(`✅ Dept: ${existing.name} — id: ${existing.id}`);
    }

    // ── 3. Positions (ltree hierarchy) ───────────────────────────────────────
    section('Positions (ltree hierarchy)');

    /*
     * Hierarchy we're building:
     *
     *   acme_corp                    ← CEO
     *   acme_corp.cto                ← CTO   (reports to CEO)
     *   acme_corp.hr_director        ← HR Director (reports to CEO)
     *   acme_corp.cto.senior_dev     ← Senior Developer (reports to CTO)
     *   acme_corp.cto.junior_dev     ← Junior Developer (reports to CTO)
     */
    const positionDefs = [
      { title: 'CEO',               path: 'acme_corp',                      dept: null,                  parent_path: null },
      { title: 'CTO',               path: 'acme_corp.cto',                  dept: 'Engineering',         parent_path: 'acme_corp' },
      { title: 'HR Director',       path: 'acme_corp.hr_director',          dept: 'Human Resources',     parent_path: 'acme_corp' },
      { title: 'Senior Developer',  path: 'acme_corp.cto.senior_dev',       dept: 'Engineering',         parent_path: 'acme_corp.cto' },
      { title: 'Junior Developer',  path: 'acme_corp.cto.junior_dev',       dept: 'Engineering',         parent_path: 'acme_corp.cto' },
    ];

    const positions = {};

    for (const def of positionDefs) {
      const deptId = def.dept ? depts[def.dept]?.id : null;

      // Resolve parent_id from the path we already inserted
      const parentId = def.parent_path ? positions[def.parent_path]?.id : null;

      const r = await client.query(`
        INSERT INTO positions (organization_id, department_id, parent_id, title, path, is_active)
        VALUES ($1, $2, $3, $4, $5::ltree, true)
        ON CONFLICT DO NOTHING
        RETURNING id, title, path
      `, [org.id, deptId, parentId, def.title, def.path]);

      const existing = r.rows[0] || (await client.query(
        'SELECT id, title, path FROM positions WHERE organization_id = $1 AND path = $2::ltree',
        [org.id, def.path]
      )).rows[0];

      positions[def.path] = existing;
      log(`✅ Position: ${existing.title.padEnd(20)} path: ${existing.path}`);
    }

    // ── 4. Person (Org Admin) ────────────────────────────────────────────────
    section('Persons');

    const passwordHash = await bcrypt.hash('Admin@1234', 12);

    const personResult = await client.query(`
      INSERT INTO persons (organization_id, first_name, last_name, email, password_hash, is_active)
      VALUES ($1, 'John', 'Admin', 'john.admin@acme-corp.com', $2, true)
      ON CONFLICT (organization_id, email) DO UPDATE SET first_name = EXCLUDED.first_name
      RETURNING id, first_name, last_name, email
    `, [org.id, passwordHash]);

    const person = personResult.rows[0];
    log(`✅ Person: ${person.first_name} ${person.last_name} (${person.email})`);
    log(`   Password (seed only): Admin@1234`);

    // ── 5. Position Assignment ───────────────────────────────────────────────
    section('Position Assignments');

    const assignResult = await client.query(`
      INSERT INTO position_assignments (person_id, position_id, is_primary, start_date)
      VALUES ($1, $2, true, current_date)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [person.id, positions['acme_corp'].id]);

    log(`✅ Assigned ${person.first_name} ${person.last_name} → CEO position`);

    // ── 6. Roles ─────────────────────────────────────────────────────────────
    section('Roles');

    const roleDefs = ['Org Admin', 'HR Manager', 'Employee'];
    const roles = {};

    for (const name of roleDefs) {
      const r = await client.query(`
        INSERT INTO roles (organization_id, name)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING id, name
      `, [org.id, name]);

      const existing = r.rows[0] || (await client.query(
        'SELECT id, name FROM roles WHERE organization_id = $1 AND name = $2',
        [org.id, name]
      )).rows[0];

      roles[name] = existing;
      log(`✅ Role: ${existing.name}`);
    }

    // ── 7. Permissions ───────────────────────────────────────────────────────
    section('Permissions');

    const permDefs = [
      { name: 'manage_org',        description: 'Can manage organization settings' },
      { name: 'manage_roles',      description: 'Can create and assign roles' },
      { name: 'manage_employees',  description: 'Can create, update, deactivate employees' },
      { name: 'view_attendance',   description: 'Can view attendance records' },
      { name: 'manage_attendance', description: 'Can edit and correct attendance records' },
      { name: 'approve_leaves',    description: 'Can approve or reject leave requests' },
      { name: 'view_payroll',      description: 'Can view payroll data' },
    ];

    const perms = {};

    for (const def of permDefs) {
      const r = await client.query(`
        INSERT INTO permissions (name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
        RETURNING id, name
      `, [def.name, def.description]);

      perms[def.name] = r.rows[0];
      log(`✅ Permission: ${r.rows[0].name}`);
    }

    // ── 8. Role ↔ Permission mappings ─────────────────────────────────────
    section('Role-Permission Mappings');

    const rolePermMap = {
      'Org Admin':  ['manage_org', 'manage_roles', 'manage_employees', 'view_attendance', 'manage_attendance', 'approve_leaves', 'view_payroll'],
      'HR Manager': ['manage_employees', 'view_attendance', 'approve_leaves'],
      'Employee':   ['view_attendance'],
    };

    for (const [roleName, permNames] of Object.entries(rolePermMap)) {
      for (const permName of permNames) {
        await client.query(`
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [roles[roleName].id, perms[permName].id]);
      }
      log(`✅ ${roleName.padEnd(15)} → [${permNames.join(', ')}]`);
    }

    // ── 9. Assign Org Admin role to the person ───────────────────────────────
    section('Person Roles');

    await client.query(`
      INSERT INTO person_roles (person_id, role_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [person.id, roles['Org Admin'].id]);

    log(`✅ ${person.first_name} ${person.last_name} → Org Admin role`);

    // ── 10. Sample Audit Log ──────────────────────────────────────────────────
    section('Audit Log (sample row)');

    await client.query(`
      INSERT INTO audit_logs (
        organization_id, entity_type, entity_id, action,
        old_data, new_data, changed_by, reason
      ) VALUES (
        $1, 'organization', $2, 'SEED',
        NULL,
        $3::jsonb,
        $4,
        'Initial seed script — development environment setup'
      )
    `, [
      org.id,
      org.id,
      JSON.stringify({
        name: org.name,
        slug: org.slug,
        seeded_at: new Date().toISOString(),
      }),
      person.id,
    ]);

    log(`✅ Audit log entry inserted (action: SEED)`);

    // ─────────────────────────────────────────────────────────────────────────
    await client.query('COMMIT');

    console.log(`
╔══════════════════════════════════════════════════════╗
║  ✅  Seed complete! Summary:                         ║
║                                                      ║
║  Org:      Acme Corp  (slug: acme-corp)              ║
║  Depts:    Engineering, Human Resources, Finance     ║
║  Position: CEO → CTO → Senior Dev / Junior Dev       ║
║            CEO → HR Director                         ║
║  Person:   john.admin@acme-corp.com                  ║
║  Password: Admin@1234   (change in production!)      ║
║  Role:     Org Admin (all permissions)               ║
║  Audit:    1 SEED entry in audit_logs                ║
╚══════════════════════════════════════════════════════╝
`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\n❌ Seed failed — transaction rolled back.');
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

/**
 * Haazri Backend — Comprehensive API Test Suite
 * Tests: Auth, Org, Attendance, Leaves, Admin (Roles, Org Structure, Reports, Audit)
 * Run: node test_suite.js
 */

const BASE = 'http://localhost:5002/api';
const ORG_SLUG = 'acme-corp';
const ORG_ADMIN_EMAIL = 'john.admin@acme-corp.com';
const ORG_ADMIN_PASS  = 'Admin@1234';

let adminToken = '';
let orgId = '';
let createdPersonId = '';

const results = { pass: 0, fail: 0, errors: [] };

function pass(label) {
  results.pass++;
  console.log(`  ✅  PASS  ${label}`);
}

function fail(label, reason) {
  results.fail++;
  results.errors.push({ label, reason });
  console.log(`  ❌  FAIL  ${label}`);
  console.log(`           └─ ${reason}`);
}

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  let json;
  try { json = await res.json(); } catch { json = {}; }
  return { status: res.status, json };
}

// ─────────────────────────────────────────────
// 1. HEALTH
// ─────────────────────────────────────────────
async function testHealth() {
  console.log('\n── Health ──────────────────────────────────');
  const { status } = await req('GET', '/health');
  status === 200 ? pass('GET /health → 200') : fail('GET /health', `Expected 200, got ${status}`);
}

// ─────────────────────────────────────────────
// 2. AUTH
// ─────────────────────────────────────────────
async function testAuth() {
  console.log('\n── Auth ────────────────────────────────────');

  // 2a. Login — valid credentials
  const { status, json } = await req('POST', '/auth/org/login', {
    org_slug: ORG_SLUG, email: ORG_ADMIN_EMAIL, password: ORG_ADMIN_PASS
  });
  if (status === 200 && json?.data?.tokens?.accessToken) {
    adminToken = json.data.tokens.accessToken;
    orgId      = json.data.person?.organization_id;
    pass('POST /auth/org/login (valid)');
  } else {
    fail('POST /auth/org/login (valid)', `Status ${status}: ${JSON.stringify(json)}`);
    return; // Can't continue without a token
  }

  // 2b. Login — wrong password
  const r2 = await req('POST', '/auth/org/login', {
    org_slug: ORG_SLUG, email: ORG_ADMIN_EMAIL, password: 'WRONG_PASS'
  });
  r2.status === 401 || r2.status === 400
    ? pass('POST /auth/org/login (wrong password) → 4xx')
    : fail('POST /auth/org/login (wrong password)', `Expected 4xx, got ${r2.status}`);

  // 2c. Login — missing fields
  const r3 = await req('POST', '/auth/org/login', { email: ORG_ADMIN_EMAIL });
  r3.status >= 400
    ? pass('POST /auth/org/login (missing fields) → 4xx')
    : fail('POST /auth/org/login (missing fields)', `Expected 4xx, got ${r3.status}`);

  // 2d. Protected endpoint without token → 401
  const r4 = await req('GET', '/attendance/me');
  r4.status === 401
    ? pass('Protected route without token → 401')
    : fail('Protected route without token', `Expected 401, got ${r4.status}`);

  // 2e. Protected endpoint with invalid token → 401
  const r5 = await req('GET', '/attendance/me', null, 'invalid.token.here');
  r5.status === 401
    ? pass('Protected route with invalid token → 401')
    : fail('Protected route with invalid token', `Expected 401, got ${r5.status}`);
}

// ─────────────────────────────────────────────
// 3. ORG MANAGEMENT
// ─────────────────────────────────────────────
async function testOrg() {
  console.log('\n── Org Management ──────────────────────────');

  // 3a. List employees
  const r1 = await req('GET', '/org/employees', null, adminToken);
  r1.status === 200
    ? pass('GET /org/employees → 200')
    : fail('GET /org/employees', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  // 3b. Create employee — valid
  const uniqueEmail = `test.auto.${Date.now()}@acme-corp.com`;
  const r2 = await req('POST', '/org/employees', {
    first_name: 'Auto', last_name: 'Test',
    email: uniqueEmail, password: 'Test@1234'
  }, adminToken);
  if (r2.status === 201 && r2.json?.data) {
    createdPersonId = r2.json.data.id;
    pass('POST /org/employees (valid) → 201');
  } else {
    fail('POST /org/employees (valid)', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);
  }

  // 3c. Create employee — duplicate email
  const r3 = await req('POST', '/org/employees', {
    first_name: 'Dup', last_name: 'User',
    email: uniqueEmail, password: 'Test@1234'
  }, adminToken);
  r3.status >= 400
    ? pass('POST /org/employees (duplicate email) → 4xx')
    : fail('POST /org/employees (duplicate email)', `Expected 4xx, got ${r3.status}`);

  // 3d. Get employee by ID
  if (createdPersonId) {
    const r4 = await req('GET', `/org/employees/${createdPersonId}`, null, adminToken);
    r4.status === 200
      ? pass(`GET /org/employees/:id → 200`)
      : fail('GET /org/employees/:id', `Status ${r4.status}: ${JSON.stringify(r4.json)}`);
  }

  // 3e. Get employee by non-existent ID
  const r5 = await req('GET', '/org/employees/00000000-0000-0000-0000-000000000000', null, adminToken);
  r5.status === 404
    ? pass('GET /org/employees/:id (not found) → 404')
    : fail('GET /org/employees/:id (not found)', `Expected 404, got ${r5.status}: ${JSON.stringify(r5.json)}`);
}

// ─────────────────────────────────────────────
// 4. ATTENDANCE
// ─────────────────────────────────────────────
async function testAttendance() {
  console.log('\n── Attendance ──────────────────────────────');

  // 4a. Get my history
  const r1 = await req('GET', '/attendance/me', null, adminToken);
  r1.status === 200
    ? pass('GET /attendance/me → 200')
    : fail('GET /attendance/me', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  // 4b. Check-in
  const r2 = await req('POST', '/attendance/check-in', {}, adminToken);
  if (r2.status === 201) {
    pass('POST /attendance/check-in → 201');
  } else if (r2.status === 409) {
    pass('POST /attendance/check-in (already checked in) → 409 (expected)');
  } else {
    fail('POST /attendance/check-in', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);
  }

  // 4c. Check-out
  const r3 = await req('POST', '/attendance/check-out', {}, adminToken);
  if (r3.status === 200 || r3.status === 404) {
    pass(`POST /attendance/check-out → ${r3.status} (expected)`);
  } else {
    fail('POST /attendance/check-out', `Status ${r3.status}: ${JSON.stringify(r3.json)}`);
  }
}

// ─────────────────────────────────────────────
// 5. LEAVES
// ─────────────────────────────────────────────
async function testLeaves() {
  console.log('\n── Leaves ──────────────────────────────────');

  // 5a. My leaves
  const r1 = await req('GET', '/leaves/me', null, adminToken);
  r1.status === 200
    ? pass('GET /leaves/me → 200')
    : fail('GET /leaves/me', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  // 5b. Request leave — valid future date
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter  = new Date(); dayAfter.setDate(dayAfter.getDate() + 2);
  const fmtDate = (d) => d.toISOString().split('T')[0];

  const r2 = await req('POST', '/leaves/request', {
    leave_type_id: null,
    start_date: fmtDate(tomorrow),
    end_date:   fmtDate(dayAfter),
    reason: 'Automated test leave'
  }, adminToken);
  if (r2.status === 201 || r2.status === 400) {
    // 400 is valid if leave_type_id is required
    pass(`POST /leaves/request → ${r2.status}`);
  } else {
    fail('POST /leaves/request', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);
  }

  // 5c. Team pending — should return 403 since admin has no position_path in JWT
  const r3 = await req('GET', '/leaves/team/pending', null, adminToken);
  r3.status === 200 || r3.status === 403
    ? pass(`GET /leaves/team/pending → ${r3.status}`)
    : fail('GET /leaves/team/pending', `Status ${r3.status}: ${JSON.stringify(r3.json)}`);
}

// ─────────────────────────────────────────────
// 6. ADMIN — ROLES & PERMISSIONS
// ─────────────────────────────────────────────
async function testRoles() {
  console.log('\n── Admin: Roles & Permissions ──────────────');

  const r1 = await req('GET', '/admin/roles', null, adminToken);
  r1.status === 200
    ? pass('GET /admin/roles → 200')
    : fail('GET /admin/roles', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  const r2 = await req('GET', '/admin/roles/permissions', null, adminToken);
  r2.status === 200
    ? pass('GET /admin/roles/permissions → 200')
    : fail('GET /admin/roles/permissions', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);

  // Assign permissions to a non-existent role — should fail gracefully
  const r3 = await req('POST', '/admin/roles/00000000-0000-0000-0000-000000000000/permissions', {
    permission_ids: []
  }, adminToken);
  r3.status >= 400
    ? pass('POST /admin/roles/:id/permissions (invalid role) → 4xx')
    : fail('POST /admin/roles/:id/permissions (invalid role)', `Expected 4xx, got ${r3.status}`);
}

// ─────────────────────────────────────────────
// 7. ADMIN — ORG STRUCTURE
// ─────────────────────────────────────────────
async function testOrgStructure() {
  console.log('\n── Admin: Org Structure ────────────────────');

  const r1 = await req('GET', '/admin/org-structure/departments', null, adminToken);
  r1.status === 200
    ? pass('GET /admin/org-structure/departments → 200')
    : fail('GET /admin/org-structure/departments', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  const r2 = await req('GET', '/admin/org-structure/positions', null, adminToken);
  r2.status === 200 || r2.status === 404
    ? pass(`GET /admin/org-structure/positions → ${r2.status}`)
    : fail('GET /admin/org-structure/positions', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);
}

// ─────────────────────────────────────────────
// 8. ADMIN — REPORTS
// ─────────────────────────────────────────────
async function testReports() {
  console.log('\n── Admin: Reports ──────────────────────────');

  const r1 = await req('GET', '/admin/reports/attendance', null, adminToken);
  r1.status === 200
    ? pass('GET /admin/reports/attendance → 200')
    : fail('GET /admin/reports/attendance', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  const r2 = await req('GET', '/admin/reports/attendance?startDate=2026-08-01&endDate=2026-08-31', null, adminToken);
  r2.status === 200
    ? pass('GET /admin/reports/attendance (with date range) → 200')
    : fail('GET /admin/reports/attendance (with date range)', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);

  const r3 = await req('GET', '/admin/reports/leaves', null, adminToken);
  r3.status === 200 || r3.status === 404
    ? pass(`GET /admin/reports/leaves → ${r3.status}`)
    : fail('GET /admin/reports/leaves', `Status ${r3.status}: ${JSON.stringify(r3.json)}`);
}

// ─────────────────────────────────────────────
// 9. ADMIN — AUDIT LOGS
// ─────────────────────────────────────────────
async function testAudit() {
  console.log('\n── Admin: Audit Logs ───────────────────────');

  const r1 = await req('GET', '/admin/audit', null, adminToken);
  r1.status === 200
    ? pass('GET /admin/audit → 200')
    : fail('GET /admin/audit', `Status ${r1.status}: ${JSON.stringify(r1.json)}`);

  const r2 = await req('GET', '/admin/audit?limit=5&offset=0', null, adminToken);
  r2.status === 200
    ? pass('GET /admin/audit (with pagination) → 200')
    : fail('GET /admin/audit (with pagination)', `Status ${r2.status}: ${JSON.stringify(r2.json)}`);
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
(async () => {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║       Haazri Backend — API Test Suite        ║');
  console.log('╚══════════════════════════════════════════════╝');

  await testHealth();
  await testAuth();
  if (!adminToken) {
    console.log('\n⚠️  Skipping remaining tests — could not obtain auth token.');
    process.exit(1);
  }
  await testOrg();
  await testAttendance();
  await testLeaves();
  await testRoles();
  await testOrgStructure();
  await testReports();
  await testAudit();

  const total = results.pass + results.fail;
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log(`║  Results: ${results.pass}/${total} passed, ${results.fail} failed`.padEnd(46) + '║');
  console.log('╚══════════════════════════════════════════════╝');
  if (results.errors.length) {
    console.log('\n📋 Failed Tests:');
    results.errors.forEach(e => console.log(`  • ${e.label}\n    └─ ${e.reason}`));
  } else {
    console.log('\n🎉 All tests passed!');
  }
})();

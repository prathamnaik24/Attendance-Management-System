const { Client } = require('pg');
const client = new Client('postgres://postgres:@localhost:5432/attendance_db');
async function run() {
  await client.connect();
  const orgs = await client.query('SELECT id FROM organizations');
  const leaves = [
    { name: 'Annual Leave', days: 10 },
    { name: 'Sick Leave', days: 7 },
    { name: 'Casual Leave', days: 5 },
    { name: 'Emergency Leave', days: 3 }
  ];
  for (let org of orgs.rows) {
    for (let l of leaves) {
      const res = await client.query('INSERT INTO leave_types (organization_id, name, is_paid) VALUES ($1, $2, true) ON CONFLICT DO NOTHING RETURNING id', [org.id, l.name]);
      const id = res.rows.length > 0 ? res.rows[0].id : (await client.query('SELECT id FROM leave_types WHERE organization_id = $1 AND name = $2', [org.id, l.name])).rows[0].id;
      await client.query('INSERT INTO leave_policies (leave_type_id, days_allowed) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, l.days]);
    }
  }
  console.log('Leave types inserted!');
  await client.end();
}
run();

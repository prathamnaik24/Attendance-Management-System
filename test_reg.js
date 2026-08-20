const { Pool } = require('pg');
require('dotenv').config({path: './backend/.env'});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const bcrypt = require('bcryptjs');

async function test() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create org
    const orgRes = await client.query(
      `INSERT INTO organizations (name, slug, type, is_active)
       VALUES ($1, $2, $3, true) RETURNING id`,
      ['Burraa', 'burraa-corp', 'Startup']
    );
    const orgId = orgRes.rows[0].id;
    console.log('Org inserted:', orgId);

    // Create person
    const hash = await bcrypt.hash('password', 10);
    const personRes = await client.query(
      `INSERT INTO persons (organization_id, first_name, last_name, email, password_hash, is_active)
       VALUES ($1, $2, $3, $4, $5, true) RETURNING id`,
      [orgId, 'Pratham', 'Naik', 'prathamnaik12321@gmail.com', hash]
    );
    console.log('Person inserted:', personRes.rows[0].id);

    await client.query('ROLLBACK');
    console.log('Success (rolled back)');
  } catch (err) {
    console.error('ERROR:', err.message);
    await client.query('ROLLBACK');
  } finally {
    client.release();
    pool.end();
  }
}
test();

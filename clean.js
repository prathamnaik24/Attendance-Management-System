const { Pool } = require('pg');
require('dotenv').config({path: './backend/.env'});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function clean() {
  await pool.query('DELETE FROM organizations WHERE slug = $1', ['stark-industries']);
  console.log('Cleaned up test data');
  pool.end();
}
clean();

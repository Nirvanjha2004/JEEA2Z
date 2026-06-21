import 'dotenv/config';
import pool from './index.js';

async function listConcepts() {
  try {
    const res = await pool.query('SELECT id, name, slug FROM concepts WHERE chapter_id = 32 ORDER BY id');
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
listConcepts();

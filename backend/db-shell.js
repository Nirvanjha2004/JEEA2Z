import 'dotenv/config';
import pg from 'pg';
import readline from 'readline';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function start() {
  console.log('Connecting to database...');
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('\n--- Live Database Tables ---');
    console.log(res.rows.map(r => r.table_name).join(', ') || '(No tables found)');
    console.log('\nType your SQL query and press Enter. Type "exit" or "quit" to leave.\n');
    
    prompt();
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

function prompt() {
  rl.question('db-shell> ', async (input) => {
    const query = input.trim();
    if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit') {
      await pool.end();
      rl.close();
      process.exit(0);
    }
    
    if (!query) {
      prompt();
      return;
    }
    
    try {
      const res = await pool.query(query);
      if (res.command === 'SELECT') {
        if (res.rows.length > 0) {
          console.table(res.rows);
        } else {
          console.log('0 rows returned.');
        }
      } else {
        console.log(`Query completed: ${res.command} (${res.rowCount || 0} rows affected)`);
      }
    } catch (err) {
      console.error('SQL Error:', err.message);
    }
    console.log('');
    prompt();
  });
}

start();

import pg from 'pg';

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const isRender = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('render.com') || process.env.DATABASE_URL.includes('oregon-postgres'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction || isRender ? { rejectUnauthorized: false } : false
});

export const query = (text, params) => pool.query(text, params);

export default pool;

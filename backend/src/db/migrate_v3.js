import 'dotenv/config';
import { query } from './index.js';

const migrationSQL = `
-- track hint usage per user per day (for free tier rate limiting)
CREATE TABLE IF NOT EXISTS hint_usage (
  id         SERIAL PRIMARY KEY,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  count      INT DEFAULT 1,
  UNIQUE(user_id, date)
);

-- cache hints so same question doesn't call Groq twice
CREATE TABLE IF NOT EXISTS hint_cache (
  question_id  INT PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
  hint_text    TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- formula sheets per chapter
CREATE TABLE IF NOT EXISTS formula_sheets (
  id          SERIAL PRIMARY KEY,
  chapter_id  INT REFERENCES chapters(id) ON DELETE CASCADE UNIQUE,
  intro       TEXT,             -- optional short chapter intro (markdown)
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- individual formulas within a sheet
CREATE TABLE IF NOT EXISTS formulas (
  id              SERIAL PRIMARY KEY,
  sheet_id        INT REFERENCES formula_sheets(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,       -- e.g. "Newton's Second Law"
  latex           TEXT NOT NULL,       -- e.g. "F = ma"
  description     TEXT,                -- plain text explanation
  variables       JSONB,               -- {"F": "Force (N)", "m": "mass (kg)"}
  tags            TEXT[],              -- ["important", "derivation", "frequently asked"]
  order_index     INT NOT NULL DEFAULT 0
);
`;

async function runMigration() {
  try {
    console.log('Running V3 database migration...');
    await query(migrationSQL);
    console.log('V3 Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('V3 Migration failed:', err);
    process.exit(1);
  }
}

runMigration();

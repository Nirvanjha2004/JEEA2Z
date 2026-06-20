import 'dotenv/config';
import { query } from './index.js';

const migrationSQL = `
-- Add pattern_group to concepts table
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS pattern_group TEXT;

-- Add pattern_group, is_numerical, time_estimate_seconds to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS pattern_group TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_numerical BOOLEAN DEFAULT FALSE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_estimate_seconds INT DEFAULT 120;

-- Create question_options table
CREATE TABLE IF NOT EXISTS question_options (
  id          SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_key  TEXT NOT NULL, -- 'A', 'B', 'C', 'D'
  option_text TEXT NOT NULL,
  UNIQUE(question_id, option_key)
);

-- Index for options lookup
CREATE INDEX IF NOT EXISTS idx_question_options_q ON question_options(question_id);
`;

async function runMigration() {
  try {
    console.log('Running V3.7 database migration...');
    await query(migrationSQL);
    console.log('V3.7 Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('V3.7 Migration failed:', err);
    process.exit(1);
  }
}

runMigration();

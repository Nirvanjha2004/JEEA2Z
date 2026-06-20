import 'dotenv/config';
import { query } from './index.js';

const migrationSQL = `
-- 1. Add pattern_group and other new columns to questions table
ALTER TABLE questions 
  ADD COLUMN IF NOT EXISTS pattern_group TEXT,
  ADD COLUMN IF NOT EXISTS is_numerical BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS marks INT DEFAULT 4,
  ADD COLUMN IF NOT EXISTS time_estimate_seconds INT DEFAULT 120,
  ADD COLUMN IF NOT EXISTS solution_text TEXT,
  ADD COLUMN IF NOT EXISTS common_mistake TEXT;

-- 2. Add pattern_group to concepts table
ALTER TABLE concepts 
  ADD COLUMN IF NOT EXISTS pattern_group TEXT;

-- 3. Question options table (for MCQ questions)
CREATE TABLE IF NOT EXISTS question_options (
  id          SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_key  TEXT NOT NULL CHECK(option_key IN ('A','B','C','D')),
  option_text TEXT NOT NULL,
  UNIQUE(question_id, option_key)
);

-- 4. Pattern group mastery (aggregated per user per pattern)
CREATE TABLE IF NOT EXISTS pattern_mastery (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_id      INT REFERENCES chapters(id) ON DELETE CASCADE,
  pattern_group   TEXT NOT NULL,
  questions_total INT DEFAULT 0,
  questions_done  INT DEFAULT 0,
  questions_revisit INT DEFAULT 0,
  accuracy_percent FLOAT DEFAULT 0,
  last_updated    TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, chapter_id, pattern_group)
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_questions_pattern_group ON questions(pattern_group);
CREATE INDEX IF NOT EXISTS idx_questions_chapter_pattern ON questions(chapter_id, pattern_group);
CREATE INDEX IF NOT EXISTS idx_pattern_mastery_user ON pattern_mastery(user_id, chapter_id);
`;

async function runMigration() {
  try {
    console.log('Running V3.7 database schema update...');
    await query(migrationSQL);
    console.log('V3.7 schema update completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('V3.7 schema update failed:', err);
    process.exit(1);
  }
}

runMigration();

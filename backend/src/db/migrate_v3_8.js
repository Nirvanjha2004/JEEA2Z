import 'dotenv/config';
import { query } from './index.js';

const migrationSQL = `
-- 1. Expand question format and type support
ALTER TABLE questions 
  DROP CONSTRAINT IF EXISTS questions_type_check,
  ADD CONSTRAINT questions_type_check 
  CHECK(type IN ('pyq', 'concept', 'practice', 'advanced'));

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS question_format TEXT DEFAULT 'mcq' 
    CHECK(question_format IN ('mcq', 'fill_blank', 'numerical')),
  ADD COLUMN IF NOT EXISTS blank_positions JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS explanation TEXT,
  ADD COLUMN IF NOT EXISTS tolerance FLOAT DEFAULT 0.05,
  ADD COLUMN IF NOT EXISTS unit TEXT;

-- 2. Question options table (for MCQ)
CREATE TABLE IF NOT EXISTS question_options (
  id          SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_key  TEXT NOT NULL CHECK(option_key IN ('A','B','C','D')),
  option_text TEXT NOT NULL,
  UNIQUE(question_id, option_key)
);

-- 3. Pattern group mastery
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

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_questions_pattern_group ON questions(pattern_group);
CREATE INDEX IF NOT EXISTS idx_questions_format ON questions(question_format);
CREATE INDEX IF NOT EXISTS idx_pattern_mastery_user ON pattern_mastery(user_id, chapter_id);
`;

async function runMigration() {
  try {
    console.log('Running V3.8 database schema update...');
    await query(migrationSQL);
    console.log('V3.8 schema update completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('V3.8 schema update failed:', err);
    process.exit(1);
  }
}

runMigration();

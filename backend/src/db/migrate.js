import 'dotenv/config';
import { query } from './index.js';

const migrationSQL = `
-- user notes on a question (personal, private)
CREATE TABLE IF NOT EXISTS question_notes (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- bookmarked questions
CREATE TABLE IF NOT EXISTS bookmarks (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- daily streak tracking
CREATE TABLE IF NOT EXISTS streaks (
  id              SERIAL PRIMARY KEY,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak  INT DEFAULT 0,
  longest_streak  INT DEFAULT 0,
  last_active_date DATE,
  daily_goal      INT DEFAULT 10   -- questions per day
);

-- streak activity log (one row per day per user)
CREATE TABLE IF NOT EXISTS streak_activity (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  solved      INT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- mock tests
CREATE TABLE IF NOT EXISTS mock_tests (
  id           SERIAL PRIMARY KEY,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  scope        TEXT NOT NULL,         -- 'chapter' | 'subject' | 'custom' | 'full'
  scope_id     INT,                   -- chapterId or subjectId (null for custom/full)
  duration_min INT NOT NULL,          -- test duration in minutes
  total_q      INT NOT NULL,
  status       TEXT DEFAULT 'pending' -- 'pending' | 'ongoing' | 'completed'
  CHECK(status IN ('pending','ongoing','completed')),
  score        INT,                   -- marks scored (null until completed)
  max_score    INT,                   -- total possible marks
  created_at   TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- individual question slots inside a mock test
CREATE TABLE IF NOT EXISTS mock_test_questions (
  id           SERIAL PRIMARY KEY,
  test_id      INT REFERENCES mock_tests(id) ON DELETE CASCADE,
  question_id  INT REFERENCES questions(id),
  user_answer  TEXT,                  -- what user submitted (null if skipped)
  is_correct   BOOLEAN,
  time_spent   INT                    -- seconds spent on this question
);

-- spaced repetition queue
CREATE TABLE IF NOT EXISTS spaced_repetition (
  id            SERIAL PRIMARY KEY,
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id   INT REFERENCES questions(id) ON DELETE CASCADE,
  next_review   DATE NOT NULL,
  interval_days INT DEFAULT 1,        -- SM-2 interval
  ease_factor   FLOAT DEFAULT 2.5,    -- SM-2 ease
  repetitions   INT DEFAULT 0,
  UNIQUE(user_id, question_id)
);

-- discussion threads per question
CREATE TABLE IF NOT EXISTS discussion_comments (
  id          SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id   INT REFERENCES discussion_comments(id), -- null = top-level
  content     TEXT NOT NULL,
  upvotes     INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- upvote tracking (prevent duplicate upvotes)
CREATE TABLE IF NOT EXISTS comment_upvotes (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  comment_id INT REFERENCES discussion_comments(id) ON DELETE CASCADE,
  PRIMARY KEY(user_id, comment_id)
);

-- admin flag on users table (add column, don't recreate table)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- public profile flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- correct answer column on questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS correct_answer TEXT;

-- user feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  category    TEXT NOT NULL,
  message     TEXT NOT NULL,
  rating      INT CHECK(rating >= 1 AND rating <= 5),
  created_at  TIMESTAMP DEFAULT NOW()
);
`;

async function runMigration() {
  try {
    console.log('Running V2 database migration...');
    await query(migrationSQL);
    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigration();

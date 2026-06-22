CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL
);

CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id),
  name TEXT NOT NULL,
  order_index INT NOT NULL
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  chapter_id INT REFERENCES chapters(id),
  title TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')) NOT NULL,
  type TEXT CHECK(type IN ('pyq','concept','practice','advanced')) NOT NULL,
  source TEXT,
  solution_url TEXT,
  notes TEXT,
  order_index INT NOT NULL
);

CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  status TEXT CHECK(status IN ('todo','done','revisit')) DEFAULT 'todo',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

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

-- concepts: atomic ideas tested across questions
CREATE TABLE IF NOT EXISTS concepts (
  id          SERIAL PRIMARY KEY,
  chapter_id  INT REFERENCES chapters(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,                    -- 1-2 sentence refresher
  formula_ids INT[] DEFAULT '{}',      -- links to formula_sheets
  question_count INT DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(chapter_id, slug)
);

-- junction: which concepts each question tests
CREATE TABLE IF NOT EXISTS question_concepts (
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  concept_id  INT REFERENCES concepts(id) ON DELETE CASCADE,
  is_primary  BOOLEAN DEFAULT FALSE,   -- main concept being tested
  PRIMARY KEY (question_id, concept_id)
);

-- concept mastery inferred from question performance
CREATE TABLE IF NOT EXISTS concept_mastery (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  concept_id  INT REFERENCES concepts(id) ON DELETE CASCADE,
  questions_attempted INT DEFAULT 0,
  questions_correct   INT DEFAULT 0,
  accuracy_percent    FLOAT DEFAULT 0,
  last_attempted      TIMESTAMP,
  UNIQUE(user_id, concept_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_concepts_chapter ON concepts(chapter_id);
CREATE INDEX IF NOT EXISTS idx_question_concepts_question ON question_concepts(question_id);
CREATE INDEX IF NOT EXISTS idx_question_concepts_concept ON question_concepts(concept_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_user ON concept_mastery(user_id);
CREATE INDEX IF NOT EXISTS idx_concept_mastery_concept ON concept_mastery(concept_id);

-- V3.7 Patterns & Options Columns
ALTER TABLE questions 
  ADD COLUMN IF NOT EXISTS pattern_group TEXT,
  ADD COLUMN IF NOT EXISTS is_numerical BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS marks INT DEFAULT 4,
  ADD COLUMN IF NOT EXISTS time_estimate_seconds INT DEFAULT 120,
  ADD COLUMN IF NOT EXISTS solution_text TEXT,
  ADD COLUMN IF NOT EXISTS common_mistake TEXT;

ALTER TABLE concepts 
  ADD COLUMN IF NOT EXISTS pattern_group TEXT;

-- question_options: stores LaTeX option content for multiple choice questions
CREATE TABLE IF NOT EXISTS question_options (
  id          SERIAL PRIMARY KEY,
  question_id INT REFERENCES questions(id) ON DELETE CASCADE,
  option_key  TEXT NOT NULL CHECK(option_key IN ('A','B','C','D')),
  option_text TEXT NOT NULL,
  UNIQUE(question_id, option_key)
);

-- Pattern group mastery (aggregated per user per pattern)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_pattern_group ON questions(pattern_group);
CREATE INDEX IF NOT EXISTS idx_questions_chapter_pattern ON questions(chapter_id, pattern_group);
CREATE INDEX IF NOT EXISTS idx_pattern_mastery_user ON pattern_mastery(user_id, chapter_id);
CREATE INDEX IF NOT EXISTS idx_question_options_q ON question_options(question_id);

-- V3.8 Interactive formats updates
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

CREATE INDEX IF NOT EXISTS idx_questions_format ON questions(question_format);

-- user feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  category    TEXT NOT NULL,
  message     TEXT NOT NULL,
  rating      INT CHECK(rating >= 1 AND rating <= 5),
  created_at  TIMESTAMP DEFAULT NOW()
);





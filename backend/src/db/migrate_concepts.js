import 'dotenv/config';
import { query } from './index.js';

const tablesSQL = `
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
`;

const conceptsToSeed = [
  {
    name: 'Equations of Motion',
    slug: 'equations-of-motion',
    description: 'Use v=u+at, s=ut+½at², v²=u²+2as for constant acceleration problems.',
    formula_ids: [1, 2, 3],
  },
  {
    name: 'Projectile Motion',
    slug: 'projectile-motion',
    description: 'Resolve into horizontal and vertical components. Horizontal: uniform motion. Vertical: accelerated motion.',
    formula_ids: [5, 6, 7],
  },
  {
    name: 'Relative Velocity',
    slug: 'relative-velocity',
    description: 'Velocity of A relative to B: v_AB = v_A - v_B. Vector subtraction.',
    formula_ids: [],
  },
  {
    name: 'Graphical Analysis',
    slug: 'graphical-analysis',
    description: 'Slope of x-t graph = velocity. Slope of v-t graph = acceleration. Area under v-t = displacement.',
    formula_ids: [],
  },
  {
    name: 'Uniform Circular Motion',
    slug: 'uniform-circular-motion',
    description: 'Centripetal acceleration a = v²/r = rω². Velocity is always tangent to circle.',
    formula_ids: [],
  },
];

const questionLinks = [
  { title: 'Equations of motion with variable acceleration', conceptSlug: 'equations-of-motion', isPrimary: true },
  { title: 'Calculus-based kinematics: position as a function of time', conceptSlug: 'equations-of-motion', isPrimary: true },
  { title: 'Projectile motion on an inclined plane', conceptSlug: 'projectile-motion', isPrimary: true },
  { title: 'Time of flight and range of a projectile at complementary angles', conceptSlug: 'projectile-motion', isPrimary: true },
  { title: 'Relative velocity of two boats crossing a river', conceptSlug: 'relative-velocity', isPrimary: true },
  { title: 'Rain-man problem with relative velocity vectors', conceptSlug: 'relative-velocity', isPrimary: true },
  { title: 'Velocity-time graph analysis for non-uniform motion', conceptSlug: 'graphical-analysis', isPrimary: true },
  { title: 'Circular motion with tangential and centripetal acceleration', conceptSlug: 'uniform-circular-motion', isPrimary: true },
];

async function run() {
  try {
    console.log('1. Creating tables and indices...');
    await query(tablesSQL);

    console.log('2. Seeding concepts for Kinematics (chapter_id = 2)...');
    const conceptMap = {}; // slug -> id
    for (const c of conceptsToSeed) {
      const result = await query(
        `INSERT INTO concepts (chapter_id, name, slug, description, formula_ids)
         VALUES (2, $1, $2, $3, $4)
         ON CONFLICT (chapter_id, slug)
         DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, formula_ids = EXCLUDED.formula_ids
         RETURNING id`,
        [c.name, c.slug, c.description, c.formula_ids]
      );
      conceptMap[c.slug] = result.rows[0].id;
    }

    console.log('3. Linking questions to concepts...');
    for (const link of questionLinks) {
      // Find question by title and chapter_id = 2
      const qRes = await query(
        'SELECT id FROM questions WHERE title = $1 AND chapter_id = 2',
        [link.title]
      );

      if (qRes.rows.length > 0) {
        const questionId = qRes.rows[0].id;
        const conceptId = conceptMap[link.conceptSlug];

        await query(
          `INSERT INTO question_concepts (question_id, concept_id, is_primary)
           VALUES ($1, $2, $3)
           ON CONFLICT (question_id, concept_id)
           DO UPDATE SET is_primary = EXCLUDED.is_primary`,
          [questionId, conceptId, link.isPrimary]
        );
      } else {
        console.warn(`Warning: Question with title "${link.title}" not found. Skipping link.`);
      }
    }

    console.log('4. Updating question_count on concepts...');
    await query(`
      UPDATE concepts c
      SET question_count = (
        SELECT COUNT(*)::int
        FROM question_concepts qc
        WHERE qc.concept_id = c.id
      )
    `);

    console.log('Migration successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();

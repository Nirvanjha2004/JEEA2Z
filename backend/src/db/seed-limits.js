import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Evaluation of Limits using Algebraic and Trigonometric Methods",
    slug: 'limits-algebraic-trig',
    description: "Standard algebraic limits, factorization, rationalization, conjugate multiplication, and trigonometric limits like lim(sin x/x) = 1 and lim((1-cos x)/x^2) = 1/2.",
    formula_ids: [],
    pattern_group: 'limits-algebraic-trig'
  },
  {
    name: "Evaluation of Limits using Exponential, Logarithmic, and Series Expansions",
    slug: 'limits-exponential-log-series',
    description: "Limits involving exponential functions, logarithmic functions, and resolving complex forms using Taylor series expansions.",
    formula_ids: [],
    pattern_group: 'limits-exponential-log-series'
  },
  {
    name: "Indeterminate Forms and L'Hôpital's Rule",
    slug: 'limits-indeterminate-lhopital',
    description: "Standard L'Hôpital's rule for 0/0 and inf/inf forms, converting other indeterminate forms like 0*inf, inf-inf to quotients, and exponential indeterminate forms of type 1^inf, 0^0, and inf^0.",
    formula_ids: [],
    pattern_group: 'limits-indeterminate-lhopital'
  },
  {
    name: "Sandwich Theorem and Limits of Infinite Sums",
    slug: 'limits-sandwich-infinite-sums',
    description: "Squeeze theorem (Sandwich theorem) for oscillating and bounded functions, limits at infinity, and evaluating limits of infinite sums as definite integrals (Riemann sums).",
    formula_ids: [],
    pattern_group: 'limits-sandwich-infinite-sums'
  },
  {
    name: "Continuity of Functions: Piecewise Definitions and Classification of Discontinuities",
    slug: 'continuity-piecewise-discontinuities',
    description: "Proving or checking continuity of piecewise-defined functions, finding parameter values to ensure continuity at boundary points, and identifying types of discontinuities (removable, jump, essential).",
    formula_ids: [],
    pattern_group: 'continuity-piecewise-discontinuities'
  },
  {
    name: "Differentiability of Functions: Left-hand and Right-hand Derivatives",
    slug: 'differentiability-piecewise',
    description: "Proving or checking differentiability of piecewise-defined and modular functions, calculating Left-Hand Derivative (LHD) and Right-Hand Derivative (RHD) using first principles, and relationships between continuity and differentiability.",
    formula_ids: [],
    pattern_group: 'differentiability-piecewise'
  }
];

async function seed() {
  try {
    console.log('Starting Limits & Continuity Seeding (Chapter 40)...');
    
    console.log('Clearing old questions for Chapter 40...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 40');
    
    console.log('1. Seeding Concepts...');
    const conceptMap = {};
    for (const c of concepts) {
      const res = await pool.query(
        `INSERT INTO concepts (chapter_id, name, slug, description, formula_ids, pattern_group)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (chapter_id, slug) 
         DO UPDATE SET 
           name = EXCLUDED.name, 
           description = EXCLUDED.description, 
           formula_ids = EXCLUDED.formula_ids, 
           pattern_group = EXCLUDED.pattern_group
         RETURNING id, slug`,
        [40, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'limits_questions.json');
    const questionsContent = fs.readFileSync(questionsPath, 'utf8');
    const questionsList = JSON.parse(questionsContent);

    console.log(`Found ${questionsList.length} questions in JSON. Seeding...`);
    let orderIndex = 1;
    for (const q of questionsList) {
      const blankPositions = q.blank_positions ? (typeof q.blank_positions === 'string' ? q.blank_positions : JSON.stringify(q.blank_positions)) : '[]';
      
      const qRes = await pool.query(
        `INSERT INTO questions (
          chapter_id, title, difficulty, type, source, notes, 
          order_index, correct_answer, pattern_group, is_numerical, 
          marks, time_estimate_seconds, solution_text, common_mistake, 
          question_format, blank_positions
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id`,
        [
          40,
          q.title,
          q.difficulty,
          q.type,
          q.source || null,
          q.notes || null,
          orderIndex,
          q.correct_answer,
          q.pattern_group,
          q.is_numerical,
          4,
          q.is_numerical ? 180 : 120,
          q.solution_text,
          q.common_mistake,
          q.question_format,
          blankPositions
        ]
      );
      const questionId = qRes.rows[0].id;

      if (q.question_format === 'mcq' && q.options) {
        for (const [key, text] of Object.entries(q.options)) {
          await pool.query(
            `INSERT INTO question_options (question_id, option_key, option_text)
             VALUES ($1, $2, $3)`,
            [questionId, key, text]
          );
        }
      }

      if (q.concept_slugs && q.concept_slugs.length > 0) {
        for (const slug of q.concept_slugs) {
          const conceptId = conceptMap[slug];
          if (conceptId) {
            await pool.query(
              `INSERT INTO question_concepts (question_id, concept_id, is_primary)
               VALUES ($1, $2, $3)
               ON CONFLICT (question_id, concept_id) DO NOTHING`,
              [questionId, conceptId, slug === q.concept_slugs[0]]
            );
          }
        }
      }
      orderIndex++;
    }

    console.log(`Successfully seeded ${questionsList.length} questions.`);

    console.log('3. Re-calculating question_count on concepts...');
    await pool.query(`
      UPDATE concepts c
      SET question_count = (
        SELECT COUNT(*)::int
        FROM question_concepts qc
        WHERE qc.concept_id = c.id
      )
    `);

    console.log('Limits & Continuity seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

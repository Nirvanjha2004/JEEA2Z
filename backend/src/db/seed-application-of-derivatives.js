import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Tangents & Normals",
    slug: 'aod-tangents-normals',
    description: "Finding slopes, equations of tangents and normals to curves at given points, and geometric properties such as subtangent and subnormal lengths.",
    formula_ids: [],
    pattern_group: 'aod-tangents-normals'
  },
  {
    name: "Maxima & Minima",
    slug: 'aod-maxima-minima',
    description: "Finding local and global extrema using first derivative test, second derivative test, and optimization problems involving constraints.",
    formula_ids: [],
    pattern_group: 'aod-maxima-minima'
  },
  {
    name: "Increasing & Decreasing Functions",
    slug: 'aod-increasing-decreasing',
    description: "Determining intervals of monotonicity using the sign of the first derivative, and classifying functions as strictly increasing or decreasing.",
    formula_ids: [],
    pattern_group: 'aod-increasing-decreasing'
  },
  {
    name: "Rate of Change",
    slug: 'aod-rate-of-change',
    description: "Applying derivatives to find rates of change of related quantities with respect to time, using implicit differentiation and the chain rule.",
    formula_ids: [],
    pattern_group: 'aod-rate-of-change'
  },
  {
    name: "Rolle's Theorem & Mean Value Theorem",
    slug: 'aod-rolle-mvt',
    description: "Applying Rolle's theorem and the Mean Value Theorem to verify conditions and find the point c where the instantaneous rate equals the average rate.",
    formula_ids: [],
    pattern_group: 'aod-rolle-mvt'
  },
  {
    name: "Approximations & Errors",
    slug: 'aod-approximations',
    description: "Using linear approximation (differentials) to estimate function values, compute approximate changes, and calculate percentage errors.",
    formula_ids: [],
    pattern_group: 'aod-approximations'
  }
];

async function seed() {
  try {
    console.log('Starting Application of Derivatives Seeding (Chapter 42)...');
    
    console.log('Clearing old questions for Chapter 42...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 42');
    
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
        [42, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'application_of_derivatives_questions.json');
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
          42,
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

    console.log('Application of Derivatives seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

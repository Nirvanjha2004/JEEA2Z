import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const concepts = [
  {
    name: "Fundamental Principles of Counting",
    slug: 'pnc-fundamental-principles',
    description: "Addition and multiplication principles, factorial notation, simple arrangements.",
    formula_ids: [],
    pattern_group: 'pnc-fundamental-principles'
  },
  {
    name: "Permutations (Linear Arrangements)",
    slug: 'pnc-permutations-linear',
    description: "Permutation of n distinct objects taken r at a time, permutation of objects not all distinct (identical objects arrangements), word formation constraints (vowels together, etc.).",
    formula_ids: [],
    pattern_group: 'pnc-permutations-linear'
  },
  {
    name: "Combinations (Selection)",
    slug: 'pnc-combinations-selection',
    description: "Combination of n distinct objects taken r at a time, properties of nCr, selection of one or more objects, divisor problems.",
    formula_ids: [],
    pattern_group: 'pnc-combinations-selection'
  },
  {
    name: "Circular Permutations",
    slug: 'pnc-circular-permutations',
    description: "Circular arrangements of distinct objects, identical objects (necklaces, garlands), constraints in circular seating.",
    formula_ids: [],
    pattern_group: 'pnc-circular-permutations'
  },
  {
    name: "Division & Distribution of Objects",
    slug: 'pnc-division-distribution',
    description: "Partitioning/distribution of distinct objects into groups (equal/unequal sizes), distribution of identical objects into distinct groups (multinomial theorem, stars and bars method).",
    formula_ids: [],
    pattern_group: 'pnc-division-distribution'
  },
  {
    name: "Derangements & Principal Inclusion-Exclusion",
    slug: 'pnc-derangements-inclusion-exclusion',
    description: "Number of permutations where no object goes to its original place (derangements), principle of inclusion-exclusion in counting.",
    formula_ids: [],
    pattern_group: 'pnc-derangements-inclusion-exclusion'
  }
];

async function seed() {
  try {
    console.log('Starting Permutations & Combinations Seeding (Chapter 30)...');
    
    console.log('Clearing old questions for Chapter 30...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 30');
    
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
        [30, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = pathModule.join(__dirname, 'pnc_questions.json');
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
          30,
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

    console.log('Permutations & Combinations seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

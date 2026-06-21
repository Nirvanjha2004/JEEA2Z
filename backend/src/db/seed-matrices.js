import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const concepts = [
  {
    name: "Properties of Determinants & Row/Column Operations",
    slug: 'matrices-determinants-properties',
    description: "Determinant evaluations, row and column operations, properties of determinants, and cyclic factoring.",
    formula_ids: [],
    pattern_group: 'matrices-determinants-properties'
  },
  {
    name: "Types of Matrices & Basic Operations",
    slug: 'matrices-types-operations',
    description: "Symmetric, skew-symmetric, orthogonal, and diagonal matrices, trace, transpose, and matrix power operations.",
    formula_ids: [],
    pattern_group: 'matrices-types-operations'
  },
  {
    name: "Adjoint & Inverse of Matrices",
    slug: 'matrices-adjoint-inverse',
    description: "Adjoint matrix evaluations, inverse matrix properties, double adjoint formulas, and Cayley-Hamilton inverse relations.",
    formula_ids: [],
    pattern_group: 'matrices-adjoint-inverse'
  },
  {
    name: "Cayley-Hamilton Theorem & eigenvalues",
    slug: 'matrices-cayley-hamilton-eigenvalues',
    description: "Characteristic equations, Cayley-Hamilton applications, eigenvalue scaling, power series of matrices, and eigenvalue properties.",
    formula_ids: [],
    pattern_group: 'matrices-cayley-hamilton-eigenvalues'
  },
  {
    name: "System of Linear Equations (Cramer's Rule)",
    slug: 'matrices-linear-systems-cramer',
    description: "Cramer's Rule determinant conditions, consistency, inconsistency, infinite solutions, and parameters.",
    formula_ids: [],
    pattern_group: 'matrices-linear-systems-cramer'
  },
  {
    name: "System of Linear Equations (Matrix Method & Rank)",
    slug: 'matrices-linear-systems-matrix',
    description: "Rouche-Capelli augmented matrix rank consistency rules, matrix method for systems, trivial/non-trivial solutions, and matrix rank calculations.",
    formula_ids: [],
    pattern_group: 'matrices-linear-systems-matrix'
  }
];

async function seed() {
  try {
    console.log('Starting Matrices & Determinants Seeding (Chapter 33)...');
    
    console.log('Clearing old questions for Chapter 33...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 33');
    
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
        [33, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = pathModule.join(__dirname, 'matrices_questions.json');
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
          33,
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

    console.log('Matrices & Determinants seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

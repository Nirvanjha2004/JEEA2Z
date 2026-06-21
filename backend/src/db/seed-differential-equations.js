import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Order, Degree & Formation of Differential Equations",
    slug: 'de-order-degree-formation',
    description: "Determining the order and degree of ordinary differential equations (ODEs), classifying linear vs. non-linear ODEs, and forming differential equations by eliminating arbitrary constants.",
    formula_ids: [],
    pattern_group: 'de-order-degree-formation'
  },
  {
    name: "Variable Separable Method",
    slug: 'de-variable-separable',
    description: "Solving ODEs of the form f(y)dy = g(x)dx, equations reducible to variable separable form via algebraic substitution, and solving initial value problems (IVPs).",
    formula_ids: [],
    pattern_group: 'de-variable-separable'
  },
  {
    name: "Homogeneous Differential Equations",
    slug: 'de-homogeneous',
    description: "Identifying homogeneous equations, solving them using the standard substitution y = vx or x = vy, and associated boundary/initial condition problems.",
    formula_ids: [],
    pattern_group: 'de-homogeneous'
  },
  {
    name: "Linear First-Order Differential Equations",
    slug: 'de-linear-first-order',
    description: "Finding and using Integrating Factors (I.F. = e^(integral P dx)) to solve standard first-order linear ODEs of the form dy/dx + Py = Q.",
    formula_ids: [],
    pattern_group: 'de-linear-first-order'
  },
  {
    name: "Bernoulli's & Reducible Equations",
    slug: 'de-bernoulli-reducible',
    description: "Solving Bernoulli's equations of the form dy/dx + Py = Qy^n using substitution u = y^(1-n), and other specialized function reductions to linear equations.",
    formula_ids: [],
    pattern_group: 'de-bernoulli-reducible'
  },
  {
    name: "Orthogonal Trajectories & Applied Problems",
    slug: 'de-orthogonal-applications',
    description: "Finding orthogonal trajectories of curves in Cartesian and polar forms, and solving applied physical/growth models (e.g. Newton's law of cooling, population growth).",
    formula_ids: [],
    pattern_group: 'de-orthogonal-applications'
  }
];

async function seed() {
  try {
    console.log('Starting Differential Equations Seeding (Chapter 45)...');
    
    console.log('Clearing old questions for Chapter 45...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 45');
    
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
        [45, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'differential_equations_questions.json');
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
          45,
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

    console.log('Differential Equations seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

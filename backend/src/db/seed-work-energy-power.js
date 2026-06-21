import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Work Done by Constant and Variable Forces",
    slug: 'work-done',
    description: 'Calculating work done using dot products, integration of variable forces, and area under force-displacement graphs.',
    formula_ids: [],
    pattern_group: 'work-done'
  },
  {
    name: "Work-Energy Theorem",
    slug: 'work-energy-theorem',
    description: 'Relating work done by all forces (conservative, non-conservative, internal, external) to the change in kinetic energy.',
    formula_ids: [],
    pattern_group: 'work-energy-theorem'
  },
  {
    name: "Potential Energy & Equilibrium",
    slug: 'potential-energy-equilibrium',
    description: 'Understanding potential energy curves, stable/unstable/neutral equilibrium conditions, and conservative forces: F = -dU/dx.',
    formula_ids: [],
    pattern_group: 'equilibrium'
  },
  {
    name: "Conservation of Mechanical Energy",
    slug: 'conservation-of-energy',
    description: 'Applying conservation of mechanical energy in isolated systems, including springs, vertical circular motion, and smooth slides.',
    formula_ids: [],
    pattern_group: 'conservation-of-energy'
  },
  {
    name: "Power Delivery",
    slug: 'power-delivery',
    description: 'Average and instantaneous power, constant power delivery systems, water pumps, and velocity/displacement variations with time.',
    formula_ids: [],
    pattern_group: 'power'
  },
  {
    name: "Collisions & Impulse-Momentum",
    slug: 'collisions-momentum',
    description: 'Elastic and inelastic collisions, coefficient of restitution, oblique collisions, impulse-momentum theorem, and loss of kinetic energy.',
    formula_ids: [],
    pattern_group: 'collisions'
  }
];

async function seed() {
  try {
    console.log('Starting Work, Energy, and Power Seeding...');
    
    console.log('Clearing old questions for Chapter 4...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 4');
    
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
        [4, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'work_energy_power_questions.json');
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
          4,
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

    console.log('Work, Energy, and Power seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Dual Nature of Radiation & Matter",
    slug: 'dual-nature-radiation',
    description: 'Dual nature of radiation, photoelectric effect, Hertz and Lenard\'s observations, Einstein\'s photoelectric equation, de Broglie relation.',
    formula_ids: [],
    pattern_group: 'dual-nature-radiation'
  },
  {
    name: "Bohr's Model & Atomic Spectra",
    slug: 'atomic-structure-bohr',
    description: 'Alpha-particle scattering experiment, Rutherford\'s model of atom, Bohr model, energy levels, hydrogen spectrum series.',
    formula_ids: [],
    pattern_group: 'atomic-structure-bohr'
  },
  {
    name: "Nuclear Decay & Radioactivity",
    slug: 'nuclear-physics-decay',
    description: 'Composition and size of nucleus, mass-energy relation, mass defect, binding energy per nucleon, radioactivity, alpha, beta and gamma particles/rays and their properties, radioactive decay law.',
    formula_ids: [],
    pattern_group: 'nuclear-physics-decay'
  },
  {
    name: "Semiconductors & p-n Junctions",
    slug: 'semiconductors-junctions',
    description: 'Energy bands in solids, intrinsic and extrinsic semiconductors, p-n junction, junction diode, I-V characteristics, Zener diode, transistors.',
    formula_ids: [],
    pattern_group: 'semiconductors-junctions'
  },
  {
    name: "Logic Gates & Boolean Algebra",
    slug: 'logic-gates',
    description: 'Logic gates (OR, AND, NOT, NAND, NOR, XOR), Boolean algebra, truth tables, and simple digital combinations.',
    formula_ids: [],
    pattern_group: 'logic-gates'
  }
];

async function seed() {
  try {
    console.log('Starting Modern Physics Seeding...');
    
    console.log('Clearing old questions for Chapter 13...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 13');
    
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
        [13, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'modern_physics_questions.json');
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
          13,
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

    console.log('Modern Physics seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

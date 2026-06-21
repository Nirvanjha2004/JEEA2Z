import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Biot-Savart Law & Magnetic Field Calculations",
    slug: 'biot-savart-law',
    description: 'Calculating magnetic field (B) using Biot-Savart Law for straight current-carrying wires, circular current loops, and circular arcs.',
    formula_ids: [],
    pattern_group: 'biot-savart-law'
  },
  {
    name: "Ampere's Circuital Law & Solenoids",
    slug: 'amperes-law',
    description: 'Applying Ampere\'s Circuital Law, calculating magnetic field of solid and hollow cylinders, long solenoids, and toroids.',
    formula_ids: [],
    pattern_group: 'amperes-law'
  },
  {
    name: "Motion of Charged Particles in Magnetic Fields",
    slug: 'magnetic-force-charge',
    description: 'Lorentz force, motion of charges in uniform magnetic fields (circular and helical paths), cyclotron principles, and velocity selectors.',
    formula_ids: [],
    pattern_group: 'magnetic-force-charge'
  },
  {
    name: "Force, Torque & Dipole Moment of Current Loops",
    slug: 'magnetic-force-current',
    description: 'Magnetic force on current-carrying conductors, force per unit length between parallel wires, torque on current loops, and magnetic dipole moment of loops and needles.',
    formula_ids: [],
    pattern_group: 'magnetic-force-current'
  },
  {
    name: "Electromagnetic Induction & Faraday/Lenz Laws",
    slug: 'emi-induction',
    description: 'Magnetic flux, Faraday\'s Law of induction, Lenz\'s Law (Lenz\'s drag and eddy currents), motional EMF of translating and rotating rods.',
    formula_ids: [],
    pattern_group: 'emi-induction'
  },
  {
    name: "Inductance & transient L-R/L-C Circuits",
    slug: 'inductance-circuits',
    description: 'Self-inductance, mutual inductance of coaxial coils/solenoids, energy stored in inductors, and growth/decay of current in transient L-R circuits.',
    formula_ids: [],
    pattern_group: 'inductance-circuits'
  }
];

async function seed() {
  try {
    console.log('Starting Magnetism Seeding...');
    
    console.log('Clearing old questions for Chapter 11...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 11');
    
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
        [11, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'magnetism_questions.json');
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
          11,
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

    console.log('Magnetism seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

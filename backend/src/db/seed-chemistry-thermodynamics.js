import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "First Law, State Functions & Work",
    slug: 'first-law-work',
    description: 'Enthalpy, internal energy, pressure-volume work calculations, reversible and irreversible processes, heat capacity relation, and First Law applications.',
    formula_ids: [],
    pattern_group: 'first-law-work'
  },
  {
    name: "Thermochemistry: Reaction Enthalpies & Hess's Law",
    slug: 'thermochemistry-reaction-enthalpy',
    description: 'Standard reaction enthalpies, formation, combustion, neutralization, atomization, phase changes, and Hess\'s law calculations.',
    formula_ids: [],
    pattern_group: 'thermochemistry-reaction-enthalpy'
  },
  {
    name: "Kirchhoff's Law & Bond Enthalpies",
    slug: 'bond-enthalpies-kirchhoff',
    description: 'Calculating reaction enthalpies from bond dissociation energies, resonance energies, and temperature dependence of enthalpies using Kirchhoff\'s equation.',
    formula_ids: [],
    pattern_group: 'bond-enthalpies-kirchhoff'
  },
  {
    name: "Second Law, Entropy Change & Spontaneity",
    slug: 'entropy-spontaneity-second-law',
    description: 'Entropy changes in physical and chemical systems, isolated systems, reversible/irreversible process entropy, Clausius inequality, and spontaneity criteria.',
    formula_ids: [],
    pattern_group: 'entropy-spontaneity-second-law'
  },
  {
    name: "Gibbs Free Energy, Spontaneity & Equilibrium",
    slug: 'gibbs-free-energy-equilibrium',
    description: 'Gibbs energy, spontaneity conditions, temperature dependence of spontaneity (Gibbs-Helmholtz), and standard Gibbs free energy relation to equilibrium constants.',
    formula_ids: [],
    pattern_group: 'gibbs-free-energy-equilibrium'
  },
  {
    name: "Third Law & Calorimetry",
    slug: 'third-law-calorimetry',
    description: 'Calorimetry measurements (bomb calorimeter at constant volume vs constant pressure calorimeter), and Third Law absolute entropies.',
    formula_ids: [],
    pattern_group: 'third-law-calorimetry'
  }
];

async function seed() {
  try {
    console.log('Starting Chemistry Thermodynamics Seeding (Chapter 17)...');
    
    console.log('Clearing old questions for Chapter 17...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 17');
    
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
        [17, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'chemistry_thermodynamics_questions.json');
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
          17,
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

    console.log('Chemistry Thermodynamics seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

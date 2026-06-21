import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Electrochemical Cells & Nernst Equation",
    slug: 'galvanic-nernst',
    description: 'Representation of galvanic cells, standard electrode potentials, calculation of cell potential (EMF) under non-standard conditions using the Nernst equation.',
    formula_ids: [],
    pattern_group: 'galvanic-nernst'
  },
  {
    name: "Gibbs Free Energy & Cell Equilibrium",
    slug: 'gibbs-equilibrium-emf',
    description: 'Thermodynamic relationships in cells, including free energy change (ΔG° = -nFE°), maximum work done, and calculation of equilibrium constants (K) from cell potentials.',
    formula_ids: [],
    pattern_group: 'gibbs-equilibrium-emf'
  },
  {
    name: "Electrolytic Conductance & Kohlrausch's Law",
    slug: 'conductance-kohlrausch',
    description: 'Electrolytic conductivity, molar conductivity, equivalent conductivity, Debye-Huckel-Onsager equation, and Kohlrausch\'s Law of independent migration of ions with its applications.',
    formula_ids: [],
    pattern_group: 'conductance-kohlrausch'
  },
  {
    name: "Electrolysis & Faraday's Laws",
    slug: 'electrolysis-faraday',
    description: 'Quantitative aspect of electrolysis using Faraday\'s first and second laws, current efficiency, and prediction of electrolysis products in molten or aqueous states.',
    formula_ids: [],
    pattern_group: 'electrolysis-faraday'
  },
  {
    name: "Batteries, Fuel Cells & Corrosion",
    slug: 'batteries-corrosion',
    description: 'Working principles of primary batteries (dry cell, mercury cell), secondary batteries (lead storage, Ni-Cd), hydrogen-oxygen fuel cells, and electrochemical mechanisms of rusting and corrosion prevention.',
    formula_ids: [],
    pattern_group: 'batteries-corrosion'
  },
  {
    name: "Concentration Cells & Redox Applications",
    slug: 'concentration-cells-redox',
    description: 'EMF calculations of concentration cells (electrolyte and electrode concentration cells), liquid junction potential, salt bridge functions, and applications in pH and solubility product (Ksp) determinations.',
    formula_ids: [],
    pattern_group: 'concentration-cells-redox'
  }
];

async function seed() {
  try {
    console.log('Starting Electrochemistry Seeding (Chapter 19)...');
    
    console.log('Clearing old questions for Chapter 19...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 19');
    
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
        [19, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'electrochemistry_questions.json');
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
          19,
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

    console.log('Electrochemistry seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

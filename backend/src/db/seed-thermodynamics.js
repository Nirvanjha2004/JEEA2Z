import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Thermal Expansion, Calorimetry & Heat Transfer",
    slug: 'calorimetry-heat-transfer',
    description: 'Thermal expansion of solids/liquids, calorimetry principles, and mechanisms of heat transfer (conduction, radiation, Stefan\'s law, Newton\'s law of cooling).',
    formula_ids: [],
    pattern_group: 'calorimetry-heat-transfer'
  },
  {
    name: "Kinetic Theory of Gases",
    slug: 'kinetic-theory-gases',
    description: 'Ideal gas behavior, calculations of RMS speed, mean free path, degrees of freedom, and the law of equipartition of energy.',
    formula_ids: [],
    pattern_group: 'ktg'
  },
  {
    name: "First Law & Thermodynamic Processes",
    slug: 'thermodynamic-processes',
    description: 'First Law of Thermodynamics (Q = ΔU + W), internal energy changes, and specific processes (isothermal, adiabatic, isobaric, isochoric, cyclic, polytropic).',
    formula_ids: [],
    pattern_group: 'thermodynamic-processes'
  },
  {
    name: "Work in Gas Expansion & PV Diagrams",
    slug: 'thermodynamic-work',
    description: 'Calculating work done by or on a gas using integration, cyclic path areas, and graphical analysis of PV/PT/VT diagrams.',
    formula_ids: [],
    pattern_group: 'thermodynamic-work'
  },
  {
    name: "Specific Heat Capacities of Gases",
    slug: 'specific-heats',
    description: 'Molar heat capacities Cp and Cv, their relationship (Cp - Cv = R), degrees of freedom dependency, and specific heats of gas mixtures.',
    formula_ids: [],
    pattern_group: 'specific-heats'
  },
  {
    name: "Second Law, Engines & Carnot Cycle",
    slug: 'heat-engines-carnot',
    description: 'Heat engines, refrigerators, coefficients of performance, heat pumps, Carnot cycle efficiency, and entropy concept.',
    formula_ids: [],
    pattern_group: 'heat-engines-carnot'
  }
];

async function seed() {
  try {
    console.log('Starting Thermodynamics Seeding...');
    
    console.log('Clearing old questions for Chapter 7...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 7');
    
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
        [7, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'thermodynamics_questions.json');
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
          7,
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

    console.log('Thermodynamics seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

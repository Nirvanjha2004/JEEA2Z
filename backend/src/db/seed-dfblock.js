import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Electronic Configurations & Periodic Trends",
    slug: 'df-electronic-trends',
    description: "Electronic configurations of transition metals (anomalies in Cr and Cu), variable oxidation states, trends in atomic/ionic radii, ionization enthalpies, and enthalpy of atomization.",
    formula_ids: [],
    pattern_group: 'df-electronic-trends'
  },
  {
    name: "Magnetic & Physical Properties",
    slug: 'df-magnetic-properties',
    description: "d-d transitions and origin of color in transition metal ions, calculation of spin-only magnetic moments, and properties of non-stoichiometric interstitial compounds and catalysts.",
    formula_ids: [],
    pattern_group: 'df-magnetic-properties'
  },
  {
    name: "Alloy Formation & Chemical Reactivity",
    slug: 'df-alloys-reactivity',
    description: "Conditions for alloy formation, chemical reactivity trends, standard electrode potentials (Mn, Cr, Co redox couples), and stabilization of high states in oxides/fluorides.",
    formula_ids: [],
    pattern_group: 'df-alloys-reactivity'
  },
  {
    name: "Transition Compounds: Potassium Permanganate",
    slug: 'df-potassium-permanganate',
    description: "Industrial preparation of KMnO4 from pyrolusite ore, green manganate vs purple permanganate properties, LMCT color mechanism, and oxidation reactions in different media.",
    formula_ids: [],
    pattern_group: 'df-potassium-permanganate'
  },
  {
    name: "Transition Compounds: Potassium Dichromate",
    slug: 'df-potassium-dichromate',
    description: "Preparation of K2Cr2O7 from chromite ore, pH-dependent interconversion of chromate/dichromate, structures of chromate/dichromate, oxidizing actions, and the chromyl chloride test.",
    formula_ids: [],
    pattern_group: 'df-potassium-dichromate'
  },
  {
    name: "Lanthanoids & Actinoids",
    slug: 'df-lanthanoids-actinoids',
    description: "Lanthanoid electronic configurations, +3 oxidation state, Ce(IV) and Eu(II) stability, Lanthanoid Contraction (cause and consequences), and comparison with Actinoid electronic configurations and contraction.",
    formula_ids: [],
    pattern_group: 'df-lanthanoids-actinoids'
  }
];

async function seed() {
  try {
    console.log('Starting d & f Block Elements Seeding (Chapter 26)...');
    
    console.log('Clearing old questions for Chapter 26...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 26');
    
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
        [26, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'dfblock_questions.json');
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
          26,
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

    console.log('d & f Block Elements seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Structure & Preparations of Amines",
    slug: 'amines-preparation',
    description: 'Gabriel phthalimide synthesis, Hofmann bromamide degradation (mechanism, migration step), Hofmann\'s ammonolysis of alkyl halides, and reduction methods for nitro, nitrile, and amide compounds.',
    formula_ids: [],
    pattern_group: 'amines-preparation'
  },
  {
    name: "Basicity of Amines",
    slug: 'amines-basicity',
    description: 'Basicity orders of aliphatic amines in gaseous vs aqueous phases (competing +I effect, solvation/hydrogen-bonding, and steric hindrance), and comparison of aliphatic vs aromatic amines (resonance deactivation in aniline).',
    formula_ids: [],
    pattern_group: 'amines-basicity'
  },
  {
    name: "Chemical Reactions & Distinguishing Tests",
    slug: 'amines-reactions',
    description: 'Hinsberg test (benzenesulfonyl chloride) to distinguish 1°, 2°, and 3° amines, carbylamine reaction (isocyanide test), acylation/alkylation, and reaction of 1°, 2°, 3° amines with nitrous acid (HNO2).',
    formula_ids: [],
    pattern_group: 'amines-reactions'
  },
  {
    name: "Diazonium Salts: Preparation & Coupling",
    slug: 'diazonium-preparation-coupling',
    description: 'Diazotization mechanism, comparative stability of aromatic and aliphatic diazonium salts, and electrophilic diazonium coupling reactions with phenol, aniline, and beta-naphthol to form colored azo dyes.',
    formula_ids: [],
    pattern_group: 'diazonium-preparation-coupling'
  },
  {
    name: "Diazonium Salts: Substitution Reactions",
    slug: 'diazonium-substitutions',
    description: 'Sandmeyer and Gattermann reactions, Balz-Schiemann fluorination, substitution by iodine (KI), reduction to hydrocarbons using H3PO2 or ethanol, and conversion to phenols.',
    formula_ids: [],
    pattern_group: 'diazonium-substitutions'
  },
  {
    name: "EAS of Aromatic Amines & Protection",
    slug: 'aromatic-amines-substitution',
    description: 'Highly activating nature of the -NH2 group, acetylation protection (acetanilide) to direct mono-substitution, bromination/nitration/sulfonation of aniline, and the zwitterion structure of sulfanilic acid.',
    formula_ids: [],
    pattern_group: 'aromatic-amines-substitution'
  }
];

async function seed() {
  try {
    console.log('Starting Amines Seeding (Chapter 23)...');
    
    console.log('Clearing old questions for Chapter 23...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 23');
    
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
        [23, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'amines_questions.json');
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
          23,
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

    console.log('Amines seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

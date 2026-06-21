import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Alkanes & Conformers",
    slug: 'alkanes-conformers',
    description: 'Free radical halogenation mechanism, selectivity/reactivity of halogens, Wurtz reaction, Kolbe\'s electrolysis, decarboxylation, and conformational analysis of alkanes (ethane, propane, n-butane) and cyclohexane (axial vs equatorial stability).',
    formula_ids: [],
    pattern_group: 'alkanes-conformers'
  },
  {
    name: "Alkenes: Synthesis & Elimination Rules",
    slug: 'alkenes-elimination',
    description: 'Dehydrohalogenation, dehydration of alcohols, Lindlar vs Birch reductions, Saytzeff vs Hofmann rules, E2 stereochemistry, pyrolytic syn-eliminations, and rearrangements during elimination.',
    formula_ids: [],
    pattern_group: 'alkenes-elimination'
  },
  {
    name: "Alkenes: Addition & Oxidation Reactions",
    slug: 'alkenes-additions',
    description: 'Electrophilic addition of halogens and hydrogen halides (Markovnikov and peroxide anti-Markovnikov additions), stereochemistry of additions (syn/anti), hydroboration-oxidation, oxymercuration-demercuration, epoxidation, and ozonolysis (reductive/oxidative).',
    formula_ids: [],
    pattern_group: 'alkenes-additions'
  },
  {
    name: "Alkynes: Synthesis, Acidity & Hydration",
    slug: 'alkynes-reactions',
    description: 'Synthesis of alkynes, acidic character of terminal alkynes (formation of metal acetylides), addition reactions (halogenation, hydrohalogenation, hydration/Kucherov reaction, tautomerism), and cyclic polymerization.',
    formula_ids: [],
    pattern_group: 'alkynes-reactions'
  },
  {
    name: "Aromatic Hydrocarbons & EAS Mechanism",
    slug: 'aromatic-eas-mechanisms',
    description: 'Aromaticity (Huckel\'s rule), mechanisms of Electrophilic Aromatic Substitution (halogenation, nitration, sulfonation, Friedel-Crafts alkylation and acylation), carbocation rearrangements in alkylation, and side-chain reactions (halogenation, oxidation).',
    formula_ids: [],
    pattern_group: 'aromatic-eas-mechanisms'
  },
  {
    name: "Directive Influence & Disubstituted Benzenes",
    slug: 'directive-influence-eas',
    description: 'Directive and activating/deactivating effects of substituents (ortho/para vs meta directors), EAS on disubstituted benzenes, protection of functional groups (acylation of aniline), and Birch reduction of substituted benzenes.',
    formula_ids: [],
    pattern_group: 'directive-influence-eas'
  }
];

async function seed() {
  try {
    console.log('Starting Hydrocarbons Seeding (Chapter 21)...');
    
    console.log('Clearing old questions for Chapter 21...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 21');
    
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
        [21, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'hydrocarbons_questions.json');
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
          21,
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

    console.log('Hydrocarbons seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

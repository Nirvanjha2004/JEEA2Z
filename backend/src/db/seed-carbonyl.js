import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Carbonyl Structure & Preparations",
    slug: 'carbonyl-preparation',
    description: 'Electronic structure of the carbonyl group, relative reactivity/stability, preparation methods (Rosenmund reduction, Stephen reaction, Gattermann-Koch reaction, Etard reaction, hydration of alkynes, and ozonolysis of alkenes).',
    formula_ids: [],
    pattern_group: 'carbonyl-preparation'
  },
  {
    name: "Nucleophilic Additions to Carbonyls",
    slug: 'nucleophilic-addition',
    description: 'Mechanism of nucleophilic additions, relative reactivity of aldehydes vs ketones, additions of HCN, NaHSO3, alcohols (acetals/ketals), Grignard reagents, and water.',
    formula_ids: [],
    pattern_group: 'nucleophilic-addition'
  },
  {
    name: "Reactions with Ammonia Derivatives",
    slug: 'ammonia-derivatives-addition',
    description: 'Nucleophilic addition-elimination mechanism, reactions with hydroxylamine (oximes), hydrazine (hydrazones), phenylhydrazine, semicarbazide, and 2,4-dinitrophenylhydrazine (2,4-DNP / Brady\'s reagent).',
    formula_ids: [],
    pattern_group: 'ammonia-derivatives-addition'
  },
  {
    name: "Aldol, Cannizzaro & Related Name Reactions",
    slug: 'aldol-cannizzaro',
    description: 'Aldol condensation (self, cross, intramolecular), Cannizzaro reaction (self, cross, intramolecular), Claisen-Schmidt condensation, and the role of alpha-hydrogens and base concentration.',
    formula_ids: [],
    pattern_group: 'aldol-cannizzaro'
  },
  {
    name: "Oxidation, Reduction & Carbonyl Tests",
    slug: 'oxidation-reduction-tests',
    description: 'Tollens\' test, Fehling\'s and Benedict\'s tests, haloform reaction (iodoform test), Clemmensen reduction, Wolff-Kishner reduction, and complex metal hydride reductions (LiAlH4/NaBH4).',
    formula_ids: [],
    pattern_group: 'oxidation-reduction-tests'
  },
  {
    name: "Advanced Carbonyl Reactions & Synthesis",
    slug: 'carbonyl-advanced-reactions',
    description: 'Wittig reaction, Beckmann rearrangement, electrophilic substitution of aromatic carbonyls (meta-direction of -CHO/-COR), and multi-step synthesis pathways.',
    formula_ids: [],
    pattern_group: 'carbonyl-advanced-reactions'
  }
];

async function seed() {
  try {
    console.log('Starting Carbonyl Seeding (Chapter 22)...');
    
    console.log('Clearing old questions for Chapter 22...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 22');
    
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
        [22, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'carbonyl_questions.json');
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
          22,
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

    console.log('Carbonyl seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

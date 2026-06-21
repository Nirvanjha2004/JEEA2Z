import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Group 13 Elements: Boron Family",
    slug: 'pblock-group-13',
    description: "Boron family trends, electronic configuration, anomalous behavior of Boron, structure and bonding of diborane (3-center-2-electron bonds), borax, boric acid, and boron halides.",
    formula_ids: [],
    pattern_group: 'pblock-group-13'
  },
  {
    name: "Group 14 Elements: Carbon Family",
    slug: 'pblock-group-14',
    description: "Carbon family trends, catenation, allotropes of carbon (diamond, graphite, fullerenes), silicates classification and structures, silicones, and oxides of carbon and silicon.",
    formula_ids: [],
    pattern_group: 'pblock-group-14'
  },
  {
    name: "Group 15 Elements: Nitrogen Family",
    slug: 'pblock-group-15',
    description: "Nitrogen family trends, anomalous properties of nitrogen, preparation and properties of dinitrogen, ammonia, nitric acid oxidation reactions, allotropes of phosphorus, phosphorus halides, and oxoacids of phosphorus.",
    formula_ids: [],
    pattern_group: 'pblock-group-15'
  },
  {
    name: "Group 16 Elements: Oxygen Family",
    slug: 'pblock-group-16',
    description: "Oxygen family trends, anomalous properties of oxygen, ozone preparation and structures, allotropes of sulfur, sulfur dioxide and trioxide, sulfuric acid Contact process, and oxoacids of sulfur (peroxo linkages).",
    formula_ids: [],
    pattern_group: 'pblock-group-16'
  },
  {
    name: "Group 17 Elements: Halogen Family",
    slug: 'pblock-group-17',
    description: "Halogen family trends, electron gain enthalpies, anomalous behavior of fluorine, chlorine manufacture by Deacon's process, hydrogen halides, oxoacids of halogens, and interhalogen compounds structures.",
    formula_ids: [],
    pattern_group: 'pblock-group-17'
  },
  {
    name: "Group 18 Elements: Noble Gases",
    slug: 'pblock-group-18',
    description: "Physical and chemical properties of noble gases, Bartlett's first compound, Xenon fluorides preparation, structure, shapes, hybridization, and hydrolysis reactions.",
    formula_ids: [],
    pattern_group: 'pblock-group-18'
  }
];

async function seed() {
  try {
    console.log('Starting p-Block Elements Seeding (Chapter 25)...');
    
    console.log('Clearing old questions for Chapter 25...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 25');
    
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
        [25, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'pblock_questions.json');
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
          25,
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

    console.log('p-Block Elements seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

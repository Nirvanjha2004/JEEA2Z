import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const concepts = [
  {
    name: "Equations of a Circle & Tangent basics",
    slug: 'circles-equations-tangents',
    description: "Standard, central, and general equations of a circle, intercept made by a circle on the coordinate axes, parametric equations, and position of a point with respect to a circle.",
    formula_ids: [],
    pattern_group: 'circles-equations-tangents'
  },
  {
    name: "Tangent Properties & Equations",
    slug: 'circles-tangent-properties',
    description: "Condition for a line y = mx + c to be a tangent to a circle, equations of tangents in point form, slope form, and parametric form, and length of a tangent.",
    formula_ids: [],
    pattern_group: 'circles-tangent-properties'
  },
  {
    name: "Normal to a Circle & Orthogonality",
    slug: 'circles-normals-orthogonality',
    description: "Equation of a normal to a circle (passing through center), condition for orthogonal circles, and angle of intersection of two circles.",
    formula_ids: [],
    pattern_group: 'circles-normals-orthogonality'
  },
  {
    name: "Chord of Contact & Chord with a Given Midpoint",
    slug: 'circles-chords-midpoints',
    description: "Equation of the chord of contact from an external point, equation of a chord of a circle with a given midpoint, and length of intercept chord.",
    formula_ids: [],
    pattern_group: 'circles-chords-midpoints'
  },
  {
    name: "Common Tangents & Radical Axis",
    slug: 'circles-common-tangents-radical',
    description: "Relative positions of two circles, number of common tangents (direct and transverse), radical axis, radical center, and properties of the radical axis.",
    formula_ids: [],
    pattern_group: 'circles-common-tangents-radical'
  },
  {
    name: "Family of Circles",
    slug: 'circles-family-of-circles',
    description: "Family of circles passing through the intersection of a circle and a line, intersection of two circles, and passing through two given points.",
    formula_ids: [],
    pattern_group: 'circles-family-of-circles'
  }
];

async function seed() {
  try {
    console.log('Starting Circles Seeding (Chapter 37)...');
    
    console.log('Clearing old questions for Chapter 37...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 37');
    
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
        [37, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = pathModule.join(__dirname, 'circles_questions.json');
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
          37,
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

    console.log('Circles seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

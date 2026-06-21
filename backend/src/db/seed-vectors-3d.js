import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Vector Operations & Linear Combinations",
    slug: 'vectors-operations-linear',
    description: "Vector addition/subtraction, scalar multiplication, unit vectors, position vectors, collinearity, section formula, and linear independence.",
    formula_ids: [],
    pattern_group: 'vectors-operations-linear'
  },
  {
    name: "Scalar (Dot) and Vector (Cross) Products",
    slug: 'vectors-dot-cross',
    description: "Evaluating dot and cross products, vector projection, finding angles between vectors, and computing areas of triangles and parallelograms.",
    formula_ids: [],
    pattern_group: 'vectors-dot-cross'
  },
  {
    name: "Scalar and Vector Triple Products",
    slug: 'vectors-triple-products',
    description: "Computations involving scalar triple products [a, b, c], volume of parallelepipeds, coplanarity of vectors, vector triple product a x (b x c), and related vector identities.",
    formula_ids: [],
    pattern_group: 'vectors-triple-products'
  },
  {
    name: "Three-Dimensional Coordinates & Lines",
    slug: '3d-coords-lines',
    description: "Direction cosines/direction ratios, vector/Cartesian equations of lines in 3D, finding the angle between two lines, intersecting lines, and computing shortest distance between skew/parallel lines.",
    formula_ids: [],
    pattern_group: '3d-coords-lines'
  },
  {
    name: "Equations & Properties of Planes",
    slug: '3d-planes',
    description: "General, intercept, and normal forms of equations of planes; planes passing through a point, three points, or the intersection of two planes; angle between planes, and perpendicular distance from a point to a plane.",
    formula_ids: [],
    pattern_group: '3d-planes'
  },
  {
    name: "Line-Plane Intersections & Projections",
    slug: '3d-line-plane-intersections',
    description: "Angle between a line and a plane, finding the intersection point of a line and a plane, foot of perpendicular and image of a point with respect to a plane or line, and coplanarity of lines.",
    formula_ids: [],
    pattern_group: '3d-line-plane-intersections'
  }
];

async function seed() {
  try {
    console.log('Starting Vectors & 3D Seeding (Chapter 46)...');
    
    console.log('Clearing old questions for Chapter 46...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 46');
    
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
        [46, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'vectors_3d_questions.json');
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
          46,
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

    console.log('Vectors & 3D seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

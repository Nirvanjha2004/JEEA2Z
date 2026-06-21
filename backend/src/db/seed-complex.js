import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pathModule from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const concepts = [
  {
    name: "Modulus, Conjugate, Argument & Polar/Euler Form",
    slug: 'complex-modulus-argument-polar',
    description: "Modulus and argument properties, polar form, Euler form, conjugate properties, and basic operations.",
    formula_ids: [],
    pattern_group: 'complex-modulus-argument-polar'
  },
  {
    name: "Cube Roots of Unity & Properties",
    slug: 'complex-cube-roots-unity',
    description: "Properties of omega and omega^2, algebraic identities involving cube roots of unity, and quadratic equations with complex roots.",
    formula_ids: [],
    pattern_group: 'complex-cube-roots-unity'
  },
  {
    name: "De Moivre's Theorem & n-th Roots of Unity",
    slug: 'complex-demoivre-roots',
    description: "De Moivre's theorem, powers of complex numbers, and properties of n-th roots of unity.",
    formula_ids: [],
    pattern_group: 'complex-demoivre-roots'
  },
  {
    name: "Rotation Theorem & Argand Plane Geometry",
    slug: 'complex-rotation-argand',
    description: "Rotation theorem of complex numbers, triangles, squares, and polygonal shapes in the Argand plane.",
    formula_ids: [],
    pattern_group: 'complex-rotation-argand'
  },
  {
    name: "Locus Problems & Equations of Circles and Lines",
    slug: 'complex-geometry-locus',
    description: "Straight lines, circles, ellipses, and other locus equations in complex form.",
    formula_ids: [],
    pattern_group: 'complex-geometry-locus'
  },
  {
    name: "Triangle Inequality & Bounds",
    slug: 'complex-triangle-inequality-bounds',
    description: "Triangle inequality properties, upper and lower bounds of complex expressions, and extremum problems.",
    formula_ids: [],
    pattern_group: 'complex-triangle-inequality-bounds'
  }
];

async function seed() {
  try {
    console.log('Starting Complex Numbers Seeding (Chapter 32)...');
    
    console.log('Clearing old questions for Chapter 32...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 32');
    
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
        [32, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = pathModule.join(__dirname, 'complex_questions.json');
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
          32,
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

    console.log('Complex Numbers seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

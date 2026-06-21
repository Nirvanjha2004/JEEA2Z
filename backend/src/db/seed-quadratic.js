import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Roots, Coefficients, & Nature of Roots",
    slug: 'quadratic-nature-roots-vieta',
    description: "Relationship between roots and coefficients (Vieta's formulas), symmetric functions of roots, discriminant, conditions for real, imaginary, rational, or equal roots.",
    formula_ids: [],
    pattern_group: 'quadratic-nature-roots-vieta'
  },
  {
    name: "Common Roots Condition",
    slug: 'quadratic-common-roots',
    description: "Mathematical conditions for quadratic equations sharing one common root or both roots.",
    formula_ids: [],
    pattern_group: 'quadratic-common-roots'
  },
  {
    name: "Location of Roots (Boundary Conditions)",
    slug: 'quadratic-location-roots',
    description: "Positioning of roots relative to real constants (both roots greater than k, less than k, one root in interval, etc.).",
    formula_ids: [],
    pattern_group: 'quadratic-location-roots'
  },
  {
    name: "Range of Quadratic & Rational Expressions",
    slug: 'quadratic-range-expressions',
    description: "Maximum and minimum values of quadratic expressions, finding the range of rational expressions of the form (ax^2+bx+c)/(px^2+qx+r).",
    formula_ids: [],
    pattern_group: 'quadratic-range-expressions'
  },
  {
    name: "Equations Reducible to Quadratic Form",
    slug: 'quadratic-reducible-equations',
    description: "Solving equations that can be converted to quadratic equations using substitutions (exponential, logarithmic, trigonometric, radical, or higher-power polynomials).",
    formula_ids: [],
    pattern_group: 'quadratic-reducible-equations'
  },
  {
    name: "Cubic & Higher Degree Polynomials",
    slug: 'quadratic-higher-polynomials',
    description: "Roots of cubic and quartic equations, relations between roots and coefficients for higher-order polynomials, Descartes' rule of signs, and factorization.",
    formula_ids: [],
    pattern_group: 'quadratic-higher-polynomials'
  }
];

async function seed() {
  try {
    console.log('Starting Quadratic Equations Seeding (Chapter 28)...');
    
    console.log('Clearing old questions for Chapter 28...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 28');
    
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
        [28, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'quadratic_questions.json');
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
          28,
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

    console.log('Quadratic Equations seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

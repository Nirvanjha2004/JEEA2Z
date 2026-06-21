import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concepts = [
  {
    name: "Werner's Theory & IUPAC Nomenclature",
    slug: 'coordination-nomenclature-werner',
    description: "Primary and secondary valency rules of Werner, precipitation reactions with AgNO3, molar conductivity of complexes, and IUPAC nomenclature (naming rules of anionic/cationic complexes and ambidentate ligands).",
    formula_ids: [],
    pattern_group: 'coordination-nomenclature-werner'
  },
  {
    name: "Isomerism in Coordination Complexes",
    slug: 'coordination-isomerism',
    description: "Structural isomerism (ionization, solvate, linkage, coordination) and stereoisomerism (geometrical cis/trans and fac/mer in square planar/octahedral geometries; optical active/inactive enantiomers, especially in bis/tris-chelated systems).",
    formula_ids: [],
    pattern_group: 'coordination-isomerism'
  },
  {
    name: "Valence Bond Theory & Hybridization",
    slug: 'coordination-vbt',
    description: "Inner orbital (d2sp3) vs outer orbital (sp3d2) octahedral complexes, square planar (dsp2) vs tetrahedral (sp3) 4-coordinate geometries, and calculations of spin-only magnetic moments.",
    formula_ids: [],
    pattern_group: 'coordination-vbt'
  },
  {
    name: "Crystal Field Theory & CFSE",
    slug: 'coordination-cft-cfse',
    description: "Crystal field splitting of d-orbitals in octahedral (t2g, eg) and tetrahedral (e, t2) fields, crystal field splitting energy (Δo, Δt), calculation of Crystal Field Stabilization Energy (CFSE), and pairing energy (P).",
    formula_ids: [],
    pattern_group: 'coordination-cft-cfse'
  },
  {
    name: "Color, Spectrochemical Series & Magnetism",
    slug: 'coordination-magnetic-color',
    description: "Origin of color in complexes (d-d transitions, absorption/complementary light), factors affecting Δo, spectrochemical series (weak-field vs strong-field ligands), and low-spin vs high-spin properties of 4d/5d transition metals.",
    formula_ids: [],
    pattern_group: 'coordination-magnetic-color'
  },
  {
    name: "Stability & Synergic Carbonyl Bonding",
    slug: 'coordination-stability-carbonyls',
    description: "Stability of complexes (stability constants, chelate effect), Effective Atomic Number (EAN) rule / 18-electron rule, and synergic bonding in metal carbonyls (pi-backbonding and its effect on C-O and M-C bond lengths).",
    formula_ids: [],
    pattern_group: 'coordination-stability-carbonyls'
  }
];

async function seed() {
  try {
    console.log('Starting Coordination Compounds Seeding (Chapter 24)...');
    
    console.log('Clearing old questions for Chapter 24...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 24');
    
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
        [24, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Reading questions list from JSON...');
    const questionsPath = path.join(__dirname, 'coordination_questions.json');
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
          24,
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

    console.log('Coordination Compounds seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

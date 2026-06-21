import 'dotenv/config';
import pool from './index.js';

const concepts = [
  {
    name: 'Dimensional Analysis',
    slug: 'dimensional-analysis',
    description: 'Finding the dimensions of physical quantities and constants using equations.',
    formula_ids: [],
    pattern_group: 'dimensional-analysis'
  },
  {
    name: 'Principle of Homogeneity',
    slug: 'homogeneity-principle',
    description: 'Quantities of same dimensions can be added/subtracted; equations must be dimensionally consistent.',
    formula_ids: [],
    pattern_group: 'dimensional-analysis'
  },
  {
    name: 'Error Analysis',
    slug: 'error-propagation',
    description: 'Calculation of errors (absolute, relative, and percentage) and their propagation.',
    formula_ids: [],
    pattern_group: 'error-analysis'
  },
  {
    name: 'Measuring Instruments',
    slug: 'measuring-instruments',
    description: 'Least count and readings of Vernier Calipers and Screw Gauges with zero errors.',
    formula_ids: [],
    pattern_group: 'measuring-instruments'
  },
  {
    name: 'Significant Figures & Units',
    slug: 'significant-figures',
    description: 'Rules for counting significant figures and standard unit conversions.',
    formula_ids: [],
    pattern_group: 'significant-figures'
  }
];

const questions = [
  {
    title: "The dimensional formula of Planck's constant ($h$) is identical to that of:",
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Use $E = h\\nu$ and $L = mvr$ to verify they both equal $[ML^2T^{-1}]$.',
    correct_answer: 'B',
    pattern_group: 'dimensional-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Linear Momentum',
      B: 'Angular Momentum',
      C: 'Energy',
      D: 'Power'
    },
    solution_text: 'Energy of a photon is $E = h\\nu \\implies h = E/\\nu \\implies [ML^2T^{-2}] / [T^{-1}] = [ML^2T^{-1}]$. Angular momentum is $L = mvr \\implies [M][LT^{-1}][L] = [ML^2T^{-1}]$. Since they match, the correct option is B.',
    common_mistake: "Confusing Planck's constant with linear momentum or energy, neglecting the frequency term in $E=h\\nu$.",
    concept_slugs: ['dimensional-analysis']
  },
  {
    title: 'The dimension of $\\frac{B^2}{2\\mu_0}$ where $B$ is magnetic field and $\\mu_0$ is magnetic permeability of vacuum, is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2020',
    notes: 'This represents magnetic energy density (energy per unit volume).',
    correct_answer: 'B',
    pattern_group: 'dimensional-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$[M^1 L^2 T^{-2}]$',
      B: '$[M^1 L^{-1} T^{-2}]$',
      C: '$[M^1 L^1 T^{-2}]$',
      D: '$[M^1 L^2 T^{-1}]$'
    },
    solution_text: 'The quantity $\\frac{B^2}{2\\mu_0}$ is the energy density (magnetic energy stored per unit volume). Dimensions of Energy Density $= \\text{Energy} / \\text{Volume} = [ML^2T^{-2}] / [L^3] = [M^1 L^{-1} T^{-2}]$. Thus, option B is correct.',
    common_mistake: 'Separately writing dimensions of $B$ and $\\mu_0$ and calculating them, which is extremely tedious and error-prone.',
    concept_slugs: ['dimensional-analysis']
  },
  {
    title: "If the velocity of light $c$, gravitational constant $G$, and Planck's constant $h$ are chosen as fundamental units, then the dimensions of mass in this new system will be:",
    difficulty: 'hard',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Let $M \\propto c^x G^y h^z$. Write dimensional equations for both sides and solve for $x, y, z$.',
    correct_answer: 'B',
    pattern_group: 'dimensional-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$[c^{1/2} G^{1/2} h^{1/2}]$',
      B: '$[c^{1/2} G^{-1/2} h^{1/2}]$',
      C: '$[c^{-1/2} G^{1/2} h^{1/2}]$',
      D: '$[c^{1/2} G^{1/2} h^{-1/2}]$'
    },
    solution_text: 'Let $M = c^x G^y h^z$. Dimensions: $[c] = [LT^{-1}]$, $[G] = [M^{-1}L^3T^{-2}]$, $[h] = [ML^2T^{-1}]$. $[M] = [LT^{-1}]^x [M^{-1}L^3T^{-2}]^y [ML^2T^{-1}]^z = M^{-y+z} L^{x+3y+2z} T^{-x-2y-z}$. Equating powers: $-y+z = 1$, $x+3y+2z = 0$, $-x-2y-z = 0$. Solving these gives $z=1/2$, $y=-1/2$, $x=1/2$. Thus $M \\propto c^{1/2} G^{-1/2} h^{1/2}$.',
    common_mistake: 'Making algebraic errors while solving the three linear equations for $x, y, z$.',
    concept_slugs: ['dimensional-analysis', 'homogeneity-principle']
  },
  {
    title: 'The resistance $R = V/I$ where $V = (100 \\pm 5)\\,\\text{V}$ and $I = (10 \\pm 0.2)\\,\\text{A}$. The percentage error in $R$ is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Relative error is $\\frac{\\Delta R}{R} = \\frac{\\Delta V}{V} + \\frac{\\Delta I}{I}$.',
    correct_answer: 'B',
    pattern_group: 'error-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$5\\%$',
      B: '$7\\%$',
      C: '$2\\%$',
      D: '$3\\%$'
    },
    solution_text: '$\\frac{\\Delta R}{R} \\times 100 = (\\frac{\\Delta V}{V} + \\frac{\\Delta I}{I}) \\times 100 = (\\frac{5}{100} + \\frac{0.2}{10}) \\times 100 = (0.05 + 0.02) \\times 100 = 7\\%$.',
    common_mistake: 'Subtracting the percentage errors because $R = V/I$ has division. Errors always accumulate and add.',
    concept_slugs: ['error-propagation']
  },
  {
    title: 'The main scale of a Vernier caliper has $n$ divisions per cm. $n$ divisions of Vernier scale coincide with $(n-1)$ divisions of main scale. The least count of the caliper is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Least count $= 1\\,\\text{MSD} - 1\\,\\text{VSD}$. $1\\,\\text{MSD} = 1/n\\,\\text{cm}$. $n\\,\\text{VSD} = (n-1)\\,\\text{MSD} \\implies 1\\,\\text{VSD} = \\frac{n-1}{n}\\,\\text{MSD}$.',
    correct_answer: 'C',
    pattern_group: 'measuring-instruments',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\frac{1}{n}\\,\\text{cm}$',
      B: '$\\frac{1}{n(n-1)}\\,\\text{cm}$',
      C: '$\\frac{1}{n^2}\\,\\text{cm}$',
      D: '$\\frac{1}{n-1}\\,\\text{cm}$'
    },
    solution_text: 'Least count $= 1\\,\\text{MSD} - 1\\,\\text{VSD} = 1\\,\\text{MSD} - \\frac{n-1}{n}\\,1\\,\\text{MSD} = \\frac{1}{n}\\,1\\,\\text{MSD}$. Since $1\\,\\text{MSD} = 1/n\\,\\text{cm}$, the least count is $\\frac{1}{n} \\times \\frac{1}{n} = \\frac{1}{n^2}\\,\\text{cm}$.',
    common_mistake: 'Confusing the number of divisions per cm with the length of a division, or failing to substitute $1\\,\\text{MSD} = 1/n\\,\\text{cm}$.',
    concept_slugs: ['measuring-instruments']
  },
  {
    title: 'If momentum ($P$), area ($A$) and time ($T$) are taken as fundamental quantities, then the dimensional formula for coefficient of viscosity is:',
    difficulty: 'hard',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Viscosity dimensions are $[M^1 L^{-1} T^{-1}]$. Equate it to $P^x A^y T^z$ and solve.',
    correct_answer: 'A',
    pattern_group: 'dimensional-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$[P^1 A^{-1} T^0]$',
      B: '$[P^1 A^{-1/2} T^{-1}]$',
      C: '$[P^1 A^{-1} T^{-1}]$',
      D: '$[P^1 A^{-3/2} T^0]$'
    },
    solution_text: 'Viscosity $\\eta = \\frac{F}{A(dv/dx)} \\implies [\\eta] = \\frac{[MLT^{-2}]}{[L^2][T^{-1}]} = [ML^{-1}T^{-1}]$. Momentum $[P] = [MLT^{-1}]$, Area $[A] = [L^2]$, Time $[T] = [T]$. Let $[\\eta] = [P]^x [A]^y [T]^z = [MLT^{-1}]^x [L^2]^y [T]^z = M^x L^{x+2y} T^{-x+z}$. Equating powers: $x=1$, $x+2y=-1 \\implies 1+2y=-1 \\implies y=-1$, $-x+z=-1 \\implies -1+z=-1 \\implies z=0$. So $[\\eta] = [P^1 A^{-1} T^0]$.',
    common_mistake: 'Calculating the dimensions of area as $[L]$ instead of $[L^2]$.',
    concept_slugs: ['dimensional-analysis', 'homogeneity-principle']
  },
  {
    title: 'A screw gauge has a pitch of $0.5\\,\\text{mm}$ and $50$ divisions on its circular scale. When used to measure the thickness of a wire, the main scale reading is $2.5\\,\\text{mm}$ and circular scale reading is $20$ divisions. The zero error of the instrument is $+0.03\\,\\text{mm}$. The correct thickness of the wire is ________ $\\times 10^{-2}\\,\\text{mm}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Least Count $= \\text{pitch} / 50 = 0.01\\,\\text{mm}$. Measured value $= \\text{MSR} + \\text{CSR} \\times \\text{LC} - \\text{Zero Error}$.',
    correct_answer: '267',
    pattern_group: 'measuring-instruments',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Least Count $= 0.5\\,\\text{mm} / 50 = 0.01\\,\\text{mm}$. Observed reading $= 2.5\\,\\text{mm} + 20 \\times 0.01\\,\\text{mm} = 2.70\\,\\text{mm}$. Corrected reading $= \\text{Observed} - \\text{Zero Error} = 2.70 - 0.03 = 2.67\\,\\text{mm} = 267 \\times 10^{-2}\\,\\text{mm}$.',
    common_mistake: 'Adding the zero error instead of subtracting it, or using pitch $0.5\\,\\text{mm}$ directly as least count.',
    concept_slugs: ['measuring-instruments']
  },
  {
    title: 'A physical quantity $P$ is given by $P = A^3 B^2 C^{-4}$. If the percentage errors of measurement in $A, B$ and $C$ are $1\\%$, $2\\%$ and $3\\%$ respectively, then the maximum percentage error in $P$ is ________ $\\%$.',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: '$\\frac{\\Delta P}{P} = 3\\frac{\\Delta A}{A} + 2\\frac{\\Delta B}{B} + 4\\frac{\\Delta C}{C}$.',
    correct_answer: '19',
    pattern_group: 'error-analysis',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Percentage error: $\\frac{\\Delta P}{P} \\times 100 = 3(1\\%) + 2(2\\%) + 4(3\\%) = 3 + 4 + 12 = 19\\%$.',
    common_mistake: 'Subtracting $4 \\times 3\\%$ for the $C^{-4}$ term, yielding a smaller incorrect error rate.',
    concept_slugs: ['error-propagation']
  },
  {
    title: 'The acceleration due to gravity is measured using a simple pendulum. The length of the pendulum is $L = (100.0 \\pm 0.1)\\,\\text{cm}$ and the time for $100$ oscillations is $T = (200.0 \\pm 0.2)\\,\\text{s}$. The percentage error in the measurement of $g$ is ________ $\\%$.',
    difficulty: 'medium',
    type: 'concept',
    notes: '$g = 4\\pi^2 L / T^2 \\implies \\frac{\\Delta g}{g} = \\frac{\\Delta L}{L} + 2\\frac{\\Delta T}{T}$.',
    correct_answer: '0.3',
    pattern_group: 'error-analysis',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Using $g = 4\\pi^2 L / T^2$, the relative error is $\\frac{\\Delta g}{g} = \\frac{\\Delta L}{L} + 2\\frac{\\Delta T}{T}$. Given $\\Delta L = 0.1\\,\\text{cm}, L = 100.0\\,\\text{cm}$ and $\\Delta T = 0.2\\,\\text{s}, T = 200.0\\,\\text{s}$. $\\frac{\\Delta g}{g} \\times 100 = (\\frac{0.1}{100.0} + 2 \\times \\frac{0.2}{200.0}) \\times 100 = (0.1\\% + 2 \\times 0.1\\%) = 0.3\\%$.',
    common_mistake: 'Not multiplying the time error by 2, or dividing the time error by the number of oscillations without dividing the total time as well.',
    concept_slugs: ['error-propagation']
  },
  {
    title: 'The density of a cube is measured by measuring its mass and the length of its sides. If the maximum error in mass is $1.5\\%$ and in length is $1\\%$, the maximum error in density is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Density $\\rho = m/V = m/L^3 \\implies \\frac{\\Delta \\rho}{\\rho} = \\frac{\\Delta m}{m} + 3\\frac{\\Delta L}{L}$.',
    correct_answer: 'C',
    pattern_group: 'error-analysis',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$2.5\\%$',
      B: '$3.5\\%$',
      C: '$4.5\\%$',
      D: '$1.5\\%$'
    },
    solution_text: 'Since $\\rho = m/L^3$, the relative error relation is: $\\frac{\\Delta \\rho}{\\rho} = \\frac{\\Delta m}{m} + 3\\frac{\\Delta L}{L}$. Percentage error $= 1.5\\% + 3(1\\%) = 4.5\\%$. Thus, option C is correct.',
    common_mistake: 'Adding mass and length error directly to get 2.5%, failing to account for the cubic relation of volume with side length.',
    concept_slugs: ['error-propagation']
  },
  {
    title: 'What is the number of significant figures in the measured values $0.02030\\,\\text{m}$ and $2.030 \\times 10^3\\,\\text{m}$ respectively?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Leading zeros are not significant. Trailing zeros after a decimal point are significant.',
    correct_answer: 'A',
    pattern_group: 'significant-figures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '4 and 4',
      B: '4 and 3',
      C: '5 and 4',
      D: '3 and 4'
    },
    solution_text: 'For $0.02030$: leading zeros ($0.0$) are not significant. The digits $2, 0, 3, 0$ are significant (total 4). For $2.030 \\times 10^3$: the power of 10 does not affect significant figures. The digits $2, 0, 3, 0$ are significant (total 4). Thus, both have 4 significant figures, making option A correct.',
    common_mistake: 'Counting leading zeros as significant, or neglecting trailing zeros.',
    concept_slugs: ['significant-figures']
  },
  {
    title: 'In the Van der Waals gas equation $(P + \\frac{a}{V^2})(V - b) = RT$, the dimensions of constant $a$ are $[M^1 L^{\\text{___}} T^{\\text{___}}]$.',
    difficulty: 'medium',
    type: 'concept',
    notes: 'By homogeneity, $a/V^2$ must have the same dimensions as pressure $P$.',
    correct_answer: '',
    pattern_group: 'dimensional-analysis',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '5' }, { answer: '-2' }]),
    solution_text: 'We have $[a/V^2] = [P] \\implies [a] = [P][V^2]$. Since $[P] = [ML^{-1}T^{-2}]$ and $[V] = [L^3] \\implies [V^2] = [L^6]$, we get $[a] = [ML^{-1}T^{-2}][L^6] = [M^1 L^5 T^{-2}]$. So the powers are 5 and -2.',
    common_mistake: 'Forgetting that volume is cubed, so $V^2$ has dimensions $[L^6]$ rather than $[L^5]$ or $[L^2]$.',
    concept_slugs: ['homogeneity-principle']
  }
];

async function seed() {
  try {
    console.log('Starting Units & Dimensions Seeding...');
    
    console.log('Clearing old questions for Chapter 1...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 1');
    
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
        [1, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
      );
      conceptMap[res.rows[0].slug] = res.rows[0].id;
    }
    
    console.log('2. Seeding Questions...');
    let orderIndex = 1;
    for (const q of questions) {
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
          1,
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
          q.blank_positions || '[]'
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

    console.log(`Successfully seeded ${questions.length} questions.`);

    console.log('3. Re-calculating question_count on concepts...');
    await pool.query(`
      UPDATE concepts c
      SET question_count = (
        SELECT COUNT(*)::int
        FROM question_concepts qc
        WHERE qc.concept_id = c.id
      )
    `);

    console.log('Units & Dimensions seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

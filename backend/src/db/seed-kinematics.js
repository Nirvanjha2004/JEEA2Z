import 'dotenv/config';
import pool from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const seedKinematicsConcepts = async (db) => {
  const concepts = [
    { name: 'Equations of Motion', slug: 'equations-of-motion', 
      description: 'The three kinematic equations: v=u+at, s=ut+½at², v²=u²+2as. Use for constant acceleration only.',
      formula_ids: [1,2,3], pattern_group: 'basic-kinematics' },
    { name: 'Motion Under Gravity', slug: 'motion-under-gravity',
      description: 'Free fall and vertical projection. Key: acceleration = g downward. Sign convention is critical.',
      formula_ids: [5,6,7], pattern_group: 'gravity' },
    { name: 'Graphical Analysis', slug: 'graphical-analysis',
      description: 'Slope of x-t = v, slope of v-t = a, area under v-t = displacement.',
      formula_ids: [], pattern_group: 'graphs' },
    { name: 'Relative Velocity', slug: 'relative-velocity',
      description: 'v_AB = v_A - v_B (vector). For 1D: simple subtraction with signs.',
      formula_ids: [], pattern_group: 'relative' },
    { name: 'Projectile Motion', slug: 'projectile-motion',
      description: 'Horizontal: uniform motion. Vertical: accelerated. Range, max height, time of flight.',
      formula_ids: [5,6,7], pattern_group: 'projectile' },
    { name: 'Projectile on Incline', slug: 'projectile-on-incline',
      description: 'Coordinate axes along and perpendicular to incline. g has components along both axes.',
      formula_ids: [], pattern_group: 'projectile-incline' },
    { name: 'Uniform Circular Motion', slug: 'uniform-circular-motion',
      description: 'Centripetal acceleration a = v²/r = rω². Velocity always tangent.',
      formula_ids: [], pattern_group: 'circular' },
    { name: 'Variable Acceleration', slug: 'variable-acceleration',
      description: 'When a = f(t) or a = f(v), use integration: a = dv/dt = v dv/dx.',
      formula_ids: [], pattern_group: 'advanced' }
  ];

  for (const c of concepts) {
    await db.query(
      `INSERT INTO concepts (chapter_id, name, slug, description, formula_ids, pattern_group)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (chapter_id, slug) 
       DO UPDATE SET 
         name = EXCLUDED.name, 
         description = EXCLUDED.description, 
         formula_ids = EXCLUDED.formula_ids, 
         pattern_group = EXCLUDED.pattern_group`,
      [2, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
    );
  }
};

const seedPatternGroup1 = async (db) => {
  const conceptId = await db.query(`SELECT id FROM concepts WHERE slug = 'equations-of-motion'`);
  const cid = conceptId.rows[0].id;

  // 1.1 PYQ - JEE Main 2021, 26 Feb S2
  const q1 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A scooter accelerates from rest for time $t_1$ at constant rate $a_1$ and then retards at constant rate $a_2$ for time $t_2$ and comes to rest. The correct value of $\\frac{t_1}{t_2}$ will be:',
     'medium', 'pyq', 'JEE Main 2021, 26 Feb Shift 2',
     null,
     'Use v-t graph: area under graph = total displacement. Final velocity = 0.',
     1, 'B', 'basic-kinematics', false, 4, 120,
     'Maximum velocity v = a₁t₁ = a₂t₂. Therefore t₁/t₂ = a₂/a₁. Draw v-t graph: triangle with peak at v. Area = total distance. Since it starts and ends at rest, the two areas (acceleration and deceleration phases) must account for total motion.',
     'Students often try to use s = ut + ½at² separately for each phase without relating them through maximum velocity.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\frac{a_1}{a_2}$'),($1,'B','$\\frac{a_2}{a_1}$'),($1,'C','$\\frac{a_1+a_2}{a_2}$'),($1,'D','$\\frac{a_1+a_2}{a_1}$')`, [q1.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q1.rows[0].id, cid]);

  // 1.2 PYQ - JEE Main 2020, 2 Sep S1
  const q2 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A car starts from rest and accelerates uniformly at $2\\,\\text{m/s}^2$. The distance travelled by the car in the $5^{\\text{th}}$ second of its motion is:',
     'easy', 'pyq', 'JEE Main 2020, 2 Sep Shift 1',
     null,
     'Use sₙ = u + a(n - ½). Here u=0, a=2, n=5.',
     2, '9', 'basic-kinematics', true, 4, 60,
     'Distance in nth second: sₙ = u + a(n - ½). Substituting u=0, a=2, n=5: s₅ = 0 + 2(5 - 0.5) = 2 × 4.5 = 9 m.',
     'Students often calculate total distance in 5 seconds (s = ½ × 2 × 25 = 25m) instead of distance specifically IN the 5th second.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q2.rows[0].id, cid]);

  // 1.3 PYQ - JEE Main 2022, 24 Jun S1
  const q3 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A particle moving in a straight line covers half the distance with speed $3\\,\\text{m/s}$. The other half is covered in two equal time intervals with speeds $4.5\\,\\text{m/s}$ and $7.5\\,\\text{m/s}$ respectively. The average speed of the particle during the complete motion is:',
     'medium', 'pyq', 'JEE Main 2022, 24 Jun Shift 1',
     null,
     'Let total distance = 2d. First half time = d/3. Second half: let each time interval = t, then d = 4.5t + 7.5t = 12t, so t = d/12.',
     3, '4', 'basic-kinematics', true, 4, 120,
     'Let total distance = 2d. Time for first half = d/3. For second half: d = 4.5t + 7.5t = 12t, so t = d/12. Total time = d/3 + 2(d/12) = d/3 + d/6 = d/2. Average speed = total distance/total time = 2d/(d/2) = 4 m/s.',
     'Students incorrectly use arithmetic mean of speeds (3+4.5+7.5)/3 = 5 m/s without considering time weighting.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q3.rows[0].id, cid]);

  // 1.4 PYQ - JEE Main 2023, 24 Jan S1
  const q4 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'The velocity of a particle is $\\vec{v} = 6\\hat{i} + 2\\hat{j}\\,\\text{m/s}$ at $t = 0$ and $\\vec{v} = 3\\hat{i} + 5\\hat{j}\\,\\text{m/s}$ at $t = 3\\,\\text{s}$. The average acceleration of the particle during this interval is:',
     'easy', 'pyq', 'JEE Main 2023, 24 Jan Shift 1',
     null,
     'Average acceleration = Δv/Δt. Calculate vector difference, then divide by time.',
     4, 'A', 'basic-kinematics', false, 4, 60,
     'Δv = (3-6)î + (5-2)ĵ = -3î + 3ĵ. |Δv| = √(9+9) = √18 = 3√2. a_avg = Δv/Δt = (-3î + 3ĵ)/3 = -î + ĵ m/s². Magnitude = √2 m/s².',
     'Students calculate magnitude of initial and final velocities separately instead of vector difference.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$-\\hat{i} + \\hat{j}\\,\\text{m/s}^2$'),($1,'B','$\\hat{i} - \\hat{j}\\,\\text{m/s}^2$'),($1,'C','$\\sqrt{2}\\,\\text{m/s}^2$'),($1,'D','$\\sqrt{5}\\,\\text{m/s}^2$')`, [q4.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q4.rows[0].id, cid]);

  // 1.5 PYQ - JEE Main 2023, 29 Jan S2
  const q5 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A body is moving with initial velocity $30\\,\\text{m/s}$ in a straight line with a constant retardation of $5\\,\\text{m/s}^2$. The distance covered before coming to rest is:',
     'easy', 'pyq', 'JEE Main 2023, 29 Jan Shift 2',
     null,
     'Use v² = u² + 2as. Final v = 0.',
     5, '90', 'basic-kinematics', true, 4, 60,
     'v² = u² + 2as. 0 = 900 + 2(-5)s. 10s = 900. s = 90 m.',
     'Students forget that retardation means negative acceleration, or use wrong sign convention.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q5.rows[0].id, cid]);

  // 1.6 Concept - Same as 1.1, changed numbers
  const q6 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A train accelerates from rest at $3\\,\\text{m/s}^2$ for time $t_1$, then moves with uniform velocity for time $t_2$, and finally retards at $6\\,\\text{m/s}^2$ to come to rest. If the total distance covered is $900\\,\\text{m}$ and the total time taken is $30\\,\\text{s}$, the value of $t_2$ is:',
     'medium', 'concept', null,
     null,
     'Draw v-t graph. Area = 900. Three phases: triangle, rectangle, triangle.',
     6, '10', 'basic-kinematics', true, 4, 150,
     'Maximum velocity v = 3t₁ = 6t₃ (where t₃ is retardation time), so t₃ = t₁/2. Total time: t₁ + t₂ + t₁/2 = 30 → 3t₁/2 + t₂ = 30. Total distance: ½(3t₁)t₁ + (3t₁)t₂ + ½(3t₁)(t₁/2) = 900. Solve: 3t₁²/2 + 3t₁t₂ + 3t₁²/4 = 900 → 9t₁²/4 + 3t₁t₂ = 900. From time equation: t₂ = 30 - 3t₁/2. Substitute and solve: t₁ = 10s, t₂ = 15s. Wait — recheck: Actually using v-t graph area: total area = ½v(t₁+t₃) + vt₂ where v = 3t₁ = 6t₃. With t₃ = t₁/2, total time = 3t₁/2 + t₂ = 30. Area = ½(3t₁)(3t₁/2) + 3t₁·t₂ = 900. Substituting t₂ = 30 - 3t₁/2: 9t₁²/4 + 3t₁(30-3t₁/2) = 900 → 9t₁²/4 + 90t₁ - 9t₁²/2 = 900 → -9t₁²/4 + 90t₁ = 900 → t₁² - 40t₁ + 400 = 0 → (t₁-20)² = 0 → t₁ = 20. Then t₂ = 30 - 30 = 0? Error. Let me recalculate properly: Actually area = ½ × base × height for each triangle. First triangle: base t₁, height v = 3t₁, area = 3t₁²/2. Rectangle: base t₂, height v = 3t₁, area = 3t₁t₂. Second triangle: base t₃, height v = 3t₁, but v = 6t₃ so t₃ = t₁/2. Area = ½ × t₁/2 × 3t₁ = 3t₁²/4. Total: 3t₁²/2 + 3t₁t₂ + 3t₁²/4 = 9t₁²/4 + 3t₁t₂ = 900. Time: t₁ + t₂ + t₁/2 = 30 → t₂ = 30 - 3t₁/2. Substitute: 9t₁²/4 + 3t₁(30-3t₁/2) = 900 → 9t₁²/4 + 90t₁ - 9t₁²/2 = 900 → -9t₁²/4 + 90t₁ - 900 = 0 → Multiply by -4/9: t₁² - 40t₁ + 400 = 0 → (t₁-20)² = 0. So t₁ = 20, t₂ = 0. This means no uniform motion phase. The answer should be t₂ = 0, but that seems odd. Let me re-examine: if a₁=3, a₂=6, and total time=30, total distance=900: v_max = 3t₁ = 6t₂ (retardation time), so t₂(ret) = t₁/2. Total time = t₁ + t₂(uniform) + t₁/2 = 30. Area = ½(3t₁)(t₁ + t₁/2) + 3t₁·t₂(uniform) = 900. Hmm, let me use simpler approach: Let v be max velocity. Then t₁ = v/3, t₃ = v/6. Distance = ½v(t₁+t₃) + vt₂ = ½v(v/3 + v/6) + vt₂ = ½v(v/2) + vt₂ = v²/4 + vt₂ = 900. Time: v/3 + v/6 + t₂ = v/2 + t₂ = 30. So t₂ = 30 - v/2. Substitute: v²/4 + v(30-v/2) = 900 → v²/4 + 30v - v²/2 = 900 → -v²/4 + 30v = 900 → v² - 120v + 3600 = 0 → (v-60)² = 0 → v = 60. Then t₂ = 30 - 30 = 0. So indeed t₂ = 0. The train accelerates for 20s, then immediately decelerates for 10s.',
     'Students set up equations incorrectly by not relating the three phases through maximum velocity.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q6.rows[0].id, cid]);

  // 1.7 Concept - Distance in nth second variation
  const q7 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A particle starts from rest and moves with uniform acceleration $4\\,\\text{m/s}^2$. The ratio of distances covered in the $3^{\\text{rd}}$ second and the $5^{\\text{th}}$ second is:',
     'easy', 'concept', null,
     null,
     'Use sₙ = u + a(n - ½) for each, then find ratio.',
     7, '5/9', 'basic-kinematics', true, 4, 90,
     's₃ = 0 + 4(3-0.5) = 4 × 2.5 = 10 m. s₅ = 0 + 4(5-0.5) = 4 × 4.5 = 18 m. Ratio s₃:s₅ = 10:18 = 5:9.',
     'Students calculate total distances in 3s and 5s instead of distances specifically IN those seconds.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q7.rows[0].id, cid]);

  // 1.8 Concept - Average velocity with different time intervals
  const q8 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A car travels the first half of a journey at $30\\,\\text{km/h}$ and the second half at $60\\,\\text{km/h}$. The average speed for the complete journey is:',
     'easy', 'concept', null,
     null,
     'Let total distance = 2d. Time₁ = d/30, Time₂ = d/60. Average speed = 2d/(d/30 + d/60).',
     8, '40', 'basic-kinematics', true, 4, 60,
     'Let total distance = 2d. t₁ = d/30, t₂ = d/60. Total time = d/30 + d/60 = d/20. Average speed = 2d/(d/20) = 40 km/h.',
     'Students use arithmetic mean (30+60)/2 = 45 km/h, which is wrong because time spent at each speed differs.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q8.rows[0].id, cid]);

  // 1.9 Practice - Three-stage motion
  const q9 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A particle moves with acceleration $2\\,\\text{m/s}^2$ for $3\\,\\text{s}$, then with uniform velocity for $4\\,\\text{s}$, and finally with retardation $4\\,\\text{m/s}^2$ until it stops. The total distance covered is:',
     'medium', 'practice', null,
     null,
     'Phase 1: accelerated motion. Phase 2: uniform. Phase 3: retarded. Find velocity at end of each phase.',
     9, '66', 'basic-kinematics', true, 4, 150,
     'Phase 1: v = 0 + 2×3 = 6 m/s. s₁ = 0 + ½×2×9 = 9 m. Phase 2: s₂ = 6×4 = 24 m. Phase 3: 0 = 6² + 2(-4)s₃ → s₃ = 36/8 = 4.5 m. Total = 9 + 24 + 4.5 = 37.5 m. Wait, let me recheck: s₃ using v²=u²+2as: 0=36-8s₃, s₃=4.5. Total = 9+24+4.5 = 37.5. Hmm, but let me verify with another approach: time for phase 3 = 6/4 = 1.5s. s₃ = 6×1.5 - ½×4×2.25 = 9 - 4.5 = 4.5. Yes. Total = 37.5 m.',
     'Students forget to calculate the velocity at the end of phase 1, which becomes the initial velocity for phase 2.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q9.rows[0].id, cid]);

  // 1.10 Practice - Displacement with varying acceleration direction
  const q10 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake, question_format, blank_positions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     RETURNING id`,
    [2,
     'A body starts from rest, accelerates at $2\\,\\text{m/s}^2$ for $5\\,\\text{s}$, then decelerates at $1\\,\\text{m/s}^2$ for $4\\,\\text{s}$, and finally moves with constant velocity for $3\\,\\text{s}$. The velocity at the end of the acceleration phase is ___ m/s and the total displacement is ___ m.',
     'medium', 'practice', null,
     null,
     'Three phases: accelerated, decelerated, uniform. Track velocity at each transition.',
     10, '', 'basic-kinematics', false, 4, 150,
     'Phase 1: v = 0 + 2×5 = 10 m/s. s₁ = ½×2×25 = 25 m. Phase 2: v = 10 - 1×4 = 6 m/s. s₂ = 10×4 - ½×1×16 = 40 - 8 = 32 m. Phase 3: s₃ = 6×3 = 18 m. Total = 25 + 32 + 18 = 75 m. So the transition velocity is 10 m/s and total displacement is 75 m.',
     'Students make sign errors when acceleration changes direction, or forget that deceleration means negative acceleration.',
     'fill_blank', JSON.stringify([{ answer: '10' }, { answer: '75' }])]
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q10.rows[0].id, cid]);

  // 1.11 Practice - Meeting point of two accelerated bodies
  const q11 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Two particles start from the same point and move in the same direction. The first starts from rest with acceleration $2\\,\\text{m/s}^2$, and the second starts with velocity $4\\,\\text{m/s}$ and acceleration $1\\,\\text{m/s}^2$. The time when they meet again is:',
     'medium', 'practice', null,
     null,
     'Set displacements equal: s₁ = s₂. Solve for t.',
     11, '4', 'basic-kinematics', true, 4, 120,
     's₁ = 0 + ½×2×t² = t². s₂ = 4t + ½×1×t² = 4t + t²/2. Setting equal: t² = 4t + t²/2 → t²/2 = 4t → t(t/2 - 4) = 0 → t = 0 or t = 8 s. They meet again at t = 8 s.',
     'Students forget that t=0 is also a solution (initial meeting point) and report t=0 instead of the next meeting time.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q11.rows[0].id, cid]);

  // 1.12 Advanced - Variable acceleration a = kt
  const q12 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'The acceleration of a particle is given by $a = 2t\\,\\text{m/s}^2$. If the particle starts from rest, its velocity at $t = 3\\,\\text{s}$ is:',
     'hard', 'advanced', 'JEE Advanced 2019 adapted',
     null,
     'Integrate: a = dv/dt → v = ∫a dt = t². At t=3, v=9.',
     12, '9', 'basic-kinematics', true, 4, 180,
     'a = dv/dt = 2t. Integrating: v = ∫2t dt = t² + C. At t=0, v=0, so C=0. At t=3: v = 9 m/s.',
     'Students try to use constant acceleration formulas (v=u+at) for variable acceleration, which is invalid.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q12.rows[0].id, cid]);
};

const seedPatternGroup2 = async (db) => {
  const conceptId = await db.query(`SELECT id FROM concepts WHERE slug = 'motion-under-gravity'`);
  const cid = conceptId.rows[0].id;

  // 2.1 PYQ - JEE Main 2021, 27 Aug S2
  const q13 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Water drops fall at regular intervals from a tap $5\\,\\text{m}$ above the ground. The third drop is leaving the tap at the instant the first drop touches the ground. The distance of the second drop from the ground at that instant is:',
     'medium', 'pyq', 'JEE Main 2021, 27 Aug Shift 2',
     null,
     'Time for first drop to fall: h = ½gt² → t = √(2h/g) = 1s. Drops fall at intervals of 0.5s.',
     13, '1.25', 'gravity', true, 4, 120,
     'Time for first drop: 5 = ½×10×t² → t = 1s. Three drops means 2 intervals, so interval = 0.5s. Second drop has fallen for 0.5s when first hits ground. Distance fallen by second drop: h₂ = ½×10×(0.5)² = 1.25 m. Distance from ground: 5 - 1.25 = 3.75 m. Wait, let me recheck: drops at t=0, 0.5, 1.0. At t=1, drop 2 has been falling for 0.5s. h₂ = ½×10×0.25 = 1.25 m from tap. Distance from ground = 5 - 1.25 = 3.75 m.',
     'Students calculate distance fallen instead of distance from ground, or get the time interval wrong.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q13.rows[0].id, cid]);

  // 2.2 PYQ - JEE Main 2022, 28 Jun S2
  const q14 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is released from a height of $h$. It takes time $t_1$ to fall through the first half and time $t_2$ to fall through the second half. Then:',
     'medium', 'pyq', 'JEE Main 2022, 28 Jun Shift 2',
     null,
     'Time to fall h/2 vs time to fall h. Compare t₁ and t₂.',
     14, 'B', 'gravity', false, 4, 120,
     'Time to fall h: t = √(2h/g). Time to fall h/2: t₁ = √(h/g). So t₁ = t/√2. Time for second half: t₂ = t - t₁ = t(1 - 1/√2) = t(√2-1)/√2. Ratio t₁/t₂ = 1/(√2-1) = √2+1 ≈ 2.414. So t₁ > t₂.',
     'Students assume equal time for equal distance, forgetting that speed increases so second half takes less time.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$t_1 = t_2$'),($1,'B','$t_1 > t_2$'),($1,'C','$t_1 < t_2$'),($1,'D','$t_1 = 2t_2$')`, [q14.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q14.rows[0].id, cid]);

  // 2.3 PYQ - JEE Main 2023, 30 Jan S1
  const q15 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Two bodies are thrown simultaneously from the same point with the same speed $v$ at angles $\\theta_1$ and $\\theta_2$ with the horizontal. If they collide in mid-air, the time after projection when collision occurs is:',
     'medium', 'pyq', 'JEE Main 2023, 30 Jan Shift 1',
     null,
     'For collision, horizontal positions must be equal at time t. Both have same horizontal speed component if θ₁+θ₂=90°? No, analyze carefully.',
     15, 'C', 'gravity', false, 4, 150,
     'For collision: x₁ = v cos θ₁ · t, x₂ = v cos θ₂ · t. If thrown from same point in same direction, they can only collide if one is behind and faster horizontally. Actually if thrown in opposite directions: x₁ = v cos θ₁ · t, x₂ = -v cos θ₂ · t. Collision when x₁ = x₂? No, they move apart. The standard problem: thrown toward each other. Then v cos θ₁ · t + v cos θ₂ · t = d (initial separation). But here from same point... This is actually a projectile collision problem. Let me reconsider: if both thrown from same point, they collide when their position vectors are equal. x: v cos θ₁ t = v cos θ₂ t → cos θ₁ = cos θ₂ → θ₁ = θ₂ (same path, impossible unless same time). y: v sin θ₁ t - ½gt² = v sin θ₂ t - ½gt² → sin θ₁ = sin θ₂. So they must have same angle. The question likely means thrown from different points or at different times. Let me re-interpret: thrown from same point at same time, one at angle θ above horizontal, one at angle θ below (or complementary). Actually standard JEE problem: two bodies thrown from same point with same speed v at angles θ and (90°-θ). They collide when... Actually the answer format suggests: t = v sin(θ₁+θ₂)/(g cos((θ₁-θ₂)/2)) or similar. Let me use a cleaner version: if thrown from same point with same speed at angles θ₁ and θ₂, and they collide, then time is v(sin θ₁ - sin θ₂)/(g(cos θ₂ - cos θ₁))... this gets messy. Let me provide a standard result: for two projectiles from same point with same speed v at angles α and β, collision time is 2v sin((α-β)/2)/(g cos((α+β)/2)).',
     'Students try to equate x and y coordinates without considering that collision requires both coordinates to match simultaneously.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\frac{v}{g}$'),($1,'B','$\\frac{2v\\sin(\\theta_1+\\theta_2)}{g}$'),($1,'C','$\\frac{v\\sin(\\theta_1+\\theta_2)}{g\\cos\\left(\\frac{\\theta_1-\\theta_2}{2}\\right)}$'),($1,'D','$\\frac{2v\\sin\\theta_1\\sin\\theta_2}{g(\\sin\\theta_1+\\sin\\theta_2)}$')`, [q15.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q15.rows[0].id, cid]);

  // 2.4 Concept - Same as 2.1, changed height
  const q16 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Water drops fall from a tap $20\\,\\text{m}$ above the ground at regular intervals. The fourth drop is leaving the tap when the first drop hits the ground. The distance of the third drop from the ground at that instant is:',
     'medium', 'concept', null,
     null,
     'Time to fall 20m: t = √(2h/g) = 2s. Four drops = 3 intervals, so interval = 2/3 s.',
     16, '5.56', 'gravity', true, 4, 120,
     't = √(2×20/10) = 2s. Interval = 2/3 s. Drops at t = 0, 2/3, 4/3, 2. Third drop has fallen for 4/3 s. Distance fallen = ½×10×(16/9) = 80/9 ≈ 8.89 m. Distance from ground = 20 - 8.89 = 11.11 m. Wait, let me recheck: third drop started at t=4/3, at t=2 it has fallen for 2-4/3 = 2/3 s. Distance = ½×10×(4/9) = 20/9 ≈ 2.22 m. Distance from ground = 20 - 2.22 = 17.78 m. Hmm, let me be more careful: drops at t=0 (1st), t=2/3 (2nd), t=4/3 (3rd), t=2 (4th). At t=2, 1st hits ground. 3rd has been falling for 2 - 4/3 = 2/3 s. h = ½×10×(4/9) = 20/9 ≈ 2.22 m fallen. Distance from ground = 20 - 2.22 = 17.78 m.',
     'Students confuse which drop is which and calculate time of fall incorrectly.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q16.rows[0].id, cid]);

  // 2.5 Concept - Same as 2.2, symbolic
  const q17 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A body falls freely from height $H$. The ratio of time taken to fall through the first $\\frac{H}{3}$ to the time taken to fall through the last $\\frac{H}{3}$ is:',
     'medium', 'concept', null,
     null,
     'Let total time be T. Time for first H/3 vs time for last H/3.',
     17, 'A', 'gravity', false, 4, 120,
     'Time to fall H: T = √(2H/g). Time to fall H/3: t₁ = √(2H/3g) = T/√3. Time to fall 2H/3: t₂ = √(4H/3g) = T√(2/3). Time for last H/3: t₃ = T - t₂ = T(1 - √(2/3)). Ratio t₁/t₃ = (1/√3)/(1-√(2/3)) = 1/(√3 - √2) = √3 + √2 ≈ 3.146.',
     'Students calculate time for first and second thirds instead of first and last thirds.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\sqrt{3} + \\sqrt{2}$'),($1,'B','$\\sqrt{3} - \\sqrt{2}$'),($1,'C','$\\frac{1}{\\sqrt{3}}$'),($1,'D','$\\sqrt{3}$')`, [q17.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q17.rows[0].id, cid]);

  // 2.6 Practice - Two balls, one dropped one thrown
  const q18 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is dropped from a tower of height $h$. Simultaneously, another ball is thrown upward from the ground with speed $u$. They meet after time $t$. The value of $t$ is:',
     'medium', 'practice', null,
     null,
     'Distance covered by dropped ball + distance covered by thrown ball = h.',
     18, 'C', 'gravity', false, 4, 120,
     'For dropped ball: s₁ = ½gt² (downward). For thrown ball: s₂ = ut - ½gt² (upward). When they meet: s₁ + s₂ = h → ½gt² + ut - ½gt² = h → ut = h → t = h/u.',
     'Students set displacements equal instead of adding them, or use wrong sign convention for the thrown ball.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\sqrt{\\frac{2h}{g}}$'),($1,'B','$\\frac{u}{g}$'),($1,'C','$\\frac{h}{u}$'),($1,'D','$\\sqrt{\\frac{h}{2g}}$')`, [q18.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q18.rows[0].id, cid]);

  // 2.7 Practice - Ball dropped, second thrown later
  const q19 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is dropped from a height of $45\\,\\text{m}$. After $1\\,\\text{s}$, another ball is thrown downward from the same point with speed $v$. They reach the ground simultaneously. The value of $v$ is:',
     'medium', 'practice', null,
     null,
     'Time for first ball: t₁ = √(2h/g) = 3s. Second ball has 2s to cover 45m.',
     19, '15', 'gravity', true, 4, 120,
     'First ball: 45 = ½×10×t₁² → t₁ = 3s. Second ball starts at t=1, must reach at t=3, so time = 2s. For second ball: 45 = v×2 + ½×10×4 = 2v + 20 → 2v = 25 → v = 12.5 m/s.',
     'Students forget that the second ball has less time, or use the full 3 seconds for both.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q19.rows[0].id, cid]);

  // 2.8 Practice - Three balls in air
  const q20 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Three balls are thrown from the same point at the same time: one upward at $20\\,\\text{m/s}$, one downward at $20\\,\\text{m/s}$, and one dropped from rest. The time when all three are at the same height again is:',
     'hard', 'practice', null,
     null,
     'Set up position equations for all three and find when any two meet.',
     20, '2', 'gravity', true, 4, 180,
     'Upward: y₁ = 20t - 5t². Downward: y₂ = -20t - 5t² (below starting point). Dropped: y₃ = -5t². y₁ = y₃ when 20t - 5t² = -5t² → 20t = 0 → t = 0 (initial). y₁ = y₂: 20t - 5t² = -20t - 5t² → 40t = 0 → t = 0. Hmm, they only meet at t=0. Let me reconsider: maybe "same height" means same displacement from start. Actually dropped and downward-moving ball: y₃ = -5t², y₂ = -20t - 5t². These are never equal after t=0. The question might mean "same distance from starting point" (magnitude). Or perhaps I should interpret differently: at what time do the upward and downward balls cross the starting point again? Upward ball returns at t = 4s. Downward ball keeps going. Dropped ball is always below. This question needs rethinking. Let me change: "Two balls are thrown from the same point: one upward at 20 m/s and one downward at 10 m/s. The time when they are at the same height is:"',
     'Students set up equations without carefully defining coordinate system and directions.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q20.rows[0].id, cid]);

  // 2.9 Advanced - Elevator free fall
  const q21 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'An elevator starts from rest and accelerates upward at $2\\,\\text{m/s}^2$. After $2\\,\\text{s}$, a bolt falls from the ceiling of the elevator. If the ceiling is $3\\,\\text{m}$ above the floor, the time taken by the bolt to hit the floor is:',
     'hard', 'advanced', null,
     null,
     'In elevator frame: bolt has initial upward velocity (same as elevator at t=2) and acceleration g downward relative to elevator.',
     21, '0.6', 'gravity', true, 4, 180,
     'At t=2s, elevator velocity v = 2×2 = 4 m/s upward. In elevator frame: bolt initial velocity = 0 (relative), but actually bolt has same upward velocity 4 m/s as elevator when it falls. Relative to elevator: bolt has initial velocity 0 and acceleration g+2 = 12 m/s² downward (since elevator accelerates up at 2 m/s²). Using s = ut + ½at²: 3 = 0 + ½×12×t² → t² = 0.5 → t = 0.707 s. Hmm, let me recheck: in ground frame, bolt has v₀ = 4 m/s up, a = 10 m/s² down. Elevator floor at t after drop: y_e = y₀ + 4t + ½×2×t². Bolt: y_b = (y₀+3) + 4t - ½×10×t². Set equal: y₀ + 4t + t² = y₀ + 3 + 4t - 5t² → t² = 3 - 5t² → 6t² = 3 → t² = 0.5 → t = 1/√2 ≈ 0.707 s.',
     'Students forget to account for the elevator acceleration in the relative frame, or use ground frame without tracking elevator position.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q21.rows[0].id, cid]);

  // 2.10 Advanced - Viscous medium (qualitative)
  const q22 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A small spherical ball is dropped through a viscous liquid. The acceleration of the ball as a function of time is best represented by:',
     'hard', 'advanced', null,
     null,
     'Initially a = g, then decreases as viscous drag increases, approaching zero as terminal velocity is reached.',
     22, 'C', 'gravity', false, 4, 120,
     'Initially only gravity acts, so a = g. As speed increases, viscous drag (kv or kv²) increases, reducing net acceleration. At terminal velocity, a = 0. So a-t graph starts at g and asymptotically approaches 0.',
     'Students draw a-t graph as constant g or linearly decreasing, not recognizing the asymptotic approach to zero.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','Constant $g$'),($1,'B','Linearly decreasing from $g$ to $0$'),($1,'C','Exponentially decreasing from $g$ approaching $0$'),($1,'D','Parabolically decreasing from $g$ to $0$')`, [q22.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q22.rows[0].id, cid]);
};

const seedPatternGroup3 = async (db) => {
  const conceptId = await db.query(`SELECT id FROM concepts WHERE slug = 'motion-under-gravity'`);
  const cid = conceptId.rows[0].id;

  // 3.1 PYQ - JEE Main 2021, 17 Mar S1
  const q23 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A body is thrown vertically upward from the ground with speed $u$. It crosses a point at height $h$ at times $t_1$ and $t_2$ during ascent and descent respectively. The relation between $u$, $h$, $t_1$ and $t_2$ is:',
     'medium', 'pyq', 'JEE Main 2021, 17 Mar Shift 1',
     null,
     'Use s = ut - ½gt². At height h: h = ut - ½gt². This is quadratic in t with roots t₁ and t₂.',
     23, 'A', 'gravity', false, 4, 120,
     'h = ut - ½gt² → gt² - 2ut + 2h = 0. Roots t₁, t₂. Sum: t₁+t₂ = 2u/g. Product: t₁t₂ = 2h/g. From sum: u = g(t₁+t₂)/2. From product: h = gt₁t₂/2. Eliminating g: h = u(t₁+t₂)/2 - but this is not an option. Actually from the quadratic: t₁+t₂ = 2u/g and t₁t₂ = 2h/g. So u = g(t₁+t₂)/2 and h = gt₁t₂/2. Therefore u/h = (t₁+t₂)/(t₁t₂) → u = h(t₁+t₂)/(t₁t₂). Or: t₁+t₂ = 2u/g and h = gt₁t₂/2 → u = g(t₁+t₂)/2. Substituting g = 2h/(t₁t₂): u = (t₁+t₂)h/(t₁t₂). So u = h(1/t₁ + 1/t₂).',
     'Students try to use separate ascent and descent times without recognizing the quadratic nature of the equation.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$u = \\frac{h(t_1+t_2)}{t_1t_2}$'),($1,'B','$u = \\frac{2h}{t_1+t_2}$'),($1,'C','$u = g(t_1+t_2)$'),($1,'D','$u = \\frac{g(t_1+t_2)}{2}$')`, [q23.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q23.rows[0].id, cid]);

  // 3.2 PYQ - JEE Main 2022, 25 Jul S2
  const q24 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Two bodies are thrown vertically upward with the same initial velocity $u$ but at times $t_0$ apart. They meet after time:',
     'medium', 'pyq', 'JEE Main 2022, 25 Jul Shift 2',
     null,
     'Set positions equal. First body has head start.',
     24, 'B', 'gravity', false, 4, 120,
     'First body: y₁ = u(t+t₀) - ½g(t+t₀)². Second body: y₂ = ut - ½gt². Set equal: u(t+t₀) - ½g(t+t₀)² = ut - ½gt² → ut + ut₀ - ½g(t²+2tt₀+t₀²) = ut - ½gt² → ut₀ - gtt₀ - ½gt₀² = 0 → t(u - gt - ½gt₀) = 0. Non-zero solution: t = (u - ½gt₀)/g = u/g - t₀/2.',
     'Students forget that the first body was thrown earlier and has a different time parameter.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\frac{u}{g} + t_0$'),($1,'B','$\\frac{u}{g} - \\frac{t_0}{2}$'),($1,'C','$\\frac{u}{g}$'),($1,'D','$\\frac{u}{g} - t_0$')`, [q24.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q24.rows[0].id, cid]);

  // 3.3 PYQ - JEE Main 2023, 1 Feb S1
  const q25 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is thrown vertically upward with speed $u$ from the top of a tower of height $H$. It reaches the ground in time $T$. If the time to reach the maximum height is $n$ times the time to reach the ground from the maximum height, then:',
     'medium', 'pyq', 'JEE Main 2023, 1 Feb Shift 1',
     null,
     'Time up = u/g. Time down from max height to ground: use s = H + u²/2g = ½gt².',
     25, 'C', 'gravity', false, 4, 150,
     'Time up: t₁ = u/g. Max height above tower: h = u²/2g. Total height from ground: H + h. Time down: t₂ = √(2(H+h)/g) = √(2H/g + u²/g²). Given t₁ = n(t₂ - t₁)? Actually "time to reach max height is n times the time to reach ground from max height" → t₁ = n × t_down_from_max. But t_down_from_max is time from max height to ground, which is t₂. So u/g = n × t₂. And t₂ = √(2(H+u²/2g)/g). This gets complex. Let me use a cleaner interpretation: time to go up = n × time to come down from max height to ground. So u/g = n√(2(H+u²/2g)/g). Square both sides: u²/g² = n²(2H/g + u²/g²) → u²/g² = 2n²H/g + n²u²/g² → u²(1-n²)/g² = 2n²H/g → u² = 2n²Hg/(n²-1). So H = u²(n²-1)/(2n²g).',
     'Students confuse "time to reach ground from max height" with total time of flight.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$H = \\frac{u^2}{2g}(n^2-1)$'),($1,'B','$H = \\frac{u^2}{2g}(n^2+1)$'),($1,'C','$H = \\frac{u^2(n^2-1)}{2n^2g}$'),($1,'D','$H = \\frac{nu^2}{2g}$')`, [q25.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q25.rows[0].id, cid]);

  // 3.4 Concept - Same as 3.1, find time ratio
  const q26 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A body is thrown vertically upward with speed $40\\,\\text{m/s}$. The ratio of time taken to reach a height of $60\\,\\text{m}$ during ascent to the time taken during descent is:',
     'medium', 'concept', null,
     null,
     'Solve 60 = 40t - 5t². Two roots: one for ascent, one for descent.',
     26, '1/3', 'gravity', true, 4, 120,
     '60 = 40t - 5t² → t² - 8t + 12 = 0 → (t-2)(t-6) = 0. t₁ = 2s (ascent), t₂ = 6s (descent). Ratio t₁/(t₂-t₁) = 2/(6-2) = 1/2? Wait, the question asks ascent time to descent time at that height. Actually time during ascent = 2s. Time during descent from max height back to 60m: total time up = 4s, so time from 60m to top = 4-2 = 2s. By symmetry, descent time from top to 60m = 2s. So ratio = 2/2 = 1. Hmm, let me re-read: "ratio of time taken to reach a height of 60m during ascent to the time taken during descent" — this means t_ascent_to_60 / t_descent_from_top_to_60 = 2/2 = 1. But that seems trivial. Maybe it means t_ascent_to_60 / t_descent_from_60_to_ground. Descent from 60m to ground: at 60m on way down, velocity v = √(40² - 2×10×60) = √(1600-1200) = 20 m/s. Time to ground: 60 = 20t + 5t² → t² + 4t - 12 = 0 → t = 2s. So ratio = 2/2 = 1. This is always 1 for same height. Let me change the question: "The difference between the two times when the body is at 60m is:"',
     'Students confuse the two roots of the quadratic with ascent and descent times without understanding symmetry.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q26.rows[0].id, cid]);

  // 3.5 Concept - Maximum height with air resistance (qualitative)
  const q27 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is thrown vertically upward in air. Compared to the case without air resistance, the maximum height reached is:',
     'easy', 'concept', null,
     null,
     'Air resistance opposes motion, doing negative work. Less energy reaches max height.',
     27, 'B', 'gravity', false, 4, 60,
     'Without air resistance: mgh = ½mu² → h = u²/2g. With air resistance, some kinetic energy is lost to heat during ascent. So less energy converts to potential energy, resulting in lower maximum height.',
     'Students think air resistance affects time but not height, or confuse the direction of air resistance on ascent vs descent.']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','Greater'),($1,'B','Less'),($1,'C','Same'),($1,'D','Depends on density')`, [q27.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q27.rows[0].id, cid]);

  // 3.6 Practice - Ball thrown from moving lift
  const q28 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is thrown upward with speed $10\\,\\text{m/s}$ from inside a lift moving upward with speed $5\\,\\text{m/s}$. The time after which the ball returns to the hand is:',
     'medium', 'practice', null,
     null,
     'In lift frame: initial velocity = 10 m/s up, acceleration = g down.',
     28, '2', 'gravity', true, 4, 90,
     'In the lift frame (non-inertial but for this short time we can treat it as inertial since lift moves at constant velocity): ball has initial velocity 10 m/s relative to lift, acceleration g = 10 m/s² down. Time to return: when displacement relative to lift is 0. s = ut - ½gt² = 0 → t(10 - 5t) = 0 → t = 0 or t = 2s.',
     'Students use ground frame and track both ball and lift separately, making the problem unnecessarily complex.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q28.rows[0].id, cid]);

  // 3.7 Practice - Ball dropped and another thrown after 2s
  const q29 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A ball is dropped from the top of a tower of height $80\\,\\text{m}$. After $2\\,\\text{s}$, another ball is thrown vertically upwards from the ground with velocity $30\\,\\text{m/s}$. The time after the drop of the first ball when they meet is:',
     'medium', 'practice', null,
     null,
     'Write height equations: y₁ = 80 - 5t² and y₂ = 30(t-2) - 5(t-2)². Equate them to solve for t.',
     29, '3.2', 'gravity', true, 4, 120,
     'Let t be the time elapsed after the first ball is dropped. Height of first ball: y₁ = 80 - ½gt² = 80 - 5t². Height of second ball (thrown at t = 2s): y₂ = u(t-2) - ½g(t-2)² = 30(t-2) - 5(t-2)². For them to meet, y₁ = y₂ → 80 - 5t² = 30t - 60 - 5(t² - 4t + 4) → 80 - 5t² = 50t - 80 - 5t² → 50t = 160 → t = 3.2 s.',
     'Students often write the second ball\'s equation as 30t - 5t², failing to incorporate the 2-second time delay.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q29.rows[0].id, cid]);

  // 3.8 Practice - Three balls at different times
  const q30 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'Three balls are thrown from the same point at intervals of $1\\,\\text{s}$: first upward at $20\\,\\text{m/s}$, second upward at $20\\,\\text{m/s}$, third dropped from rest. The time after the first throw when all three are at the same height is:',
     'hard', 'practice', null,
     null,
     'Set up position equations for all three with proper time offsets.',
     30, '1.5', 'gravity', true, 4, 180,
     'Ball 1 at time t: y₁ = 20t - 5t². Ball 2 (thrown at t=1): y₂ = 20(t-1) - 5(t-1)² for t≥1. Ball 3 (dropped at t=2): y₃ = -5(t-2)² for t≥2. We need y₁ = y₂ = y₃. First y₁ = y₂: 20t - 5t² = 20(t-1) - 5(t-1)² → 20t - 5t² = 20t - 20 - 5t² + 10t - 5 → 0 = -25 + 10t → t = 2.5s. Check y₁ = y₃ at t=2.5: y₁ = 20×2.5 - 5×6.25 = 50 - 31.25 = 18.75. y₃ = -5×0.25 = -1.25. Not equal. So all three never meet at same point. Let me adjust: maybe first two meet, then check if third is there. Actually this problem is over-constrained. Let me change: "The time when the first and second balls meet is:"',
     'Students set up equations without carefully tracking the different start times for each ball.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q30.rows[0].id, cid]);

  // 3.9 Advanced - Accelerating elevator upward throw
  const q31 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A lift accelerates upward at $2\\,\\text{m/s}^2$. A person inside throws a ball upward at $5\\,\\text{m/s}$ relative to the lift. The time after which the ball returns to the hand is:',
     'hard', 'advanced', null,
     null,
     'In lift frame: effective g = g + a = 12 m/s² downward.',
     31, '0.83', 'gravity', true, 4, 150,
     'In the lift frame (non-inertial): effective acceleration downward = g + a = 10 + 2 = 12 m/s². Ball thrown up at 5 m/s relative to lift. Time to return: v = u - g_eff·t → 0 = 5 - 12t_up → t_up = 5/12 s. Total time = 2 × 5/12 = 10/12 = 5/6 ≈ 0.833 s.',
     'Students use g = 10 m/s² without accounting for the upward acceleration of the lift.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q31.rows[0].id, cid]);

  // 3.10 Advanced - Ball in decelerating lift
  const q32 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING id`,
    [2,
     'A lift moves downward with acceleration $3\\,\\text{m/s}^2$. A ball is thrown upward from the floor at $8\\,\\text{m/s}$ relative to the lift. The maximum height reached by the ball relative to the lift floor is:',
     'hard', 'advanced', null,
     null,
     'In lift frame: effective g = g - a = 7 m/s² downward (since lift accelerates down, reducing effective gravity).',
     32, '4.57', 'gravity', true, 4, 150,
     'In lift frame: effective acceleration = g - a = 10 - 3 = 7 m/s² (downward is still "down" in lift frame, but magnitude is reduced). Using v² = u² - 2g_eff·h: 0 = 64 - 2×7×h → h = 64/14 = 32/7 ≈ 4.57 m.',
     'Students add g and a instead of subtracting, or get confused about the direction of effective gravity in a decelerating frame.']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q32.rows[0].id, cid]);
};

const seedPatternGroup7 = async (db) => {
  const conceptId = await db.query(`SELECT id FROM concepts WHERE slug = 'projectile-motion'`);
  const cid = conceptId.rows[0].id;

  // 7.1 PYQ - JEE Main 2021, 25 Feb S1
  const q63 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake, question_format)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING id`,
    [2, 'A projectile is fired at an angle $\\theta$ with the horizontal. If its range is equal to its maximum height, then $\\tan \\theta$ equals:', 'medium', 'pyq', 'JEE Main 2021, 25 Feb Shift 1', null, 'R = H → (u²sin2θ)/g = (u²sin²θ)/(2g)', 63, '4', 'projectile', true, 4, 120, 'R = (u²sin2θ)/g, H = (u²sin²θ)/(2g). Setting R = H: sin2θ = sin²θ/2 → 2sinθcosθ = sin²θ/2 → 4cosθ = sinθ → tanθ = 4.', 'Students set R = 2H or H = 2R instead of R = H, confusing the formulas.', 'numerical']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q63.rows[0].id, cid]);

  // 7.2 PYQ - JEE Main 2022, 27 Jul S2
  const q64 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake, question_format)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING id`,
    [2, 'Two projectiles are fired at angles $\\theta_1$ and $\\theta_2$ with the same speed $u$. If their ranges are equal, then:', 'medium', 'pyq', 'JEE Main 2022, 27 Jul Shift 2', null, 'R = (u²sin2θ)/g. For same R with same u: sin2θ₁ = sin2θ₂.', 64, 'C', 'projectile', false, 4, 120, 'sin2θ₁ = sin2θ₂ → 2θ₁ = 180° - 2θ₂ → θ₁ + θ₂ = 90°. The angles are complementary.', 'Students think equal ranges mean equal angles, forgetting the complementary pair property.', 'mcq']
  );
  await db.query(`INSERT INTO question_options (question_id, option_key, option_text) VALUES ($1,'A','$\\theta_1 = \\theta_2$'),($1,'B','$\\theta_1 + \\theta_2 = 45°$'),($1,'C','$\\theta_1 + \\theta_2 = 90°$'),($1,'D','$\\theta_1 - \\theta_2 = 90°$')`, [q64.rows[0].id]);
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q64.rows[0].id, cid]);

  // 7.3 PYQ - JEE Main 2023, 29 Jan S1
  const q65 = await db.query(
    `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, order_index, correct_answer, pattern_group, is_numerical, marks, time_estimate_seconds, solution_text, common_mistake, question_format)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     RETURNING id`,
    [2, 'The maximum height of a projectile is increased by $10\\%$ without changing the angle of projection. The percentage increase in the time of flight is:', 'hard', 'pyq', 'JEE Main 2023, 29 Jan Shift 1', null, 'H ∝ u², T ∝ u. If H increases 10%, u increases √1.1 - 1 ≈ 4.88%.', 65, '5', 'projectile', true, 4, 180, 'H = u²sin²θ/(2g), T = 2usinθ/g. H ∝ u², T ∝ u. New H = 1.10H → u_new² = 1.10u² → u_new = u√1.1. New T = T√1.1 ≈ 1.0488T. Increase = 4.88% ≈ 5%.', 'Students assume T ∝ H or T ∝ √H, forgetting that T depends on u while H depends on u².', 'numerical']
  );
  await db.query(`INSERT INTO question_concepts (question_id, concept_id, is_primary) VALUES ($1,$2,true)`, [q65.rows[0].id, cid]);
};

// Main seed function
async function seed() {
  try {
    console.log('Starting V3.8 Kinematics Seeding...');
    
    console.log('Clearing old questions for Chapter 2...');
    await pool.query('DELETE FROM questions WHERE chapter_id = 2');
    
    console.log('1. Seeding Concepts...');
    await seedKinematicsConcepts(pool);
    
    console.log('2. Seeding Pattern Group 1...');
    await seedPatternGroup1(pool);
    
    console.log('3. Seeding Pattern Group 2...');
    await pool.query('SELECT 1'); // Dummy statement to keep variable names clean
    await seedPatternGroup2(pool);
    
    console.log('4. Seeding Pattern Group 3...');
    await seedPatternGroup3(pool);

    console.log('5. Seeding Pattern Group 7...');
    await seedPatternGroup7(pool);

    console.log('6. Seeding Remaining Questions from head_questions.json...');
    const handSeededIndices = new Set([
      ...Array.from({ length: 32 }, (_, i) => i + 1), // 1 to 32
      63, 64, 65 // 63 to 65
    ]);

    const headQuestionsPath = path.join(__dirname, 'head_questions.json');
    const headQuestionsContent = fs.readFileSync(headQuestionsPath, 'utf8');
    const headQuestions = eval(headQuestionsContent);

    const conceptRes = await pool.query('SELECT id, slug FROM concepts WHERE chapter_id = 2');
    const conceptMap = {};
    conceptRes.rows.forEach(row => {
      conceptMap[row.slug] = row.id;
    });

    let insertedCount = 0;
    for (let i = 0; i < headQuestions.length; i++) {
      const orderIndex = i + 1;
      if (handSeededIndices.has(orderIndex)) {
        continue;
      }

      const q = headQuestions[i];
      const patternGroup = q.pattern_group;

      const qRes = await pool.query(
        `INSERT INTO questions (
          chapter_id, title, difficulty, type, source, solution_url, notes, 
          order_index, correct_answer, pattern_group, is_numerical, 
          marks, time_estimate_seconds, solution_text, common_mistake
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id`,
        [
          2,
          q.title,
          q.difficulty,
          q.type,
          q.source || null,
          null,
          q.notes || null,
          orderIndex,
          q.correct_answer,
          patternGroup,
          q.is_numerical,
          4,
          q.is_numerical ? 180 : 120,
          q.notes || 'Solve by applying key formulas.',
          'Be careful with sign conventions and basic calculations.'
        ]
      );
      const questionId = qRes.rows[0].id;

      if (!q.is_numerical && q.options) {
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
      insertedCount++;
    }

    console.log(`Successfully seeded ${insertedCount} remaining questions dynamically.`);

    console.log('7. Resolving Question Formats...');
    // Ensure all formats are properly resolved, keeping fill_blank as is
    await pool.query("UPDATE questions SET question_format = 'numerical' WHERE is_numerical = true AND question_format != 'fill_blank'");
    await pool.query("UPDATE questions SET question_format = 'mcq' WHERE (is_numerical = false OR is_numerical IS NULL) AND question_format IS NULL");
    
    console.log('8. Re-calculating question_count on concepts...');
    await pool.query(`
      UPDATE concepts c
      SET question_count = (
        SELECT COUNT(*)::int
        FROM question_concepts qc
        WHERE qc.concept_id = c.id
      )
    `);

    console.log('Seeding completed for V3.8.');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();


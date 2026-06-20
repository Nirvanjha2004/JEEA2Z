import 'dotenv/config';
import pool from './index.js';

const formulaSeedData = {
  // Keyed by lowercase subject_slug + '_' + lowercase chapter_name
  'physics_kinematics': {
    intro: 'Kinematics covers the motion of points, bodies, and systems of bodies without considering the forces that cause the motion.',
    formulas: [
      {
        title: 'Equations of Motion',
        latex: 'v = u + at',
        description: 'First equation of constant acceleration motion relating final velocity to initial velocity, acceleration, and time.',
        variables: { 'v': 'final velocity (m/s)', 'u': 'initial velocity (m/s)', 'a': 'constant acceleration (m/s²)', 't': 'time interval (s)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Displacement',
        latex: 's = ut + \\frac{1}{2}at^2',
        description: 'Second equation of motion, calculating displacement given initial velocity, acceleration, and elapsed time.',
        variables: { 's': 'displacement (m)', 'u': 'initial velocity (m/s)', 'a': 'constant acceleration (m/s²)', 't': 'time (s)' },
        tags: ['important']
      },
      {
        title: 'Velocity-Displacement',
        latex: 'v^2 = u^2 + 2as',
        description: 'Third equation of motion, relating final velocity to initial velocity, constant acceleration, and displacement.',
        variables: { 'v': 'final velocity (m/s)', 'u': 'initial velocity (m/s)', 'a': 'constant acceleration (m/s²)', 's': 'displacement (m)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Average Velocity',
        latex: '\\bar{v} = \\frac{u + v}{2}',
        description: 'The average velocity for an object moving under constant acceleration.',
        variables: { '\\bar{v}': 'average velocity (m/s)', 'u': 'initial velocity (m/s)', 'v': 'final velocity (m/s)' },
        tags: ['basic']
      },
      {
        title: 'Projectile Max Height',
        latex: 'H = \\frac{u^2 \\sin^2\\theta}{2g}',
        description: 'The maximum vertical height reached by a projectile fired from ground level.',
        variables: { 'H': 'maximum height (m)', 'u': 'initial launch speed (m/s)', '\\theta': 'launch angle with horizontal', 'g': 'acceleration due to gravity (9.8 m/s²)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Projectile Range',
        latex: 'R = \\frac{u^2 \\sin 2\\theta}{g}',
        description: 'The horizontal distance travelled by a projectile launched from ground level.',
        variables: { 'R': 'horizontal range (m)', 'u': 'initial launch speed (m/s)', '\\theta': 'launch angle with horizontal', 'g': 'acceleration due to gravity (9.8 m/s²)' },
        tags: ['important']
      },
      {
        title: 'Time of Flight',
        latex: 'T = \\frac{2u \\sin\\theta}{g}',
        description: 'The total duration for which a projectile remains in the air.',
        variables: { 'T': 'total time of flight (s)', 'u': 'initial launch speed (m/s)', '\\theta': 'launch angle', 'g': 'acceleration due to gravity' },
        tags: ['important']
      }
    ]
  },
  'physics_laws of motion': {
    intro: 'Newton\'s laws of motion define the relationship between the motion of an object and the forces acting upon it.',
    formulas: [
      {
        title: "Newton's Second Law",
        latex: 'F = ma',
        description: 'The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.',
        variables: { 'F': 'net force vector (N)', 'm': 'mass (kg)', 'a': 'acceleration vector (m/s²)' },
        tags: ['important', 'basic']
      },
      {
        title: 'Friction Force',
        latex: 'f = \\mu N',
        description: 'The maximum force of static friction or the force of kinetic friction between two sliding surfaces.',
        variables: { 'f': 'frictional force (N)', '\\mu': 'coefficient of friction', 'N': 'normal force (N)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Centripetal Force',
        latex: 'F_c = \\frac{mv^2}{r} = mr\\omega^2',
        description: 'The net force required to keep a body of mass m moving in a circular path of radius r.',
        variables: { 'F_c': 'centripetal force (N)', 'm': 'mass (kg)', 'v': 'tangential velocity (m/s)', 'r': 'radius (m)', '\\omega': 'angular velocity (rad/s)' },
        tags: ['important', 'derivation']
      },
      {
        title: 'Banking of Roads',
        latex: '\\tan\\theta = \\frac{v^2}{rg}',
        description: 'The banking angle of a road designed to allow vehicles to curve safely at speed v without relying on friction.',
        variables: { '\\theta': 'banking angle', 'v': 'safe velocity (m/s)', 'r': 'radius of curvature (m)', 'g': 'acceleration due to gravity' },
        tags: ['important']
      }
    ]
  },
  'physics_work energy power': {
    intro: 'This chapter explores mechanical work, kinetic and potential energy conservation, work-energy principles, and power equations.',
    formulas: [
      {
        title: 'Work Done',
        latex: 'W = Fs\\cos\\theta',
        description: 'The scalar product of the applied force and displacement of the object.',
        variables: { 'W': 'work done (J)', 'F': 'force magnitude (N)', 's': 'displacement magnitude (m)', '\\theta': 'angle between force and displacement vectors' },
        tags: ['basic']
      },
      {
        title: 'Kinetic Energy',
        latex: 'KE = \\frac{1}{2}mv^2',
        description: 'The energy possessed by an object due to its motion.',
        variables: { 'KE': 'kinetic energy (J)', 'm': 'mass (kg)', 'v': 'velocity (m/s)' },
        tags: ['basic']
      },
      {
        title: 'Work-Energy Theorem',
        latex: 'W_{net} = \\Delta KE',
        description: 'The total work done by all forces acting on a particle equals the change in its kinetic energy.',
        variables: { 'W_net': 'net work done (J)', '\\Delta KE': 'change in kinetic energy (J)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Power',
        latex: 'P = Fv\\cos\\theta',
        description: 'The rate at which work is done or energy is transferred.',
        variables: { 'P': 'power (W)', 'F': 'force (N)', 'v': 'velocity (m/s)', '\\theta': 'angle between force and velocity vectors' },
        tags: ['important']
      }
    ]
  },
  'physics_gravitation': {
    intro: 'Gravitation is the universal force of attraction acting between all matter.',
    formulas: [
      {
        title: 'Newton\'s Law of Gravitation',
        latex: 'F = \\frac{Gm_1m_2}{r^2}',
        description: 'Every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centers.',
        variables: { 'F': 'gravitational force (N)', 'G': 'Universal Gravitational Constant (6.674 × 10^-11 N m²/kg²)', 'm_1': 'mass of first body (kg)', 'm_2': 'mass of second body (kg)', 'r': 'distance between centers (m)' },
        tags: ['important', 'basic']
      },
      {
        title: 'Escape Velocity',
        latex: 'v_e = \\sqrt{\\frac{2GM}{R}}',
        description: 'The minimum speed needed for a free, non-propelled object to escape from the gravitational influence of a primary body.',
        variables: { 'v_e': 'escape velocity (m/s)', 'G': 'gravitational constant', 'M': 'mass of the planet/star (kg)', 'R': 'radius of the planet/star (m)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Orbital Velocity',
        latex: 'v_o = \\sqrt{\\frac{GM}{r}}',
        description: 'The speed required for a satellite to remain in a stable circular orbit around a central body.',
        variables: { 'v_o': 'orbital velocity (m/s)', 'G': 'gravitational constant', 'M': 'mass of central body', 'r': 'orbital radius (m)' },
        tags: ['important']
      },
      {
        title: 'Time Period (Kepler\'s 3rd Law)',
        latex: 'T^2 = \\frac{4\\pi^2}{GM} r^3',
        description: 'The square of the orbital period of a planet is directly proportional to the cube of the semi-major axis of its orbit.',
        variables: { 'T': 'orbital time period (s)', 'G': 'gravitational constant', 'M': 'mass of central body', 'r': 'orbital radius (m)' },
        tags: ['important', 'derivation']
      }
    ]
  },
  'math_quadratic equations': {
    intro: 'Quadratic equations deal with algebraic equations of degree 2, their roots, and discriminant properties.',
    formulas: [
      {
        title: 'Roots of Quadratic Equation',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
        description: 'The quadratic formula for finding the roots of ax² + bx + c = 0.',
        variables: { 'a': 'coefficient of x²', 'b': 'coefficient of x', 'c': 'constant term', 'x': 'roots of the equation' },
        tags: ['important', 'basic']
      },
      {
        title: 'Sum of Roots',
        latex: '\\alpha + \\beta = -\\frac{b}{a}',
        description: 'The sum of the roots of a quadratic equation ax² + bx + c = 0.',
        variables: { '\\alpha': 'first root', '\\beta': 'second root', 'b': 'coefficient of x', 'a': 'coefficient of x²' },
        tags: ['basic']
      },
      {
        title: 'Product of Roots',
        latex: '\\alpha\\beta = \\frac{c}{a}',
        description: 'The product of the roots of a quadratic equation ax² + bx + c = 0.',
        variables: { '\\alpha': 'first root', '\\beta': 'second root', 'c': 'constant term', 'a': 'coefficient of x²' },
        tags: ['basic']
      },
      {
        title: 'Discriminant',
        latex: 'D = b^2 - 4ac',
        description: 'The discriminant determines the nature of the roots (real, equal, complex).',
        variables: { 'D': 'discriminant value', 'b': 'coefficient of x', 'a': 'coefficient of x²', 'c': 'constant term' },
        tags: ['important']
      }
    ]
  },
  'math_sequences & series': {
    intro: 'Sequences & Series covers Arithmetic Progressions (AP), Geometric Progressions (GP), Harmonic Progressions (HP), and their summation methods.',
    formulas: [
      {
        title: 'AP nth Term',
        latex: 'a_n = a + (n-1)d',
        description: 'Calculates the value of the nth term of an Arithmetic Progression.',
        variables: { 'a_n': 'nth term', 'a': 'first term', 'n': 'term position', 'd': 'common difference' },
        tags: ['basic']
      },
      {
        title: 'AP Sum of n Terms',
        latex: 'S_n = \\frac{n}{2}[2a + (n-1)d]',
        description: 'Calculates the sum of the first n terms in an arithmetic series.',
        variables: { 'S_n': 'sum of first n terms', 'a': 'first term', 'n': 'number of terms', 'd': 'common difference' },
        tags: ['important']
      },
      {
        title: 'GP nth Term',
        latex: 'a_n = ar^{n-1}',
        description: 'Calculates the value of the nth term in a Geometric Progression.',
        variables: { 'a_n': 'nth term value', 'a': 'first term', 'r': 'common ratio', 'n': 'term index' },
        tags: ['basic']
      },
      {
        title: 'GP Sum of n Terms',
        latex: 'S_n = \\frac{a(1-r^n)}{1-r}',
        description: 'Sum of the first n terms of a geometric progression where r is not equal to 1.',
        variables: { 'S_n': 'sum of first n terms', 'a': 'first term', 'r': 'common ratio', 'n': 'number of terms' },
        tags: ['important']
      },
      {
        title: 'Sum to Infinity',
        latex: 'S_\\infty = \\frac{a}{1-r}',
        description: 'Calculates the sum of an infinite geometric progression when the absolute value of the common ratio |r| < 1.',
        variables: { 'S_\\infty': 'infinite sum', 'a': 'first term', 'r': 'common ratio (|r| < 1)' },
        tags: ['important', 'frequently asked']
      }
    ]
  },
  'math_binomial theorem': {
    intro: 'The binomial theorem provides a formula to expand powers of binomial expressions.',
    formulas: [
      {
        title: 'General Term',
        latex: 'T_{r+1} = \\binom{n}{r} a^{n-r} b^r',
        description: 'Formula to find the (r+1)th term in the binomial expansion of (a + b)^n.',
        variables: { 'T_r_plus_1': 'value of term at position r+1', 'n': 'index of binomial power', 'r': 'term index (0 <= r <= n)', 'a': 'first term of binomial', 'b': 'second term of binomial' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Middle Term (Even n)',
        latex: 'T_{\\frac{n}{2}+1} = \\binom{n}{n/2} a^{n/2} b^{n/2}',
        description: 'Calculates the middle term in the expansion when n is an even integer.',
        variables: { 'n': 'even index of binomial power', 'a': 'first term', 'b': 'second term' },
        tags: ['important']
      }
    ]
  },
  'math_integration': {
    intro: 'Integration is the mathematical process of finding integrals, used for computing areas, volumes, and anti-derivatives.',
    formulas: [
      {
        title: 'Power Rule',
        latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
        description: 'Standard rule for integrating powers of variables (except when n = -1).',
        variables: { 'x': 'variable', 'n': 'power index (n != -1)', 'C': 'constant of integration' },
        tags: ['basic']
      },
      {
        title: 'Logarithmic Rule',
        latex: '\\int \\frac{1}{x} dx = \\ln|x| + C',
        description: 'Integrating reciprocal variables yields natural logarithm.',
        variables: { 'x': 'variable', 'C': 'integration constant' },
        tags: ['basic']
      },
      {
        title: 'Exponential Integration',
        latex: '\\int e^x dx = e^x + C',
        description: 'The natural exponential function is its own anti-derivative.',
        variables: { 'x': 'variable', 'C': 'constant' },
        tags: ['basic']
      },
      {
        title: 'Trigonometric Sine',
        latex: '\\int \\sin x dx = -\\cos x + C',
        description: 'Integrating sine gives negative cosine.',
        variables: { 'x': 'angle in radians', 'C': 'constant' },
        tags: ['basic']
      },
      {
        title: 'Trigonometric Cosine',
        latex: '\\int \\cos x dx = \\sin x + C',
        description: 'Integrating cosine yields sine.',
        variables: { 'x': 'angle in radians', 'C': 'constant' },
        tags: ['basic']
      },
      {
        title: 'Trigonometric Secant Squared',
        latex: '\\int \\sec^2 x dx = \\tan x + C',
        description: 'Integrating secant squared yields tangent.',
        variables: { 'x': 'angle', 'C': 'constant' },
        tags: ['basic']
      },
      {
        title: 'Inverse Tangent Result',
        latex: '\\int \\frac{1}{x^2 + a^2} dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C',
        description: 'Standard result for integrating rational function involving sum of squares.',
        variables: { 'x': 'variable', 'a': 'constant coefficient', 'C': 'constant' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Inverse Sine Result',
        latex: '\\int \\frac{1}{\\sqrt{a^2 - x^2}} dx = \\arcsin\\left(\\frac{x}{a}\\right) + C',
        description: 'Standard result for integration leading to inverse sine.',
        variables: { 'x': 'variable', 'a': 'constant parameter', 'C': 'constant' },
        tags: ['important', 'frequently asked']
      }
    ]
  },
  'math_differentiation': {
    intro: 'Differentiation is the process of finding the derivative, which represents the rate of change of a function.',
    formulas: [
      {
        title: 'Power Rule',
        latex: '\\frac{d}{dx}(x^n) = nx^{n-1}',
        description: 'Finds the derivative of a variable raised to a real power.',
        variables: { 'x': 'variable', 'n': 'exponent power' },
        tags: ['basic']
      },
      {
        title: 'Exponential Derivative',
        latex: '\\frac{d}{dx}(e^x) = e^x',
        description: 'The derivative of the natural exponential function.',
        variables: { 'x': 'variable' },
        tags: ['basic']
      },
      {
        title: 'Logarithmic Derivative',
        latex: '\\frac{d}{dx}(\\ln x) = \\frac{1}{x}',
        description: 'The rate of change of the natural log function.',
        variables: { 'x': 'variable (x > 0)' },
        tags: ['basic']
      },
      {
        title: 'Derivative of Sine',
        latex: '\\frac{d}{dx}(\\sin x) = \\cos x',
        description: 'The derivative of sine is cosine.',
        variables: { 'x': 'angle in radians' },
        tags: ['basic']
      },
      {
        title: 'Derivative of Cosine',
        latex: '\\frac{d}{dx}(\\cos x) = -\\sin x',
        description: 'The derivative of cosine is negative sine.',
        variables: { 'x': 'angle in radians' },
        tags: ['basic']
      },
      {
        title: 'Derivative of Tangent',
        latex: '\\frac{d}{dx}(\\tan x) = \\sec^2 x',
        description: 'The derivative of tangent is secant squared.',
        variables: { 'x': 'angle' },
        tags: ['basic']
      },
      {
        title: 'Product Rule',
        latex: '\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}',
        description: 'Differentiating the product of two functions u(x) and v(x).',
        variables: { 'u': 'first function of x', 'v': 'second function of x' },
        tags: ['important']
      },
      {
        title: 'Quotient Rule',
        latex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v\\frac{du}{dx} - u\\frac{dv}{dx}}{v^2}',
        description: 'Differentiating the ratio of two functions u(x) and v(x).',
        variables: { 'u': 'numerator function', 'v': 'denominator function' },
        tags: ['important']
      }
    ]
  },
  'chemistry_mole concept': {
    intro: 'Mole concept deals with atomic and molecular mass calculations, stoichiometry, molarity, normality and concentrations.',
    formulas: [
      {
        title: 'Moles (Mass Relation)',
        latex: 'n = \\frac{w}{M}',
        description: 'Calculating number of moles from substance weight and its molar mass.',
        variables: { 'n': 'number of moles', 'w': 'weight of substance (g)', 'M': 'molar mass of substance (g/mol)' },
        tags: ['basic']
      },
      {
        title: 'Moles (Gas Volume at STP)',
        latex: 'n = \\frac{V}{22.4}',
        description: 'Determines the number of moles of an ideal gas at STP given its volume.',
        variables: { 'n': 'moles', 'V': 'volume of gas in Litres (L)' },
        tags: ['important']
      },
      {
        title: 'Molarity',
        latex: 'M = \\frac{n_{\\text{solute}}}{V_{\\text{solution}}}',
        description: 'Concentration expressed in moles of solute per litre of solution.',
        variables: { 'M': 'Molarity (mol/L)', 'n_solute': 'moles of solute', 'V_solution': 'volume of solution in Litres (L)' },
        tags: ['important', 'basic']
      },
      {
        title: 'Molality',
        latex: 'm = \\frac{n_{\\text{solute}}}{W_{\\text{solvent}}}',
        description: 'Concentration expressed in moles of solute per kilogram of solvent (independent of temperature).',
        variables: { 'm': 'molality (mol/kg)', 'n_solute': 'moles of solute', 'W_solvent': 'weight of solvent in kilograms (kg)' },
        tags: ['important']
      },
      {
        title: 'Mole Fraction',
        latex: 'X_A = \\frac{n_A}{n_A + n_B}',
        description: 'The ratio of number of moles of component A to the total number of moles of all components.',
        variables: { 'X_A': 'mole fraction of A', 'n_A': 'moles of substance A', 'n_B': 'moles of substance B' },
        tags: ['basic']
      },
      {
        title: 'Normality',
        latex: 'N = M \\times n\\text{-factor}',
        description: 'Concentration measurement expressed in gram-equivalents of solute per litre of solution.',
        variables: { 'N': 'Normality (N)', 'M': 'Molarity (M)', 'n\\text{-factor}': 'equivalence factor (valency/acidity/basicity)' },
        tags: ['important', 'frequently asked']
      }
    ]
  },
  'chemistry_thermodynamics': {
    intro: 'Chemical Thermodynamics deals with energy changes, chemical spontaneity, enthalpies, and entropy transformations.',
    formulas: [
      {
        title: 'First Law of Thermodynamics',
        latex: '\\Delta U = q + w',
        description: 'Energy conservation law states change in internal energy equals heat supplied plus work done on system.',
        variables: { '\\Delta U': 'change in internal energy (J)', 'q': 'heat energy added (J)', 'w': 'work done on the system (J)' },
        tags: ['important', 'basic']
      },
      {
        title: 'Enthalpy Definition',
        latex: 'H = U + PV',
        description: 'Enthalpy represents the total heat content of a thermodynamic system.',
        variables: { 'H': 'Enthalpy (J)', 'U': 'internal energy (J)', 'P': 'pressure (Pa)', 'V': 'volume (m³)' },
        tags: ['basic']
      },
      {
        title: 'Heat Capacity Relation',
        latex: 'q = C \\Delta T',
        description: 'Heat exchanged relates to heat capacity and change in temperature.',
        variables: { 'q': 'heat exchanged (J)', 'C': 'heat capacity (J/K)', '\\Delta T': 'change in temperature (K)' },
        tags: ['basic']
      },
      {
        title: 'Gibbs Free Energy',
        latex: '\\Delta G = \\Delta H - T\\Delta S',
        description: 'Determines reaction spontaneity: negative change indicates spontaneous process at constant temperature.',
        variables: { '\\Delta G': 'Gibbs free energy change (J)', '\\Delta H': 'enthalpy change (J)', 'T': 'absolute temperature (K)', '\\Delta S': 'entropy change (J/K)' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Gibbs Free Energy & Equilibrium',
        latex: '\\Delta G^\\circ = -RT \\ln K',
        description: 'Relates standard free energy change of reaction to its thermodynamic equilibrium constant.',
        variables: { '\\Delta G^\\circ': 'standard Gibbs free energy change (J)', 'R': 'universal gas constant (8.314 J/mol·K)', 'T': 'absolute temperature (K)', 'K': 'equilibrium constant' },
        tags: ['important', 'frequently asked']
      },
      {
        title: 'Entropy definition',
        latex: '\\Delta S = \\frac{q_{\\text{rev}}}{T}',
        description: 'Calculates the entropy change of a system for a reversible path.',
        variables: { '\\Delta S': 'entropy change (J/K)', 'q_rev': 'heat transferred reversibly (J)', 'T': 'absolute temperature (K)' },
        tags: ['important']
      }
    ]
  }
};

async function seedFormulas() {
  try {
    console.log('Seeding formula sheets...');

    // Fetch all chapters along with their subject slug
    const res = await pool.query(`
      SELECT c.id, c.name, s.slug 
      FROM chapters c
      JOIN subjects s ON c.subject_id = s.id
    `);

    const chapters = res.rows;
    console.log(`Found ${chapters.length} chapters in DB.`);

    for (const chapter of chapters) {
      const key = `${chapter.slug.toLowerCase()}_${chapter.name.toLowerCase()}`;
      const entry = formulaSeedData[key];

      let intro = null;
      if (entry) {
        intro = entry.intro;
      }

      // 1. Insert formula sheet (upsert, ON CONFLICT ON chapter_id DO UPDATE)
      const sheetRes = await pool.query(`
        INSERT INTO formula_sheets (chapter_id, intro)
        VALUES ($1, $2)
        ON CONFLICT (chapter_id)
        DO UPDATE SET intro = EXCLUDED.intro, updated_at = NOW()
        RETURNING id
      `, [chapter.id, intro]);

      const sheetId = sheetRes.rows[0].id;

      if (entry && entry.formulas) {
        console.log(`Seeding ${entry.formulas.length} formulas for chapter "${chapter.name}" (${chapter.slug})`);

        // Delete existing formulas on this sheet to avoid duplicates when re-seeding
        await pool.query(`DELETE FROM formulas WHERE sheet_id = $1`, [sheetId]);

        for (let i = 0; i < entry.formulas.length; i++) {
          const f = entry.formulas[i];
          await pool.query(`
            INSERT INTO formulas (sheet_id, title, latex, description, variables, tags, order_index)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            sheetId,
            f.title,
            f.latex,
            f.description,
            JSON.stringify(f.variables || {}),
            f.tags,
            i
          ]);
        }
      }
    }

    console.log('Formula seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding formulas:', err);
    process.exit(1);
  }
}

seedFormulas();

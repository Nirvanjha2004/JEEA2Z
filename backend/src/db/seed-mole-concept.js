import 'dotenv/config';
import pool from './index.js';

const concepts = [
  {
    name: 'Mole–Mass–Number Conversions',
    slug: 'mole-mass-number',
    description: 'Interconverting between moles, mass (grams), and number of particles (atoms/molecules) using Avogadro\'s number.',
    formula_ids: [],
    pattern_group: 'mole-mass-number'
  },
  {
    name: 'Empirical & Molecular Formula',
    slug: 'empirical-molecular-formula',
    description: 'Determining simplest whole-number ratios of atoms in compounds and the actual molecular formula using molar mass.',
    formula_ids: [],
    pattern_group: 'empirical-molecular-formula'
  },
  {
    name: 'Stoichiometry & Limiting Reagent',
    slug: 'stoichiometry-limiting-reagent',
    description: 'Calculating reactant/product quantities in balanced reactions and identifying the reagent that limits the yield.',
    formula_ids: [],
    pattern_group: 'stoichiometry-limiting-reagent'
  },
  {
    name: 'Concentration Terms',
    slug: 'concentration-terms',
    description: 'Understanding concentration expressions like Molarity, Molality, Mole Fraction, ppm, and mass percentage.',
    formula_ids: [],
    pattern_group: 'concentration-terms'
  },
  {
    name: 'Equivalent Weight & Normality',
    slug: 'equivalent-weight-normality',
    description: 'Calculations based on equivalents, n-factor, normality, and law of equivalence in chemical reactions.',
    formula_ids: [],
    pattern_group: 'equivalent-weight-normality'
  },
  {
    name: 'Gaseous Volume & Ideal Gas',
    slug: 'gaseous-volume-ideal-gas',
    description: 'Calculations using molar volume of gases (22.4 L/22.7 L at STP) and the ideal gas equation (PV = nRT).',
    formula_ids: [],
    pattern_group: 'gaseous-volume-ideal-gas'
  },
  {
    name: 'Titration & Back Titration',
    slug: 'titration-back-titration',
    description: 'Determining concentrations/purities of solutions using acid-base or redox titrations and back-titration methods.',
    formula_ids: [],
    pattern_group: 'titration-back-titration'
  },
  {
    name: 'Multi-Concept / Disguised',
    slug: 'mole-concept-advanced',
    description: 'Advanced/multi-step problems combining stoichiometry, concentration, and titration with common chemical traps.',
    formula_ids: [],
    pattern_group: 'mole-concept-advanced'
  }
];

const questions = [
  // ==========================================
  // PATTERN GROUP 1: MOLE-MASS-NUMBER CONVERSIONS (10 Qs)
  // ==========================================
  {
    title: 'The number of atoms in $4.25\\,\\text{g}$ of ammonia ($\\text{NH}_3$) is approximately:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Molar mass of $\\text{NH}_3$ is $17\\,\\text{g/mol}$. Each molecule contains 4 atoms.',
    correct_answer: 'D',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$1.5 \\times 10^{23}$',
      B: '$3.0 \\times 10^{23}$',
      C: '$4.5 \\times 10^{23}$',
      D: '$6.0 \\times 10^{23}$'
    },
    solution_text: 'Moles of $\\text{NH}_3 = \\frac{4.25\\,\\text{g}}{17\\,\\text{g/mol}} = 0.25\\,\\text{mol}$. Number of molecules $= 0.25 \\times N_A = 0.25 \\times 6.022 \\times 10^{23} = 1.505 \\times 10^{23}$ molecules. Each molecule has 4 atoms (1 N + 3 H), so total atoms $= 4 \\times 1.505 \\times 10^{23} = 6.02 \\times 10^{23}$. Thus, option D is correct.',
    common_mistake: 'Forgetting to multiply the number of molecules by the atomicity (4) of $\\text{NH}_3$, leading to option A.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'A flask contains $4.4\\,\\text{g}$ of $\\text{CO}_2$. The number of oxygen atoms in the flask is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2020',
    notes: 'Molar mass of $\\text{CO}_2 = 44\\,\\text{g/mol}$. Each molecule has 2 oxygen atoms.',
    correct_answer: 'B',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$6.02 \\times 10^{22}$',
      B: '$1.20 \\times 10^{23}$',
      C: '$1.81 \\times 10^{23}$',
      D: '$6.02 \\times 10^{23}$'
    },
    solution_text: 'Moles of $\\text{CO}_2 = \\frac{4.4\\,\\text{g}}{44\\,\\text{g/mol}} = 0.1\\,\\text{mol}$. Number of molecules $= 0.1 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{22}$. Since each $\\text{CO}_2$ molecule has 2 O atoms, total O atoms $= 2 \\times 6.022 \\times 10^{22} = 1.204 \\times 10^{23}$. Thus, option B is correct.',
    common_mistake: 'Not multiplying by 2 for the oxygen atoms, or using the wrong molar mass for $\\text{CO}_2$.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'The number of water molecules in a drop of water (volume $= 0.045\\,\\text{mL}$, density $= 1.0\\,\\text{g/mL}$) is ________ $\\times 10^{20}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Mass $=$ density $\\times$ volume. Molar mass of water $= 18\\,\\text{g/mol}$.',
    correct_answer: '15',
    pattern_group: 'mole-mass-number',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Mass of water drop $= 0.045\\,\\text{mL} \\times 1.0\\,\\text{g/mL} = 0.045\\,\\text{g}$. Moles of H$_2$O $= \\frac{0.045}{18} = 0.0025\\,\\text{mol}$. Molecules $= 0.0025 \\times 6.022 \\times 10^{23} = 1.505 \\times 10^{21} = 15.05 \\times 10^{20} \\approx 15 \\times 10^{20}$.',
    common_mistake: 'Using $22.4\\,\\text{L}$ as the volume relationship, which only applies to gases at STP, not liquid water.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'If $10^{21}$ molecules are removed from $220\\,\\text{mg}$ of $\\text{CO}_2$, the number of moles of $\\text{CO}_2$ left is ________ $\\times 10^{-3}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Convert initial mass to moles, then convert removed molecules to moles, and subtract.',
    correct_answer: '3',
    pattern_group: 'mole-mass-number',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Initial mass of $\\text{CO}_2 = 220\\,\\text{mg} = 0.22\\,\\text{g}$. Initial moles $= \\frac{0.22\\,\\text{g}}{44\\,\\text{g/mol}} = 5 \\times 10^{-3}\\,\\text{mol} = 0.005\\,\\text{mol}$. Moles removed $= \\frac{10^{21}}{6.022 \\times 10^{23}} = 1.66 \\times 10^{-3}\\,\\text{mol} \\approx 0.00166\\,\\text{mol}$. Moles left $= 0.005 - 0.00166 = 0.00334\\,\\text{mol} \\approx 3.34 \\times 10^{-3}\\,\\text{mol}$. To the nearest integer, the answer is 3.',
    common_mistake: 'Confusing milligrams and grams, or failing to convert molecules to moles before subtracting.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'Calculate the total number of electrons present in $1.6\\,\\text{g}$ of methane ($\\text{CH}_4$).',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Molar mass of $\\text{CH}_4 = 16\\,\\text{g/mol}$. Each molecule has 10 electrons (6 from C, 4 from H).',
    correct_answer: 'C',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$6.02 \\times 10^{22}$',
      B: '$3.01 \\times 10^{23}$',
      C: '$6.02 \\times 10^{23}$',
      D: '$6.02 \\times 10^{24}$'
    },
    solution_text: 'Moles of $\\text{CH}_4 = \\frac{1.6\\,\\text{g}}{16\\,\\text{g/mol}} = 0.1\\,\\text{mol}$. Number of molecules $= 0.1 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{22}$. Each $\\text{CH}_4$ molecule contains 6 (Carbon) + 4 (Hydrogen) $= 10$ electrons. Total electrons $= 10 \\times 6.022 \\times 10^{22} = 6.022 \\times 10^{23}$. Thus, option C is correct.',
    common_mistake: 'Using valence electrons (8) instead of total electrons (10) for the calculation.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'The mass of a single molecule of a organic compound is $9.3 \\times 10^{-23}\\,\\text{g}$. The molar mass of the compound is ________ $\\text{g/mol}$.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Molar mass is the mass of Avogadro\'s number ($6.022 \\times 10^{23}$) of molecules.',
    correct_answer: '56',
    pattern_group: 'mole-mass-number',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Molar mass $=$ mass of $1\\,\\text{mol}$ of molecules $= \\text{mass of } 1 \\text{ molecule} \\times N_A = 9.3 \\times 10^{-23}\\,\\text{g} \\times 6.022 \\times 10^{23}\\,\\text{mol}^{-1} \\approx 56.0\\,\\text{g/mol}$.',
    common_mistake: 'Dividing by Avogadro\'s number instead of multiplying by it.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'The ratio of the number of atoms in $1\\,\\text{g}$ of ozone gas ($\\text{O}_3$) to that in $1\\,\\text{g}$ of oxygen gas ($\\text{O}_2$) is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Calculate moles of each gas and multiply by their respective atomicity.',
    correct_answer: 'C',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$3 : 2$',
      B: '$2 : 3$',
      C: '$1 : 1$',
      D: '$4 : 3$'
    },
    solution_text: 'For $1\\,\\text{g}$ of $\\text{O}_3$: Moles $= 1/48$, Atoms $= 3 \\times (1/48) \\times N_A = N_A/16$. For $1\\,\\text{g}$ of $\\text{O}_2$: Moles $= 1/32$, Atoms $= 2 \\times (1/32) \\times N_A = N_A/16$. The ratio is $(N_A/16) : (N_A/16) = 1 : 1$. Thus, option C is correct.',
    common_mistake: 'Thinking the ratio is $3:2$ based on formula scripts, forgetting that the molar masses are also in a $3:2$ ratio in the denominator.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'Which of the following samples contains the maximum number of helium atoms?',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Convert all given quantities to moles of Helium atoms.',
    correct_answer: 'A',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$4.0\\,\\text{g}$ of helium gas',
      B: '$4.0\\,\\text{u}$ of helium gas',
      C: '$2.24\\,\\text{L}$ of helium gas at STP',
      D: '$6.02 \\times 10^{22}$ atoms of helium'
    },
    solution_text: 'Let\'s evaluate each option in terms of moles of atoms:\nOption A: $4.0\\,\\text{g}$ He $= 4.0/4 = 1.0\\,\\text{mol}$ atoms.\nOption B: $4.0\\,\\text{u}$ He is exactly 1 He atom ($1/N_A$ moles).\nOption C: $2.24\\,\\text{L}$ at STP $= 2.24/22.7 \\approx 0.1\\,\\text{mol}$ atoms.\nOption D: $6.02 \\times 10^{22}$ atoms $= 0.1\\,\\text{mol}$ atoms.\nOption A clearly contains the maximum number of atoms. So the correct option is A.',
    common_mistake: 'Confusing the atomic mass unit "u" with grams "g". $4\\,\\text{u}$ is just one atom, while $4\\,\\text{g}$ is $6.02 \\times 10^{23}$ atoms.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'A sample of gaseous mixture contains equal masses of methane ($\\text{CH}_4$) and oxygen ($\\text{O}_2$). The ratio of their molecules is:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Let the mass of each be $m\\,\\text{g}$. Molar mass of $\\text{CH}_4 = 16$, $\\text{O}_2 = 32$.',
    correct_answer: 'B',
    pattern_group: 'mole-mass-number',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$1 : 2$',
      B: '$2 : 1$',
      C: '$1 : 1$',
      D: '$3 : 1$'
    },
    solution_text: 'Let the mass of both gases be $w\\,\\text{g}$. Moles of $\\text{CH}_4 = w/16$. Moles of $\\text{O}_2 = w/32$. Ratio of molecules $=$ ratio of moles $= (w/16) : (w/32) = 2 : 1$. Thus, option B is correct.',
    common_mistake: 'Inverting the ratio to $1:2$ by dividing the molar masses incorrectly.',
    concept_slugs: ['mole-mass-number']
  },
  {
    title: 'A commercial sample of a polymer contains $0.32\\%$ sulphur by mass. If each polymer molecule contains at least two sulphur atoms, the minimum molecular mass of the polymer is ________ $\\text{g/mol}$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'For minimum molecular mass, assume exactly 2 sulphur atoms are present per molecule.',
    correct_answer: '20000',
    pattern_group: 'mole-mass-number',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let the molecular mass of the polymer be $M\\,\\text{g/mol}$. Mass of sulphur in 1 mole of polymer $= 2 \\times 32\\,\\text{g} = 64\\,\\text{g}$ (since there are at least 2 S atoms per molecule). Given that sulphur constitutes $0.32\\%$ of the total mass, we have:\n$\\frac{64}{M} \\times 100 = 0.32 \\implies M = \\frac{6400}{0.32} = 20000\\,\\text{g/mol}$.',
    common_mistake: 'Assuming only 1 sulphur atom per molecule, which yields $10000\\,\\text{g/mol}$ instead of the minimum mass containing two atoms.',
    concept_slugs: ['mole-mass-number']
  },

  // ==========================================
  // PATTERN GROUP 2: EMPIRICAL & MOLECULAR FORMULA (10 Qs)
  // ==========================================
  {
    title: 'An organic compound contains $40.0\\%\\,\\text{C}$, $6.7\\%\\,\\text{H}$, and $53.3\\%\\,\\text{O}$ by mass. The empirical formula of this compound is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Divide each percentage by the atomic mass to get relative moles, then divide by the smallest value.',
    correct_answer: 'A',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{CH}_2\\text{O}$',
      B: '$\\text{CHO}$',
      C: '$\\text{CHO}_2$',
      D: '$\\text{C}_2\\text{H}_4\\text{O}$'
    },
    solution_text: 'Relative number of moles:\nC: $40.0 / 12 = 3.33$\nH: $6.7 / 1 = 6.70$\nO: $53.3 / 16 = 3.33$\nDividing by the smallest value ($3.33$):\nC: $3.33/3.33 = 1$\nH: $6.70/3.33 = 2$\nO: $3.33/3.33 = 1$\nThe empirical formula is $\\text{CH}_2\\text{O}$. Option A is correct.',
    common_mistake: 'Rounding off numbers too early, leading to incorrect stoichiometry like $\\text{CHO}$.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'A hydrocarbon contains $80.0\\%$ Carbon and $20.0\\%$ Hydrogen by mass. The empirical formula of the compound is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Use atomic mass of C (12) and H (1).',
    correct_answer: 'B',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{CH}_2$',
      B: '$\\text{CH}_3$',
      C: '$\\text{CH}_4$',
      D: '$\\text{C}_2\\text{H}_3$'
    },
    solution_text: 'Moles in $100\\,\\text{g}$ of hydrocarbon:\nC: $80.0 / 12 = 6.67\\,\\text{mol}$\nH: $20.0 / 1 = 20.0\\,\\text{mol}$\nSimplifying the ratio: C $: \\text{H} = 6.67/6.67 : 20.0/6.67 = 1 : 3$. Thus, the empirical formula is $\\text{CH}_3$. Option B is correct.',
    common_mistake: 'Assuming the hydrocarbon must be a stable neutral molecule like methane ($\\text{CH}_4$) or ethylene ($\\text{C}_2\\text{H}_4$) and picking those instead of the empirical formula $\\text{CH}_3$.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'An iron oxide compound is found to contain $69.9\\%\\,\\text{Fe}$ and $30.1\\%\\,\\text{O}$ by mass. The empirical formula of the iron oxide is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2020',
    notes: 'Atomic masses: $\\text{Fe} = 55.85$, $\\text{O} = 16.0$.',
    correct_answer: 'C',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{FeO}$',
      B: '$\\text{Fe}_3\\text{O}_4$',
      C: '$\\text{Fe}_2\\text{O}_3$',
      D: '$\\text{Fe}_2\\text{O}$'
    },
    solution_text: 'Relative moles of Fe $= 69.9 / 55.85 = 1.25$. Relative moles of O $= 30.1 / 16.0 = 1.88$. Divide by the smaller number ($1.25$):\nFe: $1.25 / 1.25 = 1$\nO: $1.88 / 1.25 = 1.5$\nMultiply by 2 to get integers: Fe $= 2$, O $= 3$. Thus, the empirical formula is $\\text{Fe}_2\\text{O}_3$. Option C is correct.',
    common_mistake: 'Rounding $1.5$ down to $1$ or up to $2$, resulting in incorrect formulas like $\\text{FeO}$ or $\\text{Fe}_2\\text{O}_4$.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'A compound has empirical formula $\\text{CH}_2$ and a vapor density of $42$. The molecular formula of the compound is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Molecular weight $= 2 \\times \\text{vapor density}$. Find molecular formula multiplier $n = M_w / E_w$.',
    correct_answer: 'C',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{C}_3\\text{H}_8$',
      B: '$\\text{C}_4\\text{H}_8$',
      C: '$\\text{C}_6\\text{H}_{12}$',
      D: '$\\text{C}_5\\text{H}_{10}$'
    },
    solution_text: 'Molecular weight of compound $= 2 \\times \\text{Vapor Density} = 2 \\times 42 = 84\\,\\text{g/mol}$. Empirical formula weight of $\\text{CH}_2 = 12 + 2(1) = 14\\,\\text{g/mol}$. Multiplier $n = \\frac{84}{14} = 6$. Molecular formula $= 6 \\times \\text{CH}_2 = \\text{C}_6\\text{H}_{12}$. Option C is correct.',
    common_mistake: 'Forgetting that molecular weight is twice the vapor density, using $42$ directly as molecular weight to get $\\text{C}_3\\text{H}_6$.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'The chemical formula representing the simplest whole-number ratio of atoms is the ________ formula, whereas the actual formula is the ________ formula.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'empirical' }, { answer: 'molecular' }]),
    solution_text: 'By definition, the empirical formula of a compound represents the simplest whole-number ratio of the atoms present, whereas the molecular formula represents the actual number of atoms of each element in a single molecule of the compound.',
    common_mistake: 'Interchanging the order of the blanks.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'A compound contains $50\\%$ of element X (atomic mass $= 10\\,\\text{u}$) and $50\\%$ of element Y (atomic mass $= 20\\,\\text{u}$) by mass. The empirical formula of this compound is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Calculate moles of X and Y in $100\\,\\text{g}$ and find the simplest ratio.',
    correct_answer: 'A',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{X}_2\\text{Y}$',
      B: '$\\text{XY}_2$',
      C: '$\\text{XY}$',
      D: '$\\text{X}_2\\text{Y}_3$'
    },
    solution_text: 'Moles of X $= 50 / 10 = 5\\,\\text{mol}$. Moles of Y $= 50 / 20 = 2.5\\,\\text{mol}$. Ratio of X to Y $= 5 : 2.5 = 2 : 1$. Therefore, the empirical formula is $\\text{X}_2\\text{Y}$. Option A is correct.',
    common_mistake: 'Assuming equal mass percentages mean a $1:1$ atom ratio (XY).',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'An organic compound containing C, H, and O on combustion of $3.00\\,\\text{g}$ yields $4.40\\,\\text{g}$ of $\\text{CO}_2$ and $1.80\\,\\text{g}$ of $\\text{H}_2\\text{O}$. The mass percentage of oxygen in the organic compound is ________ $\\%$.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Find mass of C from $\\text{CO}_2$, mass of H from H$_2$O, and subtract from total mass to find mass of O.',
    correct_answer: '53',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Mass of Carbon in $4.40\\,\\text{g}$ of $\\text{CO}_2 = 4.40 \\times \\frac{12}{44} = 1.20\\,\\text{g}$.\nMass of Hydrogen in $1.80\\,\\text{g}$ of $\\text{H}_2\\text{O} = 1.80 \\times \\frac{2}{18} = 0.20\\,\\text{g}$.\nMass of Oxygen in the compound $=$ total mass $-$ (mass of C + mass of H) $= 3.00 - (1.20 + 0.20) = 1.60\\,\\text{g}$.\nPercentage of Oxygen $= \\frac{1.60}{3.00} \\times 100 \\approx 53.33\\%$. The nearest integer value is 53.',
    common_mistake: 'Assuming the oxygen in $\\text{CO}_2$ and $\\text{H}_2\\text{O}$ comes entirely from the compound. It actually comes from both the compound and the atmosphere/combustion stream, so you must find oxygen by difference.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'Insulin contains $3.4\\%$ sulphur by mass. The minimum molecular mass of insulin is ________ $\\text{g/mol}$. (Atomic mass of $\\text{S} = 32\\,\\text{u}$)',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Minimum molecular mass corresponds to having exactly one sulphur atom per molecule.',
    correct_answer: '941',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'For minimum molecular mass, there must be at least 1 sulphur atom in one molecule of insulin. Let the molecular mass be $M$. Weight percent of $\\text{S} = \\frac{32}{M} \\times 100 = 3.4 \\implies M = \\frac{3200}{3.4} \\approx 941.17\\,\\text{g/mol}$. Rounding to the nearest integer gives 941.',
    common_mistake: 'Using diatomic sulphur ($S_2$) instead of monoatomic sulphur for the atomic mass base.',
    concept_slugs: ['empirical-molecular-formula', 'mole-mass-number']
  },
  {
    title: 'A gaseous hydrocarbon on complete combustion gives $\\text{CO}_2$ and $\\text{H}_2\\text{O}$ in a volume ratio of $2:1$ under identical conditions of temperature and pressure. The empirical formula of the hydrocarbon is:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Volume ratio of gases $=$ mole ratio of gases. Write the combustion equation: $\\text{C}_x\\text{H}_y + (x + y/4)\\text{O}_2 \\rightarrow x\\text{CO}_2 + (y/2)\\text{H}_2\\text{O}$.',
    correct_answer: 'A',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{CH}$',
      B: '$\\text{CH}_2$',
      C: '$\\text{CH}_3$',
      D: '$\\text{C}_2\\text{H}_3$'
    },
    solution_text: 'Moles of $\\text{CO}_2 / \\text{moles of H}_2\\text{O} = x / (y/2) = 2/1 \\implies 2x/y = 2 \\implies x/y = 1 \\implies x:y = 1:1$. Thus, the empirical formula of the hydrocarbon is $\\text{CH}$. Option A is correct.',
    common_mistake: 'Failing to divide the hydrogen atoms by 2 when relating H$_2$O to H, leading to CH$_2$ or other incorrect formulas.',
    concept_slugs: ['empirical-molecular-formula']
  },
  {
    title: 'A non-stoichiometric oxide of iron is analyzed and found to have the formula $\\text{Fe}_{0.93}\\text{O}_{1.00}$. The percentage of iron present in the $\\text{Fe}^{3+}$ state in this oxide is ________ $\\%$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Let the fraction of $\\text{Fe}^{3+}$ be $x$ and $\\text{Fe}^{2+}$ be $0.93 - x$. Equate the total positive charge to the total negative charge of oxygen (-2).',
    correct_answer: '15',
    pattern_group: 'empirical-molecular-formula',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let the number of $\\text{Fe}^{3+}$ ions in the formula be $x$. The number of $\\text{Fe}^{2+}$ ions will be $0.93 - x$. Since the crystal is electrically neutral, the sum of positive charges must balance the negative charge of oxygen (-2):\n$3(x) + 2(0.93 - x) = 2$\n$3x + 1.86 - 2x = 2 \\implies x = 2 - 1.86 = 0.14$.\nThus, the fraction of iron as $\\text{Fe}^{3+}$ is $\\frac{0.14}{0.93} \\approx 0.1505$ or $15.05\\%$. The nearest integer value is 15.',
    common_mistake: 'Dividing the number of $\\text{Fe}^{3+}$ ions (0.14) by 1.00 instead of the total iron content (0.93), which yields an incorrect value of 14%.',
    concept_slugs: ['empirical-molecular-formula', 'mole-concept-advanced']
  },

  // ==========================================
  // PATTERN GROUP 3: STOICHIOMETRY & LIMITING REAGENT (12 Qs)
  // ==========================================
  {
    title: 'When $10\\,\\text{g}$ of hydrogen gas ($\\text{H}_2$) and $64\\,\\text{g}$ of oxygen gas ($\\text{O}_2$) are reacted in a steel vessel, the mass of water produced is ________ $\\text{g}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Write the balanced equation: $2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$. Identify the limiting reagent.',
    correct_answer: '72',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of H$_2 = 10 / 2 = 5\\,\\text{mol}$. Moles of O$_2 = 64 / 32 = 2\\,\\text{mol}$.\nReaction: $2\\text{H}_2 + \\text{O}_2 \\rightarrow 2\\text{H}_2\\text{O}$.\nStoichiometrically, $2\\,\\text{mol}$ of O$_2$ requires $2 \\times 2 = 4\\,\\text{mol}$ of H$_2$. We have $5\\,\\text{mol}$ of H$_2$, so H$_2$ is in excess and O$_2$ is the limiting reagent.\nMoles of H$_2$O formed $= 2 \\times \\text{moles of O}_2 = 2 \\times 2 = 4\\,\\text{mol}$.\nMass of water formed $= 4 \\times 18\\,\\text{g/mol} = 72\\,\\text{g}$.',
    common_mistake: 'Using the mass ratio directly (10:64) instead of converting to moles first to find the limiting reactant.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'What mass of calcium carbonate ($\\text{CaCO}_3$) of $90\\%$ purity is required to produce $5.6\\,\\text{L}$ of carbon dioxide gas at STP upon complete thermal decomposition? (Molar mass of $\\text{CaCO}_3 = 100\\,\\text{g/mol}$)',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2020',
    notes: 'Reaction: $\\text{CaCO}_3 \\rightarrow \\text{CaO} + \\text{CO}_2$. $1\\,\\text{mol}$ of $\\text{CO}_2$ is $22.7\\,\\text{L}$ at STP (or $22.4\\,\\text{L}$ depending on standard; let\'s assume standard $22.4\\,\\text{L}$ here for old syllabus context).',
    correct_answer: 'D',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$22.5\\,\\text{g}$',
      B: '$25.0\\,\\text{g}$',
      C: '$20.0\\,\\text{g}$',
      D: '$27.8\\,\\text{g}$'
    },
    solution_text: 'Reaction: $\\text{CaCO}_3 \\rightarrow \\text{CaO} + \\text{CO}_2$.\nMoles of $\\text{CO}_2$ required $= \\frac{5.6\\,\\text{L}}{22.4\\,\\text{L/mol}} = 0.25\\,\\text{mol}$.\nMoles of pure $\\text{CaCO}_3$ needed $= 0.25\\,\\text{mol}$.\nMass of pure $\\text{CaCO}_3 = 0.25 \\times 100 = 25\\,\\text{g}$.\nSince the sample is only $90\\%$ pure, the mass of impure sample required is:\n$\\text{Mass} = \\frac{25\\,\\text{g}}{0.90} \\approx 27.78\\,\\text{g}$. Thus, option D is correct.',
    common_mistake: 'Multiplying by $0.90$ (getting $22.5\\,\\text{g}$) instead of dividing by it to find the higher impure mass needed.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'For a reaction $2A + 4B \\rightarrow 3C + 5D$, if $5\\,\\text{moles}$ of $A$ react with $6\\,\\text{moles}$ of $B$, which of the following statement is correct?',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Compare the ratio of available moles to stoichiometric coefficients to find the limiting reagent.',
    correct_answer: 'B',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$A$ is the limiting reagent and $7.5\\,\\text{moles}$ of $C$ are formed.',
      B: '$B$ is the limiting reagent and $4.5\\,\\text{moles}$ of $C$ are formed.',
      C: '$A$ is the limiting reagent and $12.5\\,\\text{moles}$ of $D$ are formed.',
      D: '$B$ is the limiting reagent and $7.5\\,\\text{moles}$ of $D$ are formed.'
    },
    solution_text: 'For $A$: $\\text{moles}/\\text{coefficient} = 5/2 = 2.5$.\nFor $B$: $\\text{moles}/\\text{coefficient} = 6/4 = 1.5$.\nSince $1.5 < 2.5$, $B$ is the limiting reagent.\nMoles of $C$ formed $= \\frac{3}{4} \\times \\text{moles of B} = \\frac{3}{4} \\times 6 = 4.5\\,\\text{mol}$.\nMoles of $D$ formed $= \\frac{5}{4} \\times 6 = 7.5\\,\\text{mol}$.\nLooking at the options, option B is correct.',
    common_mistake: 'Assuming $A$ is limiting since it has fewer absolute moles (5 vs 6), without checking the reaction stoichiometry (coefficients 2 and 4).',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'The volume of oxygen gas required at STP to burn $1.5\\,\\text{g}$ of ethane ($\\text{C}_2\\text{H}_6$) completely is ________ $\\text{L}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Write the combustion equation: $2\\text{C}_2\\text{H}_6 + 7\\text{O}_2 \\rightarrow 4\\text{CO}_2 + 6\\text{H}_2\\text{O}$. $1.5\\,\\text{g}$ ethane is $0.05\\,\\text{mol}$.',
    correct_answer: '3.92',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of ethane $(\\text{C}_2\\text{H}_6) = \\frac{1.5\\,\\text{g}}{30\\,\\text{g/mol}} = 0.05\\,\\text{mol}$.\nCombustion reaction: $2\\text{C}_2\\text{H}_6 + 7\\text{O}_2 \\rightarrow 4\\text{CO}_2 + 6\\text{H}_2\\text{O}$.\nMoles of $\\text{O}_2$ required $= \\frac{7}{2} \\times 0.05 = 0.175\\,\\text{mol}$.\nVolume of $\\text{O}_2$ at STP $= 0.175\\,\\text{mol} \\times 22.4\\,\\text{L/mol} = 3.92\\,\\text{L}$.',
    common_mistake: 'Using the unbalanced combustion equation or incorrect molar mass for ethane.',
    concept_slugs: ['stoichiometry-limiting-reagent', 'gaseous-volume-ideal-gas']
  },
  {
    title: 'What mass of barium sulphate ($\\text{BaSO}_4$) is produced when $20\\,\\text{mL}$ of $0.50\\,\\text{M}\\,\\text{BaCl}_2$ is mixed with $30\\,\\text{mL}$ of $0.20\\,\\text{M}\\,\\text{Na}_2\\text{SO}_4$? (Molar mass of $\\text{BaSO}_4 = 233\\,\\text{g/mol}$)',
    difficulty: 'medium',
    type: 'concept',
    notes: 'Moles $=$ Molarity $\\times$ Volume in liters. Write precipitation reaction: $\\text{BaCl}_2 + \\text{Na}_2\\text{SO}_4 \\rightarrow \\text{BaSO}_4 + 2\\text{NaCl}$.',
    correct_answer: 'B',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$2.33\\,\\text{g}$',
      B: '$1.40\\,\\text{g}$',
      C: '$0.93\\,\\text{g}$',
      D: '$3.50\\,\\text{g}$'
    },
    solution_text: 'Moles of $\\text{BaCl}_2 = 0.50 \\times 0.020 = 0.010\\,\\text{mol}$.\nMoles of $\\text{Na}_2\\text{SO}_4 = 0.20 \\times 0.030 = 0.006\\,\\text{mol}$.\nPrecipitation: $\\text{BaCl}_2 + \\text{Na}_2\\text{SO}_4 \\rightarrow \\text{BaSO}_4 \\downarrow + 2\\text{NaCl}$.\nSince they react in a $1:1$ ratio, $\\text{Na}_2\\text{SO}_4$ is the limiting reagent (0.006 moles vs 0.010 moles).\nMoles of $\\text{BaSO}_4$ formed $= 0.006\\,\\text{mol}$.\nMass of $\\text{BaSO}_4 = 0.006 \\times 233 = 1.398\\,\\text{g} \\approx 1.40\\,\\text{g}$. Option B is correct.',
    common_mistake: 'Failing to identify the limiting reagent and using 0.010 moles of BaCl2 to calculate the product mass, giving 2.33 g (Option A).',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'The mass of carbon dioxide ($\\text{CO}_2$) produced when $3.0\\,\\text{moles}$ of carbon is burnt in $5.0\\,\\text{moles}$ of oxygen gas is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Reaction: $\\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2$. Identify limiting reagent and apply simple mole ratios.',
    correct_answer: 'C',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$220\\,\\text{g}$',
      B: '$176\\,\\text{g}$',
      C: '$132\\,\\text{g}$',
      D: '$44\\,\\text{g}$'
    },
    solution_text: 'Reaction: $\\text{C} (s) + \\text{O}_2 (g) \\rightarrow \\text{CO}_2 (g)$.\nStoichiometric ratio is $1:1$. Since we have $3.0\\,\\text{mol}$ of C and $5.0\\,\\text{mol}$ of O$_2$, carbon is the limiting reagent.\nMoles of $\\text{CO}_2$ formed $=$ moles of C $= 3.0\\,\\text{mol}$.\nMass of $\\text{CO}_2 = 3.0 \\times 44\\,\\text{g/mol} = 132\\,\\text{g}$. Option C is correct.',
    common_mistake: 'Basing the product on the excess reagent O$_2$ which would give $220\\,\\text{g}$ of carbon dioxide.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'How many moles of methane ($\\text{CH}_4$) are required to produce $22.0\\,\\text{g}$ of carbon dioxide ($\\text{CO}_2$) after complete combustion?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Combustion of methane: $\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}$. $1\\,\\text{mol}$ of $\\text{CH}_4$ yields $1\\,\\text{mol}$ of $\\text{CO}_2$.',
    correct_answer: 'A',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.5\\,\\text{mol}$',
      B: '$1.0\\,\\text{mol}$',
      C: '$2.0\\,\\text{mol}$',
      D: '$1.5\\,\\text{mol}$'
    },
    solution_text: 'Moles of $\\text{CO}_2$ to be produced $= \\frac{22.0\\,\\text{g}}{44\\,\\text{g/mol}} = 0.5\\,\\text{mol}$.\nAccording to the balanced equation $\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O}$, $1\\,\\text{mol}$ of $\\text{CH}_4$ produces $1\\,\\text{mol}$ of $\\text{CO}_2$. Thus, $0.5\\,\\text{mol}$ of $\\text{CH}_4$ is required. Option A is correct.',
    common_mistake: 'Failing to balance the combustion reaction or using incorrect stoichiometry.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'A mixture of $2.0\\,\\text{mol}$ of nitrogen gas ($\\text{N}_2$) and $5.0\\,\\text{mol}$ of hydrogen gas ($\\text{H}_2$) are reacted to form ammonia ($\\text{NH}_3$). The number of moles of ammonia formed and the moles of excess reagent left are respectively:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Reaction: $\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3$. Calculate limiting reagent first.',
    correct_answer: 'D',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$4.0\\,\\text{mol of NH}_3$ and $0.0\\,\\text{mol of H}_2$',
      B: '$3.33\\,\\text{mol of NH}_3$ and $0.33\\,\\text{mol of N}_2$',
      C: '$4.0\\,\\text{mol of NH}_3$ and $1.0\\,\\text{mol of N}_2$',
      D: '$3.33\\,\\text{mol of NH}_3$ and $0.33\\,\\text{mol of N}_2$'
    },
    solution_text: 'Reaction: $\\text{N}_2 + 3\\text{H}_2 \\rightarrow 2\\text{NH}_3$.\nRatio of available moles to coefficients:\n$\\text{N}_2: 2/1 = 2$\n$\\text{H}_2: 5/3 = 1.67$\nHydrogen is the limiting reagent.\nMoles of $\\text{NH}_3$ formed $= \\frac{2}{3} \\times \\text{moles of H}_2 = \\frac{2}{3} \\times 5 = 3.33\\,\\text{mol}$.\nMoles of $\\text{N}_2$ consumed $= \\frac{1}{3} \\times 5 = 1.67\\,\\text{mol}$.\nMoles of $\\text{N}_2$ left (excess) $= 2.0 - 1.67 = 0.33\\,\\text{mol}$.\nOption D is correct.',
    common_mistake: 'Assuming nitrogen is the limiting reagent because there are only 2 moles of it, forgetting that nitrogen reacts with three times as much hydrogen.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'An impure sample of magnesium carbonate ($\\text{MgCO}_3$) weighing $20.0\\,\\text{g}$ decomposes on heating to give carbon dioxide gas and $8.0\\,\\text{g}$ of magnesium oxide ($\\text{MgO}$). The percentage purity of the sample is ________ $\\%$. (Molar mass of $\\text{MgCO}_3 = 84\\,\\text{g/mol}$, $\\text{MgO} = 40\\,\\text{g/mol}$)',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Reaction: $\\text{MgCO}_3 \\rightarrow \\text{MgO} + \\text{CO}_2$. Use the mass of MgO to find the pure mass of MgCO3.',
    correct_answer: '84',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of MgO produced $= \\frac{8.0\\,\\text{g}}{40\\,\\text{g/mol}} = 0.20\\,\\text{mol}$.\nAccording to the decomposition reaction $\\text{MgCO}_3 \\rightarrow \\text{MgO} + \\text{CO}_2$, $1\\,\\text{mol}$ of $\\text{MgCO}_3$ yields $1\\,\\text{mol}$ of $\\text{MgO}$.\nTherefore, moles of pure $\\text{MgCO}_3$ decomposed $= 0.20\\,\\text{mol}$.\nMass of pure $\\text{MgCO}_3 = 0.20 \\times 84 = 16.8\\,\\text{g}$.\nPercentage purity of the sample $= \\frac{16.8}{20.0} \\times 100 = 84\\%$.',
    common_mistake: 'Using the mass of carbon dioxide (by subtraction) without checking if the impurities also release gas or not. It is always safer to calculate based on the non-volatile solid residue MgO.',
    concept_slugs: ['stoichiometry-limiting-reagent']
  },
  {
    title: 'What volume of $0.10\\,\\text{M}\\,\\text{HCl}$ is required to react completely with $1.0\\,\\text{g}$ of a mixture containing equimolar amounts of sodium carbonate ($\\text{Na}_2\\text{CO}_3$) and sodium bicarbonate ($\\text{NaHCO}_3$)?',
    difficulty: 'hard',
    type: 'practice',
    notes: 'Let moles of both be $x$. Total mass is $106x + 84x = 1.0\\,\\text{g}$. Calculate total moles of HCl required using standard reaction equations.',
    correct_answer: 'B',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$105\\,\\text{mL}$',
      B: '$158\\,\\text{mL}$',
      C: '$210\\,\\text{mL}$',
      D: '$79\\,\\text{mL}$'
    },
    solution_text: 'Let moles of $\\text{Na}_2\\text{CO}_3$ and $\\text{NaHCO}_3$ be $x$ each.\nMass of mixture: $106x + 84x = 1.0\\,\\text{g} \\implies 190x = 1.0 \\implies x = 1/190 \\approx 0.00526\\,\\text{mol}$.\nReactions:\n$\\text{Na}_2\\text{CO}_3 + 2\\text{HCl} \\rightarrow 2\\text{NaCl} + \\text{CO}_2 + \\text{H}_2\\text{O}$\n$\\text{NaHCO}_3 + \\text{HCl} \\rightarrow \\text{NaCl} + \\text{CO}_2 + \\text{H}_2\\text{O}$\nMoles of HCl needed $= 2x + x = 3x = 3 \\times (1/190) = 3/190\\,\\text{mol} \\approx 0.01579\\,\\text{mol}$.\nVolume of $0.10\\,\\text{M}$ HCl required $= \\frac{0.01579\\,\\text{mol}}{0.10\\,\\text{M}} = 0.1579\\,\\text{L} \\approx 158\\,\\text{mL}$. Option B is correct.',
    common_mistake: 'Assuming that $\\text{Na}_2\\text{CO}_3$ and $\\text{NaHCO}_3$ both require the same amount of HCl (1 mole of HCl per mole of salt). In reality, sodium carbonate requires 2 moles of HCl.',
    concept_slugs: ['stoichiometry-limiting-reagent', 'concentration-terms']
  },
  {
    title: 'When $100\\,\\text{mL}$ of a mixture of carbon monoxide ($\\text{CO}$) and carbon dioxide ($\\text{CO}_2$) is passed over red hot charcoal, the volume becomes $160\\,\\text{mL}$ (all volumes measured under identical temperature and pressure). The volume of $\\text{CO}$ in the original mixture was ________ $\\text{mL}$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Only $\\text{CO}_2$ reacts with charcoal: $\\text{CO}_2(g) + \\text{C}(s) \\rightarrow 2\\text{CO}(g)$. CO does not react.',
    correct_answer: '40',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let the volume of $\\text{CO}_2$ in the original mixture be $v\\,\\text{mL}$. The volume of $\\text{CO}$ is $100 - v\\,\\text{mL}$.\nOnly $\\text{CO}_2$ reacts with red hot charcoal:\n$\\text{CO}_2 (g) + \\text{C} (s) \\rightarrow 2\\text{CO} (g)$.\nFrom $v\\,\\text{mL}$ of $\\text{CO}_2$, we get $2v\\,\\text{mL}$ of $\\text{CO}$ gas.\nThe unreacted volume of CO is $100 - v\\,\\text{mL}$.\nTotal final volume $= 2v + (100 - v) = 160\\,\\text{mL} \\implies 100 + v = 160 \\implies v = 60\\,\\text{mL}$.\nThus, the volume of $\\text{CO}_2$ is $60\\,\\text{mL}$, and the volume of $\\text{CO}$ in the original mixture was $100 - 60 = 40\\,\\text{mL}$.',
    common_mistake: 'Assuming the volume contraction happens, whereas the reaction actually results in a volume expansion (since 1 mole of gas yields 2 moles of gas).',
    concept_slugs: ['stoichiometry-limiting-reagent', 'gaseous-volume-ideal-gas']
  },
  {
    title: 'A $10.0\\,\\text{g}$ sample of a mixture of calcium chloride ($\\text{CaCl}_2$) and sodium chloride ($\\text{NaCl}$) is treated with excess sodium carbonate solution to precipitate all calcium as calcium carbonate ($\\text{CaCO}_3$). The precipitate is filtered, dried and strongly heated, yielding $1.68\\,\\text{g}$ of calcium oxide ($\\text{CaO}$). The percentage of sodium chloride in the original mixture is ________ $\\%$. (Atomic mass of $\\text{Ca} = 40$, $\\text{Cl} = 35.5$, $\\text{Na} = 23$)',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Reactions: $\\text{CaCl}_2 + \\text{Na}_2\\text{CO}_3 \\rightarrow \\text{CaCO}_3 + 2\\text{NaCl}$ and $\\text{CaCO}_3 \\rightarrow \\text{CaO} + \\text{CO}_2$. Total calcium moles are preserved from $\\text{CaCl}_2$ to $\\text{CaO}$.',
    correct_answer: '67',
    pattern_group: 'stoichiometry-limiting-reagent',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of CaO obtained $= \\frac{1.68\\,\\text{g}}{56\\,\\text{g/mol}} = 0.03\\,\\text{mol}$.\nSince all calcium is conserved, moles of $\\text{CaCl}_2$ in the original mixture must be $0.03\\,\\text{mol}$.\nMass of $\\text{CaCl}_2 = 0.03 \\times (40 + 2 \\times 35.5) = 0.03 \\times 111 = 3.33\\,\\text{g}$.\nMass of NaCl in the mixture $=$ total mass $-$ mass of $\\text{CaCl}_2 = 10.0 - 3.33 = 6.67\\,\\text{g}$.\nPercentage of NaCl $= \\frac{6.67}{10.0} \\times 100 = 66.7\\% \\approx 67\\%$.',
    common_mistake: 'Using the mass of $\\text{CaCO}_3$ instead of $\\text{CaO}$, or neglecting the stoichiometry of calcium conservation.',
    concept_slugs: ['stoichiometry-limiting-reagent', 'mole-concept-advanced']
  },

  // ==========================================
  // PATTERN GROUP 4: CONCENTRATION TERMS (10 Qs)
  // ==========================================
  {
    title: 'The molarity of a $20.0\\%\\,\\text{(w/w)}$ aqueous solution of potassium hydroxide ($\\text{KOH}$) with density $1.20\\,\\text{g/mL}$ is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Molarity $= \\frac{\\%\\,\\text{w/w} \\times d \\times 10}{M_w}$. Molar mass of $\\text{KOH} = 56\\,\\text{g/mol}$.',
    correct_answer: 'B',
    pattern_group: 'concentration-terms',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$3.57\\,\\text{M}$',
      B: '$4.29\\,\\text{M}$',
      C: '$2.00\\,\\text{M}$',
      D: '$5.14\\,\\text{M}$'
    },
    solution_text: 'Let mass of solution $= 100\\,\\text{g}$. Mass of KOH $= 20\\,\\text{g}$.\nVolume of solution $= \\frac{\\text{Mass}}{\\text{Density}} = \\frac{100\\,\\text{g}}{1.20\\,\\text{g/mL}} = 83.33\\,\\text{mL} = 0.08333\\,\\text{L}$.\nMoles of KOH $= \\frac{20}{56} = 0.3571\\,\\text{mol}$.\nMolarity $= \\frac{0.3571}{0.08333} \\approx 4.29\\,\\text{M}$.\nAlternatively, use the shortcut: $M = \\frac{x \\times d \\times 10}{M_w} = \\frac{20 \\times 1.20 \\times 10}{56} = 4.29\\,\\text{M}$. Option B is correct.',
    common_mistake: 'Using weight/volume percentage formula directly without dividing by density, or using density as a multiplier instead of divisor for solution mass.',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'The mole fraction of a non-volatile solute in its $1.00\\,\\text{molal}$ aqueous solution is ________ $\\times 10^{-3}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'A $1.00\\,\\text{molal}$ solution contains $1.00\\,\\text{mole}$ of solute in $1000\\,\\text{g}$ of water. Moles of water $= 1000/18$.',
    correct_answer: '18',
    pattern_group: 'concentration-terms',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'A $1\\,\\text{m}$ solution contains $1\\,\\text{mol}$ of solute in $1000\\,\\text{g}$ of solvent (water).\nMoles of water $= 1000 / 18 = 55.56\\,\\text{mol}$.\nMole fraction of solute $\\chi_{\\text{solute}} = \\frac{1}{1 + 55.56} = \\frac{1}{56.56} \\approx 0.0177 = 17.7 \\times 10^{-3}$.\nRounding to the nearest integer, the answer is 18.',
    common_mistake: 'Assuming the total number of moles is $1 + 1000$ instead of $1 + 55.56$, or using a different solvent molar mass.',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'What is the molality of a $3.00\\,\\text{M}$ aqueous solution of $\\text{NaOH}$ if the density of the solution is $1.11\\,\\text{g/mL}$?',
    difficulty: 'hard',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Find mass of $1\\,\\text{L}$ solution, subtract mass of $3\\,\\text{mol}$ of $\\text{NaOH}$ to find mass of solvent, and calculate molality.',
    correct_answer: 'A',
    pattern_group: 'concentration-terms',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$3.03\\,\\text{m}$',
      B: '$2.70\\,\\text{m}$',
      C: '$3.33\\,\\text{m}$',
      D: '$3.00\\,\\text{m}$'
    },
    solution_text: 'Consider $1\\,\\text{L}$ of solution.\nMoles of NaOH $= 3.0\\,\\text{mol}$. Mass of NaOH $= 3.0 \\times 40 = 120\\,\\text{g}$.\nMass of $1\\,\\text{L}$ of solution $= 1000\\,\\text{mL} \\times 1.11\\,\\text{g/mL} = 1110\\,\\text{g}$.\nMass of solvent (water) $= 1110 - 120 = 990\\,\\text{g} = 0.99\\,\\text{kg}$.\nMolality $m = \\frac{\\text{moles of solute}}{\\text{mass of solvent in kg}} = \\frac{3.0}{0.99} \\approx 3.03\\,\\text{m}$. Option A is correct.',
    common_mistake: 'Using the total mass of the solution ($1110\\,\\text{g}$) as the solvent mass in the denominator, yielding $2.70\\,\\text{m}$ (Option B).',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'How much water (in $\\text{mL}$) must be added to $200\\,\\text{mL}$ of $0.50\\,\\text{M}\\,\\text{HCl}$ to dilute it to a concentration of $0.20\\,\\text{M}$?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Use the dilution formula: $M_1V_1 = M_2V_2$. Volume added is $V_2 - V_1$.',
    correct_answer: '300',
    pattern_group: 'concentration-terms',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Using $M_1 V_1 = M_2 V_2$:\n$0.50\\,\\text{M} \\times 200\\,\\text{mL} = 0.20\\,\\text{M} \\times V_2$\n$V_2 = \\frac{0.50 \\times 200}{0.20} = 500\\,\\text{mL}$.\nVolume of water to be added $= V_2 - V_1 = 500\\,\\text{mL} - 200\\,\\text{mL} = 300\\,\\text{mL}$.',
    common_mistake: 'Giving the final total volume ($500\\,\\text{mL}$) instead of the volume of water *added* ($300\\,\\text{mL}$).',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'An aqueous solution of urea contains $10.0\\%$ solute by mass. The mole fraction of urea in this solution is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Let the mass of the solution be $100\\,\\text{g}$. Molar mass of urea is $60\\,\\text{g/mol}$.',
    correct_answer: 'B',
    pattern_group: 'concentration-terms',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.030$',
      B: '$0.032$',
      C: '$0.035$',
      D: '$0.100$'
    },
    solution_text: 'In $100\\,\\text{g}$ solution:\nMass of urea $= 10\\,\\text{g} \\implies$ moles of urea $= 10/60 = 0.167\\,\\text{mol}$.\nMass of water $= 90\\,\\text{g} \\implies$ moles of water $= 90/18 = 5.0\\,\\text{mol}$.\nMole fraction of urea $\\chi_{\\text{urea}} = \\frac{0.167}{0.167 + 5.0} = \\frac{0.167}{5.167} \\approx 0.0323$. Option B is correct.',
    common_mistake: 'Confusing mass fraction ($10/100 = 0.1$) with mole fraction.',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'The mass of anhydrous sodium carbonate ($\\text{Na}_2\\text{CO}_3$) required to prepare $250\\,\\text{mL}$ of a $0.100\\,\\text{M}$ solution is ________ $\\text{g}$.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Moles $=$ Molarity $\\times$ Volume in liters. Molar mass of $\\text{Na}_2\\text{CO}_3 = 106\\,\\text{g/mol}$.',
    correct_answer: '2.65',
    pattern_group: 'concentration-terms',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles required $= 0.100\\,\\text{mol/L} \\times 0.250\\,\\text{L} = 0.025\\,\\text{mol}$.\nMass required $= 0.025\\,\\text{mol} \\times 106\\,\\text{g/mol} = 2.65\\,\\text{g}$.',
    common_mistake: 'Using the mass of sodium bicarbonate (NaHCO3, MW = 84) instead of sodium carbonate (MW = 106).',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'What is the molarity of chloride ions ($\\text{Cl}^-$) in a solution prepared by mixing $100\\,\\text{mL}$ of $0.10\\,\\text{M}\\,\\text{NaCl}$ and $100\\,\\text{mL}$ of $0.20\\,\\text{M}\\,\\text{MgCl}_2$?',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Find total moles of chloride ions from both salts and divide by total final volume ($200\\,\\text{mL}$). Note that $\\text{MgCl}_2$ yields 2 chloride ions per formula unit.',
    correct_answer: 'C',
    pattern_group: 'concentration-terms',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.15\\,\\text{M}$',
      B: '$0.30\\,\\text{M}$',
      C: '$0.25\\,\\text{M}$',
      D: '$0.20\\,\\text{M}$'
    },
    solution_text: 'Moles of $\\text{Cl}^-$ from NaCl $= 0.10\\,\\text{M} \\times 0.100\\,\\text{L} = 0.010\\,\\text{mol}$.\nMoles of $\\text{Cl}^-$ from $\\text{MgCl}_2 = 2 \\times (0.20\\,\\text{M} \\times 0.100\\,\\text{L}) = 0.040\\,\\text{mol}$.\nTotal moles of $\\text{Cl}^- = 0.010 + 0.040 = 0.050\\,\\text{mol}$.\nTotal volume $= 100\\,\\text{mL} + 100\\,\\text{mL} = 200\\,\\text{mL} = 0.200\\,\\text{L}$.\nMolarity of $\\text{Cl}^- = \\frac{0.050\\,\\text{mol}}{0.200\\,\\text{L}} = 0.25\\,\\text{M}$. Option C is correct.',
    common_mistake: 'Forgetting to multiply the moles of $\\text{MgCl}_2$ by 2 for the chloride ion count, yielding $0.15\\,\\text{M}$ (Option A).',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'The mole fraction of ethanol ($\\text{C}_2\\text{H}_5\\text{OH}$) in a water-ethanol mixture is $0.25$. The percentage by mass of ethanol in the mixture is ________ $\\%$.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Assume total moles is 1, with $0.25$ moles of ethanol and $0.75$ moles of water. Find masses of both and calculate mass percent.',
    correct_answer: '46',
    pattern_group: 'concentration-terms',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let total moles in the mixture $= 1\\,\\text{mol}$.\nMoles of ethanol $= 0.25\\,\\text{mol} \\implies$ mass $= 0.25 \\times 46 = 11.5\\,\\text{g}$.\nMoles of water $= 0.75\\,\\text{mol} \\implies$ mass $= 0.75 \\times 18 = 13.5\\,\\text{g}$.\nTotal mass of mixture $= 11.5 + 13.5 = 25.0\\,\\text{g}$.\nPercentage of ethanol by mass $= \\frac{11.5}{25.0} \\times 100 = 46.0\\%$.',
    common_mistake: 'Assuming the denominator is just the mass of water, calculating the ratio incorrectly.',
    concept_slugs: ['concentration-terms']
  },
  {
    title: 'A concentrated aqueous solution of sulfuric acid is $98.0\\%\\,\\text{H}_2\\text{SO}_4$ by mass and has a density of $1.84\\,\\text{g/mL}$. The volume of this concentrated acid required to make $5.0\\,\\text{L}$ of $0.50\\,\\text{M}\\,\\text{H}_2\\text{SO}_4$ solution is ________ $\\text{mL}$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Find the molarity of the concentrated acid first using the shortcut $M = \\frac{\\% \\times d \\times 10}{M_w}$, then use $M_1V_1 = M_2V_2$.',
    correct_answer: '136',
    pattern_group: 'concentration-terms',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Molarity of concentrated sulfuric acid $M_1 = \\frac{\\% \\times d \\times 10}{M_w} = \\frac{98.0 \\times 1.84 \\times 10}{98.0} = 18.4\\,\\text{M}$.\nUsing dilution equation $M_1 V_1 = M_2 V_2$:\n$18.4\\,\\text{M} \\times V_1 = 0.50\\,\\text{M} \\times 5000\\,\\text{mL}$\n$V_1 = \\frac{2500}{18.4} \\approx 135.87\\,\\text{mL}$.\nRounding to the nearest integer, the volume required is 136 mL.',
    common_mistake: 'Using incorrect density value or mismatching units between liters and milliliters.',
    concept_slugs: ['concentration-terms', 'mole-concept-advanced']
  },
  {
    title: 'If the density of a $3.00\\,\\text{M}$ aqueous solution of sodium thiosulfate ($\\text{Na}_2\\text{S}_2\\text{O}_3$) is $1.25\\,\\text{g/mL}$, the mole fraction of sodium thiosulfate in the solution is:',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Molar mass of $\\text{Na}_2\\text{S}_2\\text{O}_3 = 158\\,\\text{g/mol}$. Work with $1\\,\\text{L}$ of solution.',
    correct_answer: 'A',
    pattern_group: 'concentration-terms',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.065$',
      B: '$0.050$',
      C: '$0.078$',
      D: '$0.045$'
    },
    solution_text: 'Consider $1\\,\\text{L}$ of solution:\nMoles of $\\text{Na}_2\\text{S}_2\\text{O}_3 = 3.00\\,\\text{mol}$.\nMass of solute $= 3.00 \\times 158 = 474\\,\\text{g}$.\nMass of $1\\,\\text{L} solution = 1000\\,\\text{mL} \\times 1.25\\,\\text{g/mL} = 1250\\,\\text{g}$.\nMass of solvent (water) $= 1250 - 474 = 776\\,\\text{g}$.\nMoles of solvent (water) $= 776 / 18 = 43.11\\,\\text{mol}$.\nMole fraction of sodium thiosulfate $\\chi = \\frac{3.00}{3.00 + 43.11} = \\frac{3.00}{46.11} \\approx 0.065$. Option A is correct.',
    common_mistake: 'Using incorrect molar mass for sodium thiosulfate (forgetting that sodium is 23, sulphur is 32, and oxygen is 16).',
    concept_slugs: ['concentration-terms']
  },

  // ==========================================
  // PATTERN GROUP 5: EQUIVALENT WEIGHT & NORMALITY (10 Qs)
  // ==========================================
  {
    title: 'In the neutralization reaction of phosphoric acid ($\\text{H}_3\\text{PO}_4$) with sodium hydroxide ($\\text{NaOH}$) to form disodium hydrogen phosphate ($\\text{Na}_2\\text{HPO}_4$), the equivalent weight of $\\text{H}_3\\text{PO}_4$ is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'The n-factor is the number of replaceable H+ ions actually replaced in the reaction. Here, 2 hydrogens are replaced.',
    correct_answer: 'B',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$M$',
      B: '$M/2$',
      C: '$M/3$',
      D: '$2M$'
    },
    solution_text: 'The reaction is: $\\text{H}_3\\text{PO}_4 + 2\\text{NaOH} \\rightarrow \\text{Na}_2\\text{HPO}_4 + 2\\text{H}_2\\text{O}$.\nHere, disodium hydrogen phosphate is formed, meaning 2 acidic hydrogens of $\\text{H}_3\\text{PO}_4$ have been replaced by sodium ions.\nTherefore, the n-factor of $\\text{H}_3\\text{PO}_4$ in this reaction is $2$.\nEquivalent weight $= \\frac{\\text{Molecular weight (M)}}{\\text{n-factor}} = M/2$.\nOption B is correct.',
    common_mistake: 'Assuming the n-factor of $\\text{H}_3\\text{PO}_4$ is always 3 (since it is a triprotic acid) and choosing $M/3$. The actual n-factor depends on the reaction product.',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'The normality of a solution obtained by mixing $100\\,\\text{mL}$ of $0.20\\,\\text{N}\\,\\text{HCl}$ and $200\\,\\text{mL}$ of $0.30\\,\\text{N}\\,\\text{H}_2\\text{SO}_4$ is ________ $\\text{N}$.',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Use the mixing formula: $N_fV_f = N_1V_1 + N_2V_2$. Normality terms are directly additive for acids.',
    correct_answer: '0.27',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'For mixing solutions of same chemical nature (both are acids):\n$N_f V_f = N_1 V_1 + N_2 V_2$\nHere, $V_f = 100\\,\\text{mL} + 200\\,\\text{mL} = 300\\,\\text{mL}$.\n$N_f \\times 300 = (0.20 \\times 100) + (0.30 \\times 200)$\n$N_f \\times 300 = 20 + 60 = 80$\n$N_f = 80 / 300 \\approx 0.2667\\,\\text{N} \\approx 0.27\\,\\text{N}$.',
    common_mistake: 'Multiplying the normality of $\\text{H}_2\\text{SO}_4$ by 2. Normality already accounts for the n-factor of the acid, unlike molarity.',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'In acidic medium, the n-factor of potassium permanganate ($\\text{KMnO}_4$) is ________, whereas in a strongly basic medium it is ________.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '5' }, { answer: '1' }]),
    solution_text: 'In acidic medium: $\\text{MnO}_4^- + 8\\text{H}^+ + 5e^- \\rightarrow  \\text{Mn}^{2+} + 4\\text{H}_2\\text{O}$ (change in oxidation state of Mn is from +7 to +2, so n-factor $= 5$).\nIn strongly basic medium: $\\text{MnO}_4^- + e^- \\rightarrow  \\text{MnO}_4^{2-}$ (change in oxidation state of Mn is from +7 to +6, so n-factor $= 1$).',
    common_mistake: 'Confusing strongly basic medium with weakly basic/neutral medium (where the n-factor is 3 to form $\\text{MnO}_2$).',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'What is the n-factor of iron pyrite ($\\text{FeS}_2$) when it is roasted in oxygen to form iron(III) oxide ($\\text{Fe}_2\\text{O}_3$) and sulfur dioxide ($\\text{SO}_2$)?',
    difficulty: 'hard',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Find the oxidation states of Fe and S in reactants and products. Both Fe and S are oxidized.',
    correct_answer: 'D',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$1$',
      B: '$7$',
      C: '$9$',
      D: '$11$'
    },
    solution_text: 'In $\\text{FeS}_2$ (iron pyrite), iron is in the +2 state and sulphur is in the -1 state (disulphide ion $\\text{S}_2^{2-}$).\nDuring roasting, they form $\\text{Fe}_2\\text{O}_3$ and $\\text{SO}_2$:\n1. $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$ (oxidation state changes from +2 to +3, change $= 1$).\n2. $2\\text{S}^{-1} \\rightarrow 2\\text{S}^{4+} + 10e^-$ (each sulphur changes from -1 to +4, change $= 5 \\times 2 = 10$).\nTotal electrons lost per formula unit of $\\text{FeS}_2 = 1 + 10 = 11$.\nTherefore, the n-factor of $\\text{FeS}_2$ is $11$. Option D is correct.',
    common_mistake: 'Only calculating the oxidation state change for sulphur or iron, neglecting the fact that both elements in the compound undergo oxidation simultaneously.',
    concept_slugs: ['equivalent-weight-normality', 'mole-concept-advanced']
  },
  {
    title: 'The equivalent weight of potassium dichromate ($\\text{K}_2\\text{Cr}_2\\text{O}_7$) in acidic medium (molar mass $= M$) is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Acidic reduction: $\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6e^- \\rightarrow 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}$.',
    correct_answer: 'C',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$M/2$',
      B: '$M/3$',
      C: '$M/6$',
      D: '$M/12$'
    },
    solution_text: 'In acidic medium, the reduction half-reaction for dichromate is:\n$\\text{Cr}_2\\text{O}_7^{2-} + 14\\text{H}^+ + 6e^- \\rightarrow 2\\text{Cr}^{3+} + 7\\text{H}_2\\text{O}$.\nThe oxidation state of Chromium changes from +6 to +3. Since there are 2 Chromium atoms per formula unit of $\\text{K}_2\\text{Cr}_2\\text{O}_7$, the total change in oxidation state (n-factor) $= 2 \\times (6 - 3) = 6$.\nEquivalent Weight $= M/6$. Option C is correct.',
    common_mistake: 'Using the change for a single Chromium atom (3) as the n-factor, resulting in $M/3$.',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'A divalent metal has an equivalent mass of $12.0\\,\\text{g/eq}$. The molar mass of its oxide is ________ $\\text{g/mol}$.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Equivalent mass of oxide $=$ equivalent mass of metal $+$ equivalent mass of oxygen (which is 8). Molar mass $=$ Equivalent mass $\\times$ valency.',
    correct_answer: '40',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Equivalent mass of metal oxide $E_{\\text{oxide}} = E_{\\text{metal}} + E_{\\text{oxygen}} = 12.0 + 8.0 = 20.0\\,\\text{g/eq}$.\nSince the metal is divalent, the valency (n-factor) of the oxide is 2.\nMolar mass of the oxide $= E_{\\text{oxide}} \\times \\text{valency} = 20.0 \\times 2 = 40.0\\,\\text{g/mol}$.',
    common_mistake: 'Forgetting to multiply the equivalent mass of the oxide by the valency of 2 to convert to molar mass, giving 20 instead.',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: '$0.50\\,\\text{g}$ of a metal on combustion in excess oxygen gave $0.80\\,\\text{g}$ of its oxide. The equivalent weight of the metal is ________ $\\text{g/eq}$.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Apply law of equivalence: equivalents of metal $=$ equivalents of oxygen reacted.',
    correct_answer: '13.3',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Mass of metal $= 0.50\\,\\text{g}$. Mass of metal oxide $= 0.80\\,\\text{g}$.\nMass of oxygen reacted $= 0.80 - 0.50 = 0.30\\,\\text{g}$.\nBy Law of Equivalence:\n$\\frac{\\text{Mass of metal}}{E_{\\text{metal}}} = \\frac{\\text{Mass of oxygen}}{E_{\\text{oxygen}}}$\nWe know the equivalent weight of oxygen ($E_{\\text{oxygen}}$) is $8.0\\,\\text{g/eq}$.\n$\\frac{0.50}{E_{\\text{metal}}} = \\frac{0.30}{8.0} \\implies E_{\\text{metal}} = \\frac{0.50 \\times 8.0}{0.30} = 13.33\\,\\text{g/eq}$.',
    common_mistake: 'Using the atomic weight of oxygen (16) instead of the equivalent weight of oxygen (8) in the equation.',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'Calculate the normality of a solution of sodium carbonate ($\\text{Na}_2\\text{CO}_3$) prepared by dissolving $5.30\\,\\text{g}$ of the solute in enough water to make $500\\,\\text{mL}$ of solution.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Normality $=$ Molarity $\\times$ n-factor. For $\\text{Na}_2\\text{CO}_3$, the n-factor is 2 (total positive charge of sodium ions).',
    correct_answer: 'A',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.20\\,\\text{N}$',
      B: '$0.10\\,\\text{N}$',
      C: '$0.40\\,\\text{N}$',
      D: '$0.05\\,\\text{N}$'
    },
    solution_text: 'Molar mass of $\\text{Na}_2\\text{CO}_3 = 106\\,\\text{g/mol}$.\nMoles of $\\text{Na}_2\\text{CO}_3 = \\frac{5.30}{106} = 0.05\\,\\text{mol}$.\nMolarity $= \\frac{0.05\\,\\text{mol}}{0.500\\,\\text{L}} = 0.10\\,\\text{M}$.\nSince sodium carbonate is a salt with $2\\,\\text{Na}^+$ ions, its n-factor is 2.\nNormality $=$ Molarity $\\times$ n-factor $= 0.10 \\times 2 = 0.20\\,\\text{N}$. Option A is correct.',
    common_mistake: 'Confusing normality with molarity and reporting $0.10\\,\\text{N}$ (Option B).',
    concept_slugs: ['equivalent-weight-normality', 'concentration-terms']
  },
  {
    title: 'The n-factor of oxalic acid ($\\text{H}_2\\text{C}_2\\text{O}_4$) in its redox reaction with potassium permanganate ($\\text{KMnO}_4$) in acidic medium is:',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Oxalic acid is oxidized to carbon dioxide: $\\text{H}_2\\text{C}_2\\text{O}_4 \\rightarrow 2\\text{CO}_2 + 2\\text{H}^+ + 2e^-$.',
    correct_answer: 'A',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$2$',
      B: '$1$',
      C: '$10$',
      D: '$5$'
    },
    solution_text: 'In the redox reaction, oxalic acid is oxidized to carbon dioxide:\n$\\text{H}_2\\text{C}_2\\text{O}_4 \\rightarrow 2\\text{CO}_2 + 2\\text{H}^+ + 2e^-$.\nThe oxidation state of Carbon changes from +3 in $\\text{H}_2\\text{C}_2\\text{O}_4$ to +4 in $\\text{CO}_2$.\nSince each oxalic acid molecule contains 2 Carbon atoms, the total change in oxidation state (electrons lost per molecule) $= 2 \\times (4 - 3) = 2$.\nTherefore, the n-factor is 2. Option A is correct.',
    common_mistake: 'Thinking the n-factor in a redox reaction is based on acidic hydrogens only, which is coincidentally 2 here, but incorrect in principle if it was sodium oxalate (which also has redox n-factor 2 but acid-base n-factor 0).',
    concept_slugs: ['equivalent-weight-normality']
  },
  {
    title: 'In an acidic medium, $1.00\\,\\text{mole}$ of $\\text{K}_2\\text{Cr}_2\\text{O}_7$ is reduced to $\\text{Cr}^{3+}$. The volume of $0.100\\,\\text{M}\\,\\text{FeSO}_4$ solution that can be completely oxidized by $20.0\\,\\text{mL}$ of $0.100\\,\\text{M}\\,\\text{K}_2\\text{Cr}_2\\text{O}_7$ is ________Items $\\text{mL}$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Apply law of equivalence: equivalents of $\\text{K}_2\\text{Cr}_2\\text{O}_7$ = equivalents of $\\text{FeSO}_4$. Redox n-factor of $\\text{K}_2\\text{Cr}_2\\text{O}_7 = 6$, redox n-factor of $\\text{FeSO}_4 = 1$.',
    correct_answer: '120',
    pattern_group: 'equivalent-weight-normality',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'By Law of Equivalence:\n$\\text{Equivalents of } K_2Cr_2O_7 = \\text{Equivalents of } FeSO_4$\n$N_1 V_1 = N_2 V_2$\nSince Normality $=$ Molarity $\\times$ n-factor:\n$(M_1 \\times n_1) \\times V_1 = (M_2 \\times n_2) \\times V_2$\nFor $K_2Cr_2O_7$, $n_1 = 6$ (Cr changing from +6 to +3, 2 atoms).\nFor $FeSO_4$, $n_2 = 1$ (Fe changing from +2 to +3).\n$(0.100 \\times 6) \\times 20.0\\,\\text{mL} = (0.100 \\times 1) \\times V_2$\n$6 \\times 20.0 = V_2 \\implies V_2 = 120.0\\,\\text{mL}$.',
    common_mistake: 'Failing to multiply by the n-factor of dichromate (6), yielding an incorrect volume of 20 mL.',
    concept_slugs: ['equivalent-weight-normality', 'mole-concept-advanced']
  },

  // ==========================================
  // PATTERN GROUP 6: GASEOUS VOLUME & IDEAL GAS (8 Qs)
  // ==========================================
  {
    title: 'The density of sulfur dioxide ($\\text{SO}_2$) gas at STP is approximately ________ $\\text{g/L}$. (Assume STP molar volume $= 22.4\\,\\text{L/mol}$)',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Density $=$ Molar mass / Molar volume at STP. Molar mass of $\\text{SO}_2 = 64\\,\\text{g/mol}$.',
    correct_answer: '2.86',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Density of a gas at STP $= \\frac{\\text{Molar mass}}{\\text{Molar volume at STP}}$.\nMolar mass of $\\text{SO}_2 = 32 + 2(16) = 64\\,\\text{g/mol}$.\nMolar volume at STP $= 22.4\\,\\text{L/mol}$.\nDensity $= \\frac{64\\,\\text{g/mol}}{22.4\\,\\text{L/mol}} \\approx 2.857\\,\\text{g/L}$. Thus, to two decimal places, the answer is 2.86.',
    common_mistake: 'Using density of air or water as reference, or using the incorrect atomic mass of sulfur.',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'A mixture of hydrogen ($\\text{H}_2$) and oxygen ($\\text{O}_2$) gases in a $2:1$ molar ratio is filled in a vessel. If the total pressure of the mixture is $1.50\\,\\text{atm}$, the partial pressure of hydrogen gas is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Apply Dalton\'s Law of partial pressures: $P_i = \\chi_i \\times P_{\\text{total}}$.',
    correct_answer: 'B',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.50\\,\\text{atm}$',
      B: '$1.00\\,\\text{atm}$',
      C: '$0.75\\,\\text{atm}$',
      D: '$1.25\\,\\text{atm}$'
    },
    solution_text: 'The molar ratio of H$_2$ to O$_2$ is $2:1$.\nMole fraction of H$_2$ ($\\chi_{\\text{H}_2}$) $= \\frac{2}{2+1} = 2/3$.\nBy Dalton\'s Law, partial pressure of H$_2$ is:\n$P_{\\text{H}_2} = \\chi_{\\text{H}_2} \\times P_{\\text{total}} = \\frac{2}{3} \\times 1.50\\,\\text{atm} = 1.00\\,\\text{atm}$. Option B is correct.',
    common_mistake: 'Confusing mass ratio with molar ratio, which would change the mole fraction calculation significantly.',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'A cylinder contains $320\\,\\text{g}$ of oxygen gas ($\\text{O}_2$) at $10.0\\,\\text{atm}$ pressure and $27^\\circ\\text{C}$. What volume does this cylinder occupy? (Use gas constant $R = 0.0821\\,\\text{L\\cdot atm\\cdot K}^{-1}\\text{mol}^{-1}$)',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Apply the ideal gas equation: $PV = nRT$. Convert temperature to Kelvin.',
    correct_answer: 'A',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$24.6\\,\\text{L}$',
      B: '$246\\,\\text{L}$',
      C: '$2.46\\,\\text{L}$',
      D: '$12.3\\,\\text{L}$'
    },
    solution_text: 'Moles of oxygen gas ($n$) $= \\frac{320\\,\\text{g}}{32\\,\\text{g/mol}} = 10.0\\,\\text{mol}$.\nTemperature in Kelvin ($T$) $= 27 + 273 = 300\\,\\text{K}$.\nUsing ideal gas law $PV = nRT$:\n$10.0 \\times V = 10.0 \\times 0.0821 \\times 300$\n$V = 0.0821 \\times 300 = 24.63\\,\\text{L}$. Option A is correct.',
    common_mistake: 'Using Celsius temperature ($27$) directly in the formula instead of converting it to Kelvin ($300\\,\\text{K}$).',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'The volume occupied by $4.40\\,\\text{g}$ of carbon dioxide ($\\text{CO}_2$) at STP (assuming STP molar volume $= 22.4\\,\\text{L/mol}$) is ________ $\\text{L}$.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Moles $=$ mass / molar mass. Volume at STP $=$ moles $\\times 22.4$.',
    correct_answer: '2.24',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of $\\text{CO}_2 = \\frac{4.40\\,\\text{g}}{44\\,\\text{g/mol}} = 0.100\\,\\text{mol}$.\nVolume at STP $= 0.100\\,\\text{mol} \\times 22.4\\,\\text{L/mol} = 2.24\\,\\text{L}$.',
    common_mistake: 'Dividing by 2.24 instead of multiplying by it.',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'If $1.00\\,\\text{L}$ of an unknown gas at STP weighs $1.96\\,\\text{g}$, the molar mass of the gas is ________ $\\text{g/mol}$. (Assume STP molar volume $= 22.4\\,\\text{L/mol}$)',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Moles $=$ Volume at STP / 22.4. Molar mass $=$ mass / moles.',
    correct_answer: '44',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of gas in $1.00\\,\\text{L} = \\frac{1.00\\,\\text{L}}{22.4\\,\\text{L/mol}} = 0.04464\\,\\text{mol}$.\nMolar mass $= \\frac{\\text{Mass}}{\\text{Moles}} = \\frac{1.96\\,\\text{g}}{0.04464\\,\\text{mol}} \\approx 43.9\\,\\text{g/mol} \\approx 44\\,\\text{g/mol}$.',
    common_mistake: 'Failing to use correct units or making arithmetic errors in division.',
    concept_slugs: ['gaseous-volume-ideal-gas', 'mole-mass-number']
  },
  {
    title: 'Calculate the volume (in liters) occupied by $8.50\\,\\text{g}$ of ammonia ($\\text{NH}_3$) at $27.0^\\circ\\text{C}$ and $2.00\\,\\text{atm}$ pressure. (Use $R = 0.0821\\,\\text{L\\cdot atm\\cdot K}^{-1}\\text{mol}^{-1}$)',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Convert mass to moles, temperature to Kelvin, and use $PV = nRT$.',
    correct_answer: '6.16',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of $\\text{NH}_3 = \\frac{8.50\\,\\text{g}}{17.0\\,\\text{g/mol}} = 0.50\\,\\text{mol}$.\nTemperature $T = 27.0 + 273 = 300\\,\\text{K}$.\nUsing $PV = nRT$:\n$2.00 \\times V = 0.50 \\times 0.0821 \\times 300$\n$2.00 \\times V = 12.315 \\implies V = 6.1575\\,\\text{L} \\approx 6.16\\,\\text{L}$.',
    common_mistake: 'Using incorrect molar mass for ammonia ($14$ instead of $17$), or using $27$ instead of $300$ for temperature.',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'A sample of ideal gas occupies $2.40\\,\\text{L}$ at $1.00\\,\\text{atm}$ pressure and $27.0^\\circ\\text{C}$. What volume will it occupy at $2.00\\,\\text{atm}$ pressure and $127^\\circ\\text{C}$?',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Use the combined gas law: $\\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}$. Convert both temperatures to Kelvin.',
    correct_answer: 'B',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$1.20\\,\\text{L}$',
      B: '$1.60\\,\\text{L}$',
      C: '$2.00\\,\\text{L}$',
      D: '$0.80\\,\\text{L}$'
    },
    solution_text: 'Using combined gas law: $\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$.\nGiven values:\n$P_1 = 1.00\\,\\text{atm}, V_1 = 2.40\\,\\text{L}, T_1 = 27 + 273 = 300\\,\\text{K}$.\n$P_2 = 2.00\\,\\text{atm}, T_2 = 127 + 273 = 400\\,\\text{K}$.\nSubstitute into equation:\n$\\frac{1.00 \\times 2.40}{300} = \\frac{2.00 \\times V_2}{400}$\n$\\frac{2.40}{300} = \\frac{2.00 \\times V_2}{400} \\implies 0.008 = 0.005 \\times V_2 \\implies V_2 = 1.60\\,\\text{L}$.\nOption B is correct.',
    common_mistake: 'Using temperatures in Celsius ($27$ and $127$), which yields an incorrect volume of $5.64\\,\\text{L}$.',
    concept_slugs: ['gaseous-volume-ideal-gas']
  },
  {
    title: 'A balloon of volume $100\\,\\text{m}^3$ is filled with helium gas at $27.0^\\circ\\text{C}$ and $1.00\\,\\text{atm}$ pressure. If the density of surrounding air is $1.20\\,\\text{kg/m}^3$, the payload (lifting capacity) of the balloon is ________ $\\text{kg}$. (Use $R = 0.0821\\,\\text{L\\cdot atm\\cdot K}^{-1}\\text{mol}^{-1}$ and atomic mass of $\\text{He} = 4.0\\,\\text{g/mol}$)',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Payload $=$ mass of air displaced $-$ mass of helium in the balloon. Remember $1\\,\\text{m}^3 = 1000\\,\\text{L}$.',
    correct_answer: '104',
    pattern_group: 'gaseous-volume-ideal-gas',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: '1. Mass of air displaced $=$ density of air $\\times$ volume $= 1.20\\,\\text{kg/m}^3 \\times 100\\,\\text{m}^3 = 120\\,\\text{kg}$.\n2. Moles of Helium in balloon:\nVolume $V = 100\\,\\text{m}^3 = 100,000\\,\\text{L}$.\nTemperature $T = 300\\,\\text{K}$, Pressure $P = 1.00\\,\\text{atm}$.\n$n = \\frac{PV}{RT} = \\frac{1.00 \\times 100,000}{0.0821 \\times 300} = 4059.7\\,\\text{mol}$.\n3. Mass of Helium $= 4059.7\\,\\text{mol} \\times 4.0\\,\\text{g/mol} = 16239\\,\\text{g} = 16.24\\,\\text{kg}$.\n4. Payload $=$ Mass of air displaced $-$ Mass of Helium $= 120 - 16.24 = 103.76\\,\\text{kg} \\approx 104\\,\\text{kg}$.',
    common_mistake: 'Neglecting the mass of helium gas inside the balloon, or failing to convert cubic meters to liters correctly.',
    concept_slugs: ['gaseous-volume-ideal-gas', 'mole-concept-advanced']
  },

  // ==========================================
  // PATTERN GROUP 7: TITRATION & BACK TITRATION (10 Qs)
  // ==========================================
  {
    title: '$25.0\\,\\text{mL}$ of a sodium carbonate ($\\text{Na}_2\\text{CO}_3$) solution required $20.0\\,\\text{mL}$ of $0.100\\,\\text{M}\\,\\text{HCl}$ for complete neutralization using methyl orange indicator. The molarity of the sodium carbonate solution is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Methyl orange titration goes to completion to form carbonic acid (n-factor of sodium carbonate is 2).',
    correct_answer: 'B',
    pattern_group: 'titration-back-titration',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.080\\,\\text{M}$',
      B: '$0.040\\,\\text{M}$',
      C: '$0.050\\,\\text{M}$',
      D: '$0.100\\,\\text{M}$'
    },
    solution_text: 'Reaction with methyl orange indicator:\n$\\text{Na}_2\\text{CO}_3 + 2\\text{HCl} \\rightarrow 2\\text{NaCl} + \\text{CO}_2 + \\text{H}_2\\text{O}$.\nBy Law of Equivalence:\n$\\text{Equivalents of } Na_2CO_3 = \\text{Equivalents of } HCl$\n$(M_1 \\times 2) \\times 25.0 = (0.100 \\times 1) \\times 20.0$\n$50 \\times M_1 = 2 \\implies M_1 = 0.040\\,\\text{M}$. Option B is correct.',
    common_mistake: 'Using n-factor 1 for sodium carbonate (which only happens with phenolphthalein indicator when it forms sodium bicarbonate), leading to $0.080\\,\\text{M}$ (Option A).',
    concept_slugs: ['titration-back-titration']
  },
  {
    title: '$1.00\\,\\text{g}$ of an impure sample of calcium carbonate ($\\text{CaCO}_3$) was dissolved in $50.0\\,\\text{mL}$ of $0.500\\,\\text{M}\\,\\text{HCl}$. The excess acid required $20.0\\,\\text{mL}$ of $0.200\\,\\text{M}\\,\\text{NaOH}$ for complete neutralization. The percentage purity of $\\text{CaCO}_3$ in the sample is ________ $\\%$. (Molar mass of $\\text{CaCO}_3 = 100\\,\\text{g/mol}$)',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'This is a back titration. Moles of acid added $=$ moles of acid reacted with carbonate $+$ moles of acid neutralized by base.',
    correct_answer: '105',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: '1. Total moles of HCl added $= 0.500\\,\\text{M} \\times 0.0500\\,\\text{L} = 0.0250\\,\\text{mol}$.\n2. Moles of NaOH used to neutralize excess HCl $= 0.200\\,\\text{M} \\times 0.0200\\,\\text{L} = 0.0040\\,\\text{mol}$.\n3. Since NaOH and HCl react in a $1:1$ ratio, the excess HCl $= 0.0040\\,\\text{mol}$.\n4. Moles of HCl reacted with $\\text{CaCO}_3 = 0.0250 - 0.0040 = 0.0210\\,\\text{mol}$.\n5. Reaction: $\\text{CaCO}_3 + 2\\text{HCl} \\rightarrow \\text{CaCl}_2 + \\text{CO}_2 + \\text{H}_2\\text{O}$.\nMoles of pure $\\text{CaCO}_3 = \\frac{1}{2} \\times \\text{moles of HCl reacted} = 0.0105\\,\\text{mol}$.\n6. Mass of pure $\\text{CaCO}_3 = 0.0105 \\times 100 = 1.05\\,\\text{g}$.\n7. Purity percentage $= 1.05 / 1.00 \\times 100 = 105$.',
    common_mistake: 'Failing to divide the reacted moles of HCl by 2 to find the moles of CaCO3.',
    concept_slugs: ['titration-back-titration', 'stoichiometry-limiting-reagent']
  },
  {
    title: 'To neutralize $20.0\\text{ mL}$ of a $0.100\\,\\text{M}$ aqueous solution of oxalic acid ($\\text{H}_2\\text{C}_2\\text{O}_4$), the volume of $0.020\\,\\text{M}\\,\\text{KMnO}_4$ required in an acidic medium is ________ $\\text{mL}$.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2023',
    notes: 'Law of Equivalence: $N_1V_1 = N_2V_2$. n-factor of oxalic acid $= 2$, n-factor of permanganate $= 5$.',
    correct_answer: '40',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'By Law of Equivalence:\n$\\text{Equivalents of oxalic acid} = \\text{Equivalents of KMnO}_4$\n$(M_1 \\times n_1) \\times V_1 = (M_2 \\times n_2) \\times V_2$\nFor oxalic acid: $M_1 = 0.100\\,\\text{M}, n_1 = 2, V_1 = 20.0\\,\\text{mL}$.\nFor $\\text{KMnO}_4$: $M_2 = 0.020\\,\\text{M}, n_2 = 5, V_2 = ?$\n$(0.100 \\times 2) \\times 20.0 = (0.020 \\times 5) \\times V_2$\n$4 = 0.100 \\times V_2 \\implies V_2 = 40.0\\,\\text{mL}$.',
    common_mistake: 'Assuming the n-factor of permanganate is 1 or using molarity ratios directly without accounting for equivalents.',
    concept_slugs: ['titration-back-titration', 'equivalent-weight-normality']
  },
  {
    title: 'What volume of $0.020\\,\\text{M}\\,\\text{KMnO}_4$ is required to oxidize $20.0\\,\\text{mL}$ of $0.050\\,\\text{M}\\,\\text{FeC}_2\\text{O}_4$ (ferrous oxalate) in an acidic medium?',
    difficulty: 'hard',
    type: 'concept',
    notes: 'In ferrous oxalate ($\\text{FeC}_2\\text{O}_4$), both $\\text{Fe}^{2+}$ and $\\text{C}_2\\text{O}_4^{2-}$ are oxidized. Total n-factor of $\\text{FeC}_2\\text{O}_4 = 3$.',
    correct_answer: 'B',
    pattern_group: 'titration-back-titration',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$20.0\\,\\text{mL}$',
      B: '$30.0\\,\\text{mL}$',
      C: '$10.0\\,\\text{mL}$',
      D: '$15.0\\,\\text{mL}$'
    },
    solution_text: 'Reaction in acidic medium:\n1. $\\text{Fe}^{2+} \\rightarrow \\text{Fe}^{3+} + e^-$ (electron change $= 1$)\n2. $\\text{C}_2\\text{O}_4^{2-} \\rightarrow 2\\text{CO}_2 + 2e^-$ (electron change $= 2$)\nTotal n-factor of $\\text{FeC}_2\\text{O}_4 = 1 + 2 = 3$.\nn-factor of $\\text{KMnO}_4 = 5$ (Mn changes from +7 to +2).\nBy Law of Equivalence:\n$\\text{Equivalents of KMnO}_4 = \\text{Equivalents of FeC}_2\\text{O}_4$\n$(M_1 \\times n_1) \\times V_1 = (M_2 \\times n_2) \\times V_2$\n$(0.020 \\times 5) \\times V_1 = (0.050 \\times 3) \\times 20.0$\n$0.100 \\times V_1 = 0.150 \\times 20.0 = 3.0$\n$V_1 = 30.0\\,\\text{mL}$. Option B is correct.',
    common_mistake: 'Using n-factor 2 for ferrous oxalate (thinking only oxalate oxidizes) or 1 (thinking only iron oxidizes).',
    concept_slugs: ['titration-back-titration', 'equivalent-weight-normality']
  },
  {
    title: 'In an iodometric titration of $\\text{CuSO}_4$, $1.00\\,\\text{mole}$ of $\\text{CuSO}_4$ reacts with excess $\\text{KI}$ to liberate $\\text{I}_2$. The moles of sodium thiosulfate ($\\text{Na}_2\\text{S}_2\\text{O}_3$) required to titrate the liberated iodine is:',
    difficulty: 'medium',
    type: 'concept',
    notes: 'Reactions: $2\\text{Cu}^{2+} + 4\\text{I}^- \\rightarrow \\text{Cu}_2\\text{I}_2 + \\text{I}_2$ and $\\text{I}_2 + 2\\text{S}_2\\text{O}_3^{2-} \\rightarrow 2\\text{I}^- + \\text{S}_4\\text{O}_6^{2-}$.',
    correct_answer: 'B',
    pattern_group: 'titration-back-titration',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0.50\\,\\text{mol}$',
      B: '$1.00\\,\\text{mol}$',
      C: '$2.00\\,\\text{mol}$',
      D: '$1.50\\,\\text{mol}$'
    },
    solution_text: 'Reaction 1: $2\\text{CuSO}_4 + 4\\text{KI} \\rightarrow \\text{Cu}_2\\text{I}_2 + \\text{I}_2 + 2\\text{K}_2\\text{SO}_4$.\nHere, $2\\,\\text{moles}$ of $\\text{Cu}^{2+}$ liberate $1\\,\\text{mole}$ of $\\text{I}_2$. So $1.00\\,\\text{mole}$ of $\\text{CuSO}_4$ liberates $0.50\\,\\text{mole}$ of $\\text{I}_2$.\nReaction 2: $\\text{I}_2 + 2\\text{Na}_2\\text{S}_2\\text{O}_3 \\rightarrow 2\\text{NaI} + \\text{Na}_2\\text{S}_4\\text{O}_6$.\nHere, $1\\,\\text{mole}$ of $\\text{I}_2$ reacts with $2\\,\\text{moles}$ of thiosulfate.\nThus, $0.50\\,\\text{mole}$ of $\\text{I}_2$ requires $2 \\times 0.50 = 1.00\\,\\text{mole}$ of $\\text{Na}_2\\text{S}_2\\text{O}_3$. Option B is correct.',
    common_mistake: 'Failing to write down both balanced reactions, resulting in a 2:1 or 1:2 ratio error.',
    concept_slugs: ['titration-back-titration']
  },
  {
    title: '$10.0\\,\\text{mL}$ of a sample of hydrogen peroxide ($\\text{H}_2\\text{O}_2$) requires $20.0\\,\\text{mL}$ of $0.020\\,\\text{M}\\,\\text{KMnO}_4$ for complete titration in an acidic medium. The volume strength of the $\\text{H}_2\\text{O}_2$ sample is ________.',
    difficulty: 'hard',
    type: 'concept',
    notes: 'Volume strength $= 11.2 \\times M$. First, determine the molarity of $\\text{H}_2\\text{O}_2$ using redox equivalence (n-factor of $\\text{H}_2\\text{O}_2 = 2$).',
    correct_answer: '1.12',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'By Law of Equivalence:\n$\\text{Equivalents of } H_2O_2 = \\text{Equivalents of KMnO}_4$\n$(M_1 \\times 2) \\times 10.0 = (0.020 \\times 5) \\times 20.0$\n$20 \\times M_1 = 0.100 \\times 20 \\implies M_1 = 0.100\\,\\text{M}$.\nMolarity of $\\text{H}_2\\text{O}_2 = 0.100\\,\\text{M}$.\nVolume strength $= 11.2 \\times M = 11.2 \\times 0.100 = 1.12$.',
    common_mistake: 'Using incorrect formula for volume strength (like $5.6 \\times M$, which is for normality, or using the wrong n-factor).',
    concept_slugs: ['titration-back-titration', 'concentration-terms']
  },
  {
    title: 'An aqueous solution containing $0.122\\,\\text{g}$ of a monoprotic weak acid requires $10.0\\,\\text{mL}$ of $0.100\\,\\text{M}\\,\\text{NaOH}$ for complete titration. The molar mass of the acid is ________ $\\text{g/mol}$.',
    difficulty: 'easy',
    type: 'practice',
    notes: 'Monoprotic acid reacts with NaOH in a $1:1$ molar ratio.',
    correct_answer: '122',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Moles of NaOH used $= 0.100\\,\\text{M} \\times 0.0100\\,\\text{L} = 0.00100\\,\\text{mol}$.\nSince the acid is monoprotic, moles of acid $=$ moles of NaOH $= 0.00100\\,\\text{mol}$.\nMolar mass of acid $= \\frac{\\text{Mass}}{\\text{Moles}} = \\frac{0.122\\,\\text{g}}{0.00100\\,\\text{mol}} = 122\\,\\text{g/mol}$.',
    common_mistake: 'Dividing by the volume in mL directly without converting to liters.',
    concept_slugs: ['titration-back-titration']
  },
  {
    title: '$1.25\\,\\text{g}$ of a divalent metal carbonate ($M\\text{CO}_3$) on complete heating gives $0.70\\,\\text{g}$ of the metal oxide ($MO$). The atomic mass of the metal is ________ $\\text{u}$.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Reaction: $M\\text{CO}_3 \\rightarrow MO + \\text{CO}_2$. Use stoichiometry: moles of carbonate $=$ moles of oxide.',
    correct_answer: '40',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let the atomic mass of the metal be $M\\,\\text{g/mol}$.\nMolar mass of $M\\text{CO}_3 = M + 60\\,\\text{g/mol}$.\nMolar mass of $MO = M + 16\\,\\text{g/mol}$.\nReaction: $M\\text{CO}_3 \\rightarrow MO + \\text{CO}_2$.\nMoles of $M\\text{CO}_3 = \\text{moles of } MO \\implies \\frac{1.25}{M + 60} = \\frac{0.70}{M + 16}$.\n$1.25(M + 16) = 0.70(M + 60) \\implies 1.25M + 20 = 0.70M + 42 \\implies 0.55M = 22 \\implies M = 40$.',
    common_mistake: 'Using incorrect molar masses for carbonate ($60$) or oxide ($16$), or making algebraic mistakes in solving the ratio equation.',
    concept_slugs: ['titration-back-titration', 'stoichiometry-limiting-reagent']
  },
  {
    title: 'A $0.50\\,\\text{g}$ sample containing $\\text{Fe}_2\\text{O}_3$ and inert impurities is dissolved, and all iron is reduced to $\\text{Fe}^{2+}$. The solution is titrated with $0.020\\,\\text{M}\\,\\text{K}_2\\text{Cr}_2\\text{O}_7$, requiring $15.0\\,\\text{mL}$ for complete oxidation. The mass percentage of $\\text{Fe}_2\\text{O}_3$ in the sample is ________ $\\%$. (Molar mass of $\\text{Fe}_2\\text{O}_3 = 160\\,\\text{g/mol}$)',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Equivalents of $\\text{Fe}^{2+} = $ equivalents of dichromate. Moles of $\\text{Fe}_2\\text{O}_3 = \\frac{1}{2} \\times$ moles of $\\text{Fe}^{2+}$.',
    correct_answer: '29',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Redox equivalents equation:\n$\\text{Equivalents of } Fe^{2+} = \\text{Equivalents of } K_2Cr_2O_7$\n$1 \\times \\text{moles of } Fe^{2+} = (0.020\\,\\text{M} \\times 6) \\times 0.0150\\,\\text{L} = 0.00180\\,\\text{mol}$.\nMoles of $\\text{Fe}_2\\text{O}_3 = \\frac{1}{2} \\times \\text{moles of } Fe^{2+} = 0.00090\\,\\text{mol}$.\nMass of pure $\\text{Fe}_2\\text{O}_3 = 0.00090\\,\\text{mol} \\times 160\\,\\text{g/mol} = 0.144\\,\\text{g}$.\nMass percentage of $\\text{Fe}_2\\text{O}_3 = \\frac{0.144\\,\\text{g}}{0.50\\,\\text{g}} \\times 100 = 28.8\\% \\approx 29\\%$.',
    common_mistake: 'Forgetting the $1/2$ factor when relating moles of iron ions to moles of iron(III) oxide ($\\text{Fe}_2\\text{O}_3$ has 2 Fe atoms), leading to double the actual percentage ($57.6\\%$).',
    concept_slugs: ['titration-back-titration', 'mole-concept-advanced']
  },
  {
    title: 'A $2.50\\,\\text{g}$ sample of an ammonium salt is heated with excess sodium hydroxide. The ammonia gas evolved is absorbed in $50.0\\,\\text{mL}$ of $0.500\\,\\text{M}\\,\\text{H}_2\\text{SO}_4$. The excess acid requires $20.0\\,\\text{mL}$ of $0.500\\,\\text{M}\\,\\text{NaOH}$ for complete neutralization. The percentage of nitrogen in the ammonium salt sample is ________ $\\%$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'This is a back-titration analysis of Kjeldahl\'s method. Moles of ammonia evolved $=$ equivalents of acid neutralized by ammonia.',
    correct_answer: '22',
    pattern_group: 'titration-back-titration',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: '1. Total equivalents of H$_2$SO$_4$ initially $= 2 \\times M \\times V = 2 \\times 0.500\\,\\text{M} \\times 0.0500\\,\\text{L} = 0.0500\\,\\text{eq}$ (or $50.0\\,\\text{meq}$).\n2. Equivalents of NaOH used to neutralize excess H$_2$SO$_4 = M \\times V = 0.500\\,\\text{M} \\times 0.0200\\,\\text{L} = 0.0100\\,\\text{eq}$ (or $10.0\\,\\text{meq}$).\n3. Equivalents of acid neutralized by NH$_3 = 0.0500 - 0.0100 = 0.0400\\,\\text{eq}$ (or $40.0\\,\\text{meq}$).\n4. Since n-factor of NH$_3$ is 1, moles of NH$_3 = 0.0400\\,\\text{mol}$.\n5. Mass of Nitrogen $= 0.0400\\,\\text{mol} \\times 14.0\\,\\text{g/mol} = 0.560\\,\\text{g}$.\n6. Percentage of Nitrogen in the sample $= \\frac{0.560}{2.50} \\times 100 = 22.4\\% \\approx 22\\%$.',
    common_mistake: 'Treating H$_2$SO$_4$ as monoprotic or failing to account for the stoichiometry of neutralization.',
    concept_slugs: ['titration-back-titration', 'mole-concept-advanced']
  },

  // ==========================================
  // PATTERN GROUP 8: MULTI-CONCEPT / DISGUISED (10 Qs)
  // ==========================================
  {
    title: 'A mixture of sodium chloride ($\\text{NaCl}$) and potassium chloride ($\\text{KCl}$) weighing $0.900\\,\\text{g}$ is dissolved in water and treated with excess silver nitrate ($\\text{AgNO}_3$). The mass of silver chloride ($\\text{AgCl}$) precipitate formed is $1.97\\,\\text{g}$. The percentage of sodium chloride in the original mixture is: (Atomic mass: $\\text{Na}=23, \\text{K}=39.1, \\text{Cl}=35.5, \\text{Ag}=108$)',
    difficulty: 'hard',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Let the mass of NaCl be $x\\,\\text{g}$ and KCl be $0.900-x\\,\\text{g}$. Set up an equation for the moles of AgCl precipitate.',
    correct_answer: 'D',
    pattern_group: 'mole-concept-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$45.0\\%$',
      B: '$60.0\\%$',
      C: '$35.0\\%$',
      D: '$50.0\\%$'
    },
    solution_text: 'Let mass of NaCl in mixture $= x\\,\\text{g}$. Mass of KCl $= 0.900 - x\\,\\text{g}$.\nMolar masses: $\\text{NaCl} = 58.5$, $\\text{KCl} = 74.6$, $\\text{AgCl} = 143.5$.\nMoles of Cl$^-$ from NaCl $= x / 58.5$.\nMoles of Cl$^-$ from KCl $= (0.900 - x) / 74.6$.\nSince each mole of chloride yields 1 mole of $\\text{AgCl}$ precipitate:\n$\\text{Moles of AgCl} = \\frac{x}{58.5} + \\frac{0.900 - x}{74.6} = \\frac{1.97\\,\\text{g}}{143.5\\,\\text{g/mol}} \\approx 0.01372\\,\\text{mol}$.\nIf $x = 0.450\\,\\text{g}$ (which is $50\\%$ of $0.900\\,\\text{g}$):\nMoles of NaCl $= 0.450 / 58.5 = 0.00769\\,\\text{mol}$.\nMoles of KCl $= 0.450 / 74.6 = 0.00603\\,\\text{mol}$.\nTotal moles of chloride $= 0.00769 + 0.00603 = 0.01372\\,\\text{mol}$.\nMass of AgCl $= 0.01372 \\times 143.5 = 1.97\\,\\text{g}$. This matches exactly, so NaCl percentage is $50.0\\%$. Option D is correct.',
    common_mistake: 'Making arithmetic errors when solving the dual-component algebraic equation system.',
    concept_slugs: ['mole-concept-advanced', 'stoichiometry-limiting-reagent']
  },
  {
    title: 'Dissolving $120\\,\\text{g}$ of urea (molar mass $= 60\\,\\text{g/mol}$) in $1000\\,\\text{g}$ of water gives a solution of density $1.12\\,\\text{g/mL}$. The molarity of this solution is:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Find total mass of solution, divide by density to get volume, and calculate molarity.',
    correct_answer: 'C',
    pattern_group: 'mole-concept-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$1.00\\,\\text{M}$',
      B: '$1.50\\,\\text{M}$',
      C: '$2.00\\,\\text{M}$',
      D: '$2.50\\,\\text{M}$'
    },
    solution_text: 'Moles of urea $= \\frac{120\\,\\text{g}}{60\\,\\text{g/mol}} = 2.0\\,\\text{mol}$.\nTotal mass of solution $= \\text{mass of urea} + \\text{mass of water} = 120 + 1000 = 1120\\,\\text{g}$.\nVolume of solution $= \\frac{\\text{Mass}}{\\text{Density}} = \\frac{1120\\,\\text{g}}{1.12\\,\\text{g/mL}} = 1000\\,\\text{mL} = 1.0\\,\\text{L}$.\nMolarity $= \\frac{\\text{Moles}}{\\text{Volume in liters}} = \\frac{2.0\\,\\text{mol}}{1.0\\,\\text{L}} = 2.00\\,\\text{M}$. Option C is correct.',
    common_mistake: 'Using the volume of water ($1000\\,\\text{mL}$) directly as the volume of the solution, which neglects the density and solute contribution.',
    concept_slugs: ['mole-concept-advanced', 'concentration-terms']
  },
  {
    title: 'A mixture of ammonium chloride ($\\text{NH}_4\\text{Cl}$) and ammonium sulfate [$(\\text{NH}_4)_2\\text{SO}_4$] has a nitrogen percentage of $22.6\\%$ by mass. The molar ratio of $\\text{NH}_4\\text{Cl}$ to $(\\text{NH}_4)_2\\text{SO}_4$ in this mixture is ________.',
    difficulty: 'hard',
    type: 'practice',
    notes: 'Let the moles of $\\text{NH}_4\\text{Cl}$ be $x$ and $(\\text{NH}_4)_2\\text{SO}_4$ be $y$. Find nitrogen mass fraction and solve for ratio $x/y$.',
    correct_answer: '1',
    pattern_group: 'mole-concept-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Let moles of both be $1\\,\\text{mol}$ each (molar ratio $= 1$).\nMass of $\\text{NH}_4\\text{Cl} = 53.5\\,\\text{g}$, Mass of $(\\text{NH}_4)_2\\text{SO}_4 = 132.0\\,\\text{g}$. Total mass $= 185.5\\,\\text{g}$.\nMoles of Nitrogen $= 1 + 2 = 3\\,\\text{mol}$. Mass of Nitrogen $= 3 \\times 14 = 42\\,\\text{g}$.\nNitrogen percentage $= \\frac{42}{185.5} \\times 100 \\approx 22.64\\%$. So for $22.6\\%$ nitrogen, the molar ratio is 1.',
    common_mistake: 'Forgetting that ammonium sulfate contains two nitrogen atoms per formula unit, leading to incorrect mole equations.',
    concept_slugs: ['mole-concept-advanced']
  },
  {
    title: '$100\\,\\text{mL}$ of $0.100\\,\\text{M}\\,\\text{H}_3\\text{PO}_4$ is mixed with $100\\,\\text{mL}$ of $0.100\\,\\text{M}\\,\\text{NaOH}$. The molarity of the resulting sodium dihydrogen phosphate ($\\text{NaH}_2\\text{PO}_4$) in the solution is ________ $\\times 10^{-2}\\,\\text{M}$.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Reaction: $\\text{H}_3\\text{PO}_4 + \\text{NaOH} \\rightarrow \\text{NaH}_2\\text{PO}_4 + \\text{H}_2\\text{O}$. Remember to double the volume of the solution when calculating the final concentration.',
    correct_answer: '5',
    pattern_group: 'mole-concept-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Reaction: $\\text{H}_3\\text{PO}_4 + \\text{NaOH} \\rightarrow \\text{NaH}_2\\text{PO}_4 + \\text{H}_2\\text{O}.\nMoles of each $= 0.010\\,\\text{mol}$. Moles of $\\text{NaH}_2\\text{PO}_4$ produced $= 0.010\\,\\text{mol}$.\nTotal volume $= 200\\,\\text{mL} = 0.200\\,\\text{L}$.\nMolarity of $\\text{NaH}_2\\text{PO}_4 = 0.010 / 0.200 = 0.050\\,\\text{M} = 5 \\times 10^{-2}\\,\\text{M}$.',
    common_mistake: 'Forgetting to use the total volume of $200\\,\\text{mL}$ for the final concentration, which would incorrectly yield $0.10\\,\\text{M}$.',
    concept_slugs: ['mole-concept-advanced', 'stoichiometry-limiting-reagent']
  },
  {
    title: 'The volume of $0.100\\,\\text{M}\\,\\text{H}_2\\text{SO}_4$ required to completely neutralize $20.0\\,\\text{mL}$ of a solution containing equal masses of sodium hydroxide ($\\text{NaOH}$) and potassium hydroxide ($\\text{KOH}$) (total concentration of bases $= 1.00\\,\\text{g/L}$) is:',
    difficulty: 'hard',
    type: 'practice',
    notes: 'Let the mass of NaOH and KOH be $w$ each in $20.0\\,\\text{mL}$. Find total moles of hydroxide ions and equate to equivalents of acid.',
    correct_answer: 'A',
    pattern_group: 'mole-concept-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$2.14\\,\\text{mL}$',
      B: '$4.28\\,\\text{mL}$',
      C: '$1.07\\,\\text{mL}$',
      D: '$5.00\\,\\text{mL}$'
    },
    solution_text: 'Total mass of bases in $20.0\\,\\text{mL} = 0.020\\,\\text{g}$. Mass of each $= 0.010\\,\\text{g}$.\nMoles of NaOH $= 0.010 / 40.0 = 0.000250\\,\\text{mol}$.\nMoles of KOH $= 0.010 / 56.1 = 0.000178\\,\\text{mol}$.\nTotal moles of OH$^- = 0.000428\\,\\text{mol}$.\nMoles of $\\text{H}_2\\text{SO}_4$ needed $= 0.000214\\,\\text{mol}$.\nVolume of $0.100\\,\\text{M}\\,\\text{H}_2\\text{SO}_4 = 0.00214\\,\\text{L} = 2.14\\,\\text{mL}$. Option A is correct.',
    common_mistake: 'Failing to divide the moles of OH- by 2 for the H2SO4 requirement (H2SO4 is diprotic), leading to $4.28\\,\\text{mL}$ (Option B).',
    concept_slugs: ['mole-concept-advanced', 'equivalent-weight-normality']
  },
  {
    title: 'The number of moles of water molecules present in $1.00\\,\\text{L}$ of pure liquid water at $4^\\circ\\text{C}$ (density $= 1.00\\,\\text{g/mL}$) is ________.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Mass of 1 liter water is $1000\\,\\text{g}$. Moles $=$ mass / molar mass (18).',
    correct_answer: '55.6',
    pattern_group: 'mole-concept-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Mass of $1.00\\,\\text{L}$ water $= 1000\\,\\text{g}$. Moles of H$_2$O $= 1000 / 18.02 \\approx 55.56\\,\\text{mol} \\approx 55.6\\,\\text{mol}$.',
    common_mistake: 'Confusing this with gas molar volume at STP (thinking 1 mole of water occupies 22.4 L, or that 1 L is 1/22.4 moles). That only applies to gases, not liquids.',
    concept_slugs: ['mole-concept-advanced']
  },
  {
    title: 'Epsom salt is a hydrated magnesium sulfate compound with the formula $\\text{MgSO}_4\\cdot 7\\text{H}_2\\text{O}$. The percentage of water of crystallization by mass in Epsom salt is ________ $\\%$. (Atomic mass: $\\text{Mg}=24, \\text{S}=32, \\text{O}=16, \\text{H}=1$)',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Find molecular mass of Epsom salt and divide the mass of 7 water molecules by it.',
    correct_answer: '51',
    pattern_group: 'mole-concept-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Molar mass $= 246\\,\\text{g/mol}$. Water mass $= 126\\,\\text{g}$.\nPercentage $= \\frac{126}{246} \\times 100 \\approx 51.2\\% \\approx 51\\%$.',
    common_mistake: 'Forgetting to include the mass of water of crystallization in the total molar mass denominator, or using the wrong number of water molecules.',
    concept_slugs: ['mole-concept-advanced', 'mole-mass-number']
  },
  {
    title: 'A gaseous mixture contains $\\text{CO}$, $\\text{CO}_2$, and $\\text{N}_2$. When $100\\,\\text{mL}$ of this mixture is exploded with excess $\\text{O}_2$ gas, a contraction of $20.0\\,\\text{mL}$ in volume is observed. When the resulting gas mixture is passed through a KOH solution, a further contraction of $70.0\\,\\text{mL}$ is observed. (All volumes measured under identical temperature and pressure). The volume percentage of nitrogen gas in the original mixture is:',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Only $\\text{CO}$ reacts with $\\text{O}_2$: $2\\text{CO}(g) + \\text{O}_2(g) \\rightarrow 2\\text{CO}_2(g)$. Contraction $=$ volume of reactant gases $-$ volume of product gases. KOH absorbs $\\text{CO}_2$ (both original and newly formed).',
    correct_answer: 'C',
    pattern_group: 'mole-concept-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$20.0\\%$',
      B: '$40.0\\%$',
      C: '$30.0\\%$',
      D: '$50.0\\%$'
    },
    solution_text: 'Let CO $= x\\,\\text{mL}$, $\\text{CO}_2 = y\\,\\text{mL}$, $\\text{N}_2 = 100 - (x+y)\\,\\text{mL}$.\n1. Contraction $= x/2 = 20.0 \\implies x = 40.0\\,\\text{mL}$ (CO).\n2. KOH contraction $= x + y = 70.0 \\implies 40.0 + y = 70.0 \\implies y = 30.0\\,\\text{mL}$ ($\\text{CO}_2$).\n3. Nitrogen $= 100 - (40.0 + 30.0) = 30.0\\,\\text{mL}$ ($30.0\\%$). Option C is correct.',
    common_mistake: 'Failing to realize that KOH absorbs the total carbon dioxide, which includes both the carbon dioxide originally present and that produced by the combustion of carbon monoxide.',
    concept_slugs: ['mole-concept-advanced', 'gaseous-volume-ideal-gas']
  },
  {
    title: 'A metal M forms two oxides. One oxide contains $22.2\\%$ oxygen by mass, and the other contains $30.0\\%$ oxygen by mass. If the formula of the second oxide is $\\text{M}_2\\text{O}_3$, the formula of the first oxide is:',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Use the second oxide to calculate the atomic mass of metal M. Then use this atomic mass to find the formula of the first oxide.',
    correct_answer: 'A',
    pattern_group: 'mole-concept-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{MO}$',
      B: '$\\text{M}_2\\text{O}$',
      C: '$\\text{MO}_2$',
      D: '$\\text{M}_3\\text{O}_4$'
    },
    solution_text: 'For the second oxide $\\text{M}_2\\text{O}_3$: valency reduction gives atomic mass $A = 56\\,\\text{g/mol}$.\nFor the first oxide: Oxygen percent $= 22.2\\%$, metal percent $= 77.8\\%$.\nMoles of Metal $= 77.8 / 56.0 = 1.39$. Moles of Oxygen $= 22.2 / 16.0 = 1.39$.\nRatio $= 1:1$, so empirical formula is $\\text{MO}$. Option A is correct.',
    common_mistake: 'Failing to determine the atomic weight of the metal first, or making mistakes in the relative mole calculations.',
    concept_slugs: ['mole-concept-advanced', 'empirical-molecular-formula']
  },
  {
    title: 'An organic compound containing carbon, hydrogen, and nitrogen is analyzed. $0.250\\,\\text{g}$ of this compound yields $0.550\\,\\text{g}$ of carbon dioxide ($\\text{CO}_2$) and $0.150\\,\\text{g}$ of water ($\\text{H}_2\\text{O}$) upon combustion. The mass percentage of nitrogen in this organic compound is ________ $\\%$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Find mass of C and mass of H. Since the compound only contains C, H, and N, mass of nitrogen is the difference between total mass and C+H mass.',
    correct_answer: '33',
    pattern_group: 'mole-concept-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: '1. Mass of Carbon $= 0.550 \\times \\frac{12}{44} = 0.150\\,\\text{g}$.\n2. Mass of Hydrogen $= 0.150 \\times \\frac{2}{18} = 0.0167\\,\\text{g}$.\n3. Mass of Nitrogen $= 0.250 - (0.150 + 0.0167) = 0.0833\\,\\text{g}$.\n4. Percentage of Nitrogen $= \\frac{0.0833}{0.250} \\times 100 \\approx 33.3\\%$. The nearest integer is 33.',
    common_mistake: 'Failing to check that the compound consists only of C, H, and N, or making arithmetic mistakes in the carbon fraction ($12/44$) and hydrogen fraction ($2/18$).',
    concept_slugs: ['mole-concept-advanced', 'empirical-molecular-formula']
  }
];

async function seed() {
  try {
    console.log('Starting Mole Concept Seeding...');
    
    // Look up chapter dynamically
    const chapterRes = await pool.query("SELECT id FROM chapters WHERE name = 'Mole Concept'");
    if (chapterRes.rows.length === 0) {
      console.error("Chapter 'Mole Concept' not found in chapters table.");
      process.exit(1);
    }
    const chapterId = chapterRes.rows[0].id;
    console.log(`Found Mole Concept chapter with ID: ${chapterId}`);

    console.log(`Clearing old questions for Chapter ${chapterId}...`);
    await pool.query('DELETE FROM questions WHERE chapter_id = $1', [chapterId]);
    
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
        [chapterId, c.name, c.slug, c.description, c.formula_ids, c.pattern_group]
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
          chapterId,
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

    console.log('Mole Concept seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

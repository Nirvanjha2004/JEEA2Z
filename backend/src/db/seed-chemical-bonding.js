import 'dotenv/config';
import pool from './index.js';

const concepts = [
  {
    name: 'Lewis Structures & Formal Charge',
    slug: 'lewis-structures',
    description: 'Octet rule, Lewis dot representations, formal charge calculations, resonance structures and resonance hybrid stabilities.',
    formula_ids: [],
    pattern_group: 'lewis-structures'
  },
  {
    name: 'VSEPR Theory & Molecular Geometry',
    slug: 'vsepr-geometry',
    description: 'VSEPR theory postulates, predicting molecular shapes/geometries, bond pair and lone pair counts, and bond angle comparisons.',
    formula_ids: [],
    pattern_group: 'vsepr-geometry'
  },
  {
    name: 'Hybridization & Orbital Overlap',
    slug: 'hybridization',
    description: 'Valence bond theory, hybridization of orbitals (sp, sp2, sp3, sp3d, sp3d2, sp3d3), sigma and pi bonds, and d-orbital involvement.',
    formula_ids: [],
    pattern_group: 'hybridization'
  },
  {
    name: 'Dipole Moment & Molecular Polarity',
    slug: 'dipole-moment',
    description: 'Dipole moment definition, vector addition of bond dipoles, identifying polar and non-polar molecules, and geometric isomer polarities.',
    formula_ids: [],
    pattern_group: 'dipole-moment'
  },
  {
    name: 'Molecular Orbital Theory',
    slug: 'mot',
    description: 'LCAO method, molecular orbital configurations (up to Z=20), calculating bond order, predicting stability and magnetic properties.',
    formula_ids: [],
    pattern_group: 'mot'
  },
  {
    name: 'Hydrogen Bonding & Intermolecular Forces',
    slug: 'intermolecular-forces',
    description: 'Intermolecular and intramolecular hydrogen bonding, dipole-dipole, dipole-induced dipole, and London dispersion forces.',
    formula_ids: [],
    pattern_group: 'intermolecular-forces'
  },
  {
    name: 'Ionic Character, Lattice Energy & Fajan\'s Rules',
    slug: 'ionic-fajans',
    description: 'Born-Haber cycle, factors affecting lattice energy, hydration energy, polarization, and Fajan\'s rules for covalent character.',
    formula_ids: [],
    pattern_group: 'ionic-fajans'
  },
  {
    name: 'Multi-Concept / Advanced',
    slug: 'bonding-advanced',
    description: 'Tricky/advanced questions combining multiple concepts (e.g. back bonding, Bent\'s rule, coplanarity of atoms, solid-state structures).',
    formula_ids: [],
    pattern_group: 'bonding-advanced'
  }
];

const questions = [
  // ==========================================
  // PATTERN GROUP 1: LEWIS STRUCTURES & FORMAL CHARGE (8 Qs)
  // ==========================================
  {
    title: 'The formal charges on the three oxygen atoms labeled 1, 2, and 3 in the ozone ($\\text{O}_3$) molecule are respectively:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Identify the Lewis structure of ozone: central oxygen forms a double bond with one oxygen and a single/coordinate bond with the other.',
    correct_answer: 'B',
    pattern_group: 'lewis-structures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$0, 0, 0$',
      B: '$+1, 0, -1$',
      C: '$0, +1, -1$',
      D: '$-1, +1, 0$'
    },
    solution_text: 'In the Lewis structure of ozone (O3), the central oxygen atom (labeled 1) has 3 bond pairs and 1 lone pair: Formal Charge = $6 - 2 - 3 = +1$.\nThe double-bonded oxygen atom (labeled 2) has 2 bond pairs and 2 lone pairs: Formal Charge = $6 - 4 - 2 = 0$.\nThe single-bonded oxygen atom (labeled 3) has 1 bond pair and 3 lone pairs: Formal Charge = $6 - 6 - 1 = -1$.\nThus, the formal charges are $+1, 0, -1$. Option B is correct.',
    common_mistake: 'Failing to allocate lone pairs properly, leading to zero charge on all atoms.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'The number of coordinate covalent bonds in a Nitric Acid ($\\text{HNO}_3$) molecule is ________.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Write the Lewis structure of HNO3. Nitrogen can only form 4 bonds because it has no d-orbitals.',
    correct_answer: '1',
    pattern_group: 'lewis-structures',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'In HNO3, Nitrogen forms: \n1. A single bond with the -OH group.\n2. A double bond with one Oxygen atom.\n3. A coordinate covalent (dative) bond with the remaining Oxygen atom (which behaves as a single bond but is formed by sharing Nitrogen\'s lone pair).\nThus, there is exactly 1 coordinate covalent bond in HNO3.',
    common_mistake: 'Thinking Nitrogen can form 5 covalent bonds like Phosphorus, which is impossible due to lack of valence d-orbitals.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'The formal charge on the Carbon atom in Carbonate ion ($\\text{CO}_3^{2-}$) is ________.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Use the formula: $\\text{Formal Charge} = V - L - B/2$, where V is valence electrons, L is lone pair electrons, and B is bonding electrons.',
    correct_answer: '0',
    pattern_group: 'lewis-structures',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'The Carbon atom in Carbonate ($\\text{CO}_3^{2-}$) has 4 valence electrons. In its Lewis structure, it forms 4 covalent bonds (one double bond and two single bonds) and has no lone pairs.\n$\\text{Formal Charge} = V - L - \\frac{B}{2} = 4 - 0 - \\frac{8}{2} = 0$.',
    common_mistake: 'Assuming the net charge of -2 is shared with Carbon, giving it a non-zero formal charge.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'Which of the following molecules has an expanded octet (hypervalent species) around its central atom?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Hypervalent species have more than 8 valence electrons around the central atom.',
    correct_answer: 'C',
    pattern_group: 'lewis-structures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{BF}_3$',
      B: '$\\text{CH}_4$',
      C: '$\\text{SF}_6$',
      D: '$\\text{NH}_3$'
    },
    solution_text: 'Let\'s check the valence electrons around the central atom:\n- $\\text{BF}_3$: Boron has 6 electrons (electron-deficient).\n- $\\text{CH}_4$: Carbon has 8 electrons (octet complete).\n- $\\text{SF}_6$: Sulphur has 12 electrons (expanded octet/hypervalent).\n- $\\text{NH}_3$: Nitrogen has 8 electrons (octet complete).\nThus, $\\text{SF}_6$ is hypervalent. Option C is correct.',
    common_mistake: 'Thinking nitrogen in NH3 expands its octet due to the lone pair.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'The total number of valence electrons in the Nitrate ion ($\\text{NO}_3^-$) is ________.',
    difficulty: 'easy',
    type: 'practice',
    notes: 'Sum the valence electrons of N (group 15), three O (group 16) atoms, and add 1 for the negative charge.',
    correct_answer: '24',
    pattern_group: 'lewis-structures',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Valence electrons:\n- Nitrogen (N): 5 electrons\n- Oxygen (O): $3 \\times 6 = 18$ electrons\n- Negative charge: 1 electron\nTotal valence electrons $= 5 + 18 + 1 = 24$.',
    common_mistake: 'Subtracting 1 electron for the negative charge instead of adding it, getting 22.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'In Nitrous Oxide ($\\text{N}_2\\text{O}$), the resonance hybrid contains contributing structures. For the resonance structure $\\text{:N}\\equiv\\text{N-O:::}$, the formal charges on the central Nitrogen, terminal Nitrogen, and Oxygen are respectively:',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: 'A',
    pattern_group: 'lewis-structures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$+1, 0, -1$',
      B: '$0, +1, -1$',
      C: '$+1, -1, 0$',
      D: '$-1, +1, 0$'
    },
    solution_text: 'For the structure $\\text{:N}\\equiv\\text{N-O:::}$:\n- Terminal Nitrogen has 1 lone pair (2 electrons) and 3 bonds (6 bonding electrons). Formal charge $= 5 - 2 - 3 = 0$.\n- Central Nitrogen has 4 bonds (8 bonding electrons) and 0 lone pairs. Formal charge $= 5 - 0 - 4 = +1$.\n- Oxygen has 3 lone pairs (6 electrons) and 1 bond (2 bonding electrons). Formal charge $= 6 - 6 - 1 = -1$.\nThus, formal charges are $+1, 0, -1$ (central, terminal, oxygen: $+1, 0, -1$). Option A is correct.',
    common_mistake: 'Swapping the formal charges of the central and terminal nitrogen atoms.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'The correct order of carbon-oxygen bond length in $\\text{CO}$, $\\text{CO}_2$ and $\\text{CO}_3^{2-}$ is:',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Bond length is inversely proportional to bond order. Find the bond order for each species.',
    correct_answer: 'B',
    pattern_group: 'lewis-structures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{CO} > \\text{CO}_2 > \\text{CO}_3^{2-}$',
      B: '$\\text{CO}_3^{2-} > \\text{CO}_2 > \\text{CO}$',
      C: '$\\text{CO}_2 > \\text{CO}_3^{2-} > \\text{CO}$',
      D: '$\\text{CO}_3^{2-} > \\text{CO} > \\text{CO}_2$'
    },
    solution_text: 'Let\'s calculate the bond orders:\n- $\\text{CO}$: Has a triple bond, Bond Order = 3.\n- $\\text{CO}_2$: Has two double bonds, Bond Order = 2.\n- $\\text{CO}_3^{2-}$: Has resonance. Total bonds = 4, resonating structures = 3. Bond Order = $4/3 \\approx 1.33$.\nSince Bond Length $\\propto \\frac{1}{\\text{Bond Order}}$, the decreasing order of bond order is $\\text{CO} > \\text{CO}_2 > \\text{CO}_3^{2-}$, which means the increasing order of bond length is:\n$\\text{CO}_3^{2-} > \\text{CO}_2 > \\text{CO}$.\nOption B is correct.',
    common_mistake: 'Assuming CO has a single bond because it is a simple diatomic molecule, leading to wrong order.',
    concept_slugs: ['lewis-structures']
  },
  {
    title: 'Which of the following resonance structures of Formate ion ($\\text{HCOO}^-$) is the most stable and contributes maximum to the resonance hybrid?',
    difficulty: 'hard',
    type: 'advanced',
    correct_answer: 'A',
    pattern_group: 'lewis-structures',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'A structure with one double bond $\\text{C=O}$ and one single bond $\\text{C-O^-}$ with octets complete on all atoms.',
      B: 'A structure with positive charge on carbon and negative charges on both oxygens.',
      C: 'A structure with positive charge on oxygen and negative charge on carbon.',
      D: 'A structure with incomplete octet on Carbon and no charge separation.'
    },
    solution_text: 'The stability of resonance structures is determined by:\n1. Number of covalent bonds (more bonds = more stable).\n2. Complete octets on all atoms.\n3. Separation of charge (less charge separation = more stable).\n4. Negative charge on more electronegative atoms (Oxygen).\nStructure A has complete octets, max bonds, and negative charge on oxygen. Option A is the most stable and contributes maximum. Option A is correct.',
    common_mistake: 'Selecting structures with charge separation thinking they look symmetrical.',
    concept_slugs: ['lewis-structures']
  },

  // ==========================================
  // PATTERN GROUP 2: VSEPR THEORY & MOLECULAR GEOMETRY (8 Qs)
  // ==========================================
  {
    title: 'According to VSEPR theory, the geometry of xenon tetrafluoride ($\\text{XeF}_4$) is:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Calculate steric number: valence electrons of Xe (8) + 4 monovalent F atoms = 12 electrons = 6 pairs. Electron geometry is octahedral.',
    correct_answer: 'D',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Tetrahedral',
      B: 'Octahedral',
      C: 'Trigonal bipyramidal',
      D: 'Square planar'
    },
    solution_text: 'For $\\text{XeF}_4$:\n- Steric Number $= \\frac{1}{2}(V + M - C + A) = \\frac{1}{2}(8 + 4 - 0 + 0) = 6$ (electron geometry is octahedral).\n- The central Xe atom has 4 bond pairs and 2 lone pairs.\n- According to VSEPR, the two lone pairs occupy trans positions to minimize lone pair-lone pair repulsions.\n- The resulting molecular shape/geometry is square planar.\nOption D is correct.',
    common_mistake: 'Confusing electron geometry (octahedral) with molecular shape (square planar).',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'The number of lone pairs of electrons on the central Xenon atom in $\\text{XeOF}_4$ is ________.',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Xe has 8 valence electrons. Oxygen forms 1 double bond (uses 2 electrons), and 4 fluorines form single bonds (use 4 electrons). Remaining electrons form lone pairs.',
    correct_answer: '1',
    pattern_group: 'vsepr-geometry',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Valence electrons of Xenon (Xe) $= 8$.\n- 4 Fluorine atoms share 4 electrons to form 4 single bonds.\n- 1 Oxygen atom shares 2 electrons to form 1 double bond.\n- Total shared/bonding electrons $= 4 + 2 = 6$ electrons.\n- Remaining unshared electrons $= 8 - 6 = 2$ electrons $= 1$ lone pair.\nThus, there is 1 lone pair on Xenon in $\\text{XeOF}_4$.',
    common_mistake: 'Counting Oxygen as a monovalent atom in steric number calculation, leading to 2 lone pairs.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'The shape of the triiodide ion ($\\text{I}_3^-$) according to VSEPR theory is:',
    difficulty: 'medium',
    type: 'concept',
    notes: 'The central Iodine atom has 7 valence electrons + 1 from negative charge. It forms 2 single bonds with the outer Iodine atoms.',
    correct_answer: 'C',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Bent',
      B: 'Trigonal planar',
      C: 'Linear',
      D: 'T-shaped'
    },
    solution_text: 'For the central Iodine atom in $\\text{I}_3^-$:\n- Steric Number $= \\frac{1}{2} (7 + 2 + 1) = 5$ (trigonal bipyramidal electron geometry).\n- Number of bond pairs $= 2$ (two outer I atoms).\n- Number of lone pairs $= 5 - 2 = 3$ lone pairs.\n- The 3 lone pairs occupy equatorial positions to minimize repulsions. The two bond pairs are axial.\n- The resulting molecular geometry is linear (bond angle $180^\\circ$).\nOption C is correct.',
    common_mistake: 'Comparing it to water and assuming it is bent (like H2O) since it has lone pairs.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'The correct order of bond angles in $\\text{CH}_4$, $\\text{NH}_3$, and $\\text{H}_2\\text{O}$ is ___ > ___ > ___.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'CH4' }, { answer: 'NH3' }, { answer: 'H2O' }]),
    solution_text: 'All three central atoms ($\\text{C}, \\text{N}, \\text{O}$) are $\\text{sp}^3$ hybridized with a basic tetrahedral electron geometry (ideal angle $109.5^\\circ$):\n- $\\text{CH}_4$ has 0 lone pairs. Bond angle $= 109.5^\\circ$.\n- $\\text{NH}_3$ has 1 lone pair. Repulsion decreases angle to $\\approx 107^\\circ$.\n- $\\text{H}_2\\text{O}$ has 2 lone pairs. Stronger lone pair-lone pair repulsion decreases angle further to $\\approx 104.5^\\circ$.\nThus, the order of bond angles is $\\text{CH}_4 > \\text{NH}_3 > \\text{H}_2\\text{O}$.',
    common_mistake: 'Putting water first because it is a smaller molecule.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'In the solid state, Phosphorus pentachloride ($\\text{PCl}_5$) exists as an ionic compound. The geometries of the cationic and anionic species in solid $\\text{PCl}_5$ are respectively:',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: 'A',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Tetrahedral and Octahedral',
      B: 'Trigonal bipyramidal and Octahedral',
      C: 'Tetrahedral and Square planar',
      D: 'Linear and Pyramidal'
    },
    solution_text: 'Solid $\\text{PCl}_5$ exists as $\\text{[PCl}_4\\text{]}^+ \\text{[PCl}_6\\text{]}^-$:\n- For the cation $\\text{[PCl}_4\\text{]}^+$: Phosphorus has 4 bond pairs and 0 lone pairs $\\implies$ tetrahedral geometry.\n- For the anion $\\text{[PCl}_6\\text{]}^-$: Phosphorus has 6 bond pairs and 0 lone pairs $\\implies$ octahedral geometry.\nOption A is correct.',
    common_mistake: 'Assuming the solid has trigonal bipyramidal geometry, which is only true for the gaseous and liquid states.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'For the sulfur tetrafluoride ($\\text{SF}_4$) molecule, the number of bond pairs and lone pairs on the central sulfur atom are respectively ________ and ________.',
    difficulty: 'easy',
    type: 'practice',
    correct_answer: '',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '4' }, { answer: '1' }]),
    solution_text: 'For Sulfur (S) in $\\text{SF}_4$:\n- Valence electrons $= 6$.\n- 4 Fluorines form 4 single bonds (uses 4 electrons, leaving 2 unshared).\n- Bond pairs $= 4$, Lone pairs $= 1$ (2 electrons).\nThus, the answer is 4 and 1.',
    common_mistake: 'Assuming 0 lone pairs because Sulfur is in group 16 and can expand its octet to 6 bonds.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'Although both Nitrogen and Phosphorus belong to the same group, the bond angle in $\\text{NF}_3$ ($102.3^\\circ$) is smaller than that in $\\text{NH}_3$ ($107.8^\\circ$), but the bond angle in $\\text{PF}_3$ ($97.8^\\circ$) is larger than in $\\text{PH}_3$ ($93.6^\\circ$). The correct explanation for the bond angle of $\\text{NF}_3 < \\text{NH}_3$ is:',
    difficulty: 'hard',
    type: 'advanced',
    correct_answer: 'B',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Fluorine has larger size than Hydrogen, causing steric crowding.',
      B: 'High electronegativity of Fluorine pulls the bonding pair electrons away from Nitrogen, reducing bond pair-bond pair repulsions.',
      C: 'Nitrogen undergoes back bonding with Fluorine.',
      D: 'Fluorine has lone pairs that do not participate in repulsions.'
    },
    solution_text: 'In $\\text{NF}_3$, Fluorine is highly electronegative and attracts the N-F bonding electron pairs towards itself. This increases the distance between the bonding pairs near the Nitrogen atom, which reduces the bond pair-bond pair repulsion, allowing the lone pair to compress the F-N-F angle more. In contrast, in $\\text{NH}_3$, the electron density is closer to Nitrogen, leading to stronger bond pair-bond pair repulsions and a larger angle. Option B is correct.',
    common_mistake: 'Attributing the trend to steric size effects, which would make NF3 angle larger.',
    concept_slugs: ['vsepr-geometry']
  },
  {
    title: 'Which of the following pairs of species is NOT isostructural (does not have the same molecular shape)?',
    difficulty: 'hard',
    type: 'advanced',
    correct_answer: 'D',
    pattern_group: 'vsepr-geometry',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{CO}_3^{2-}$ and $\\text{NO}_3^-$',
      B: '$\\text{PCl}_4^+$ and $\\text{SiCl}_4$',
      C: '$\\text{XeF}_2$ and $\\text{CO}_2$',
      D: '$\\text{SF}_4$ and $\\text{SiF}_4$'
    },
    solution_text: 'Let\'s check the shapes of each pair:\n- Option A: $\\text{CO}_3^{2-}$ and $\\text{NO}_3^-$ are both trigonal planar (isostructural).\n- Option B: $\\text{PCl}_4^+$ and $\\text{SiCl}_4$ are both tetrahedral (isostructural).\n- Option C: $\\text{XeF}_2$ (2 bp, 3 lp $\\implies$ linear) and $\\text{CO}_2$ (2 bp, 0 lp $\\implies$ linear) are both linear (isostructural).\n- Option D: $\\text{SF}_4$ (4 bp, 1 lp $\\implies$ see-saw) and $\\text{SiF}_4$ (4 bp, 0 lp $\\implies$ tetrahedral) are NOT isostructural.\nOption D is correct.',
    common_mistake: 'Assuming XeF2 and CO2 are not isostructural because Xenon has 3 lone pairs, forgetting that those lone pairs are equatorial and the molecule is linear.',
    concept_slugs: ['vsepr-geometry']
  },

  // ==========================================
  // PATTERN GROUP 3: HYBRIDIZATION & ORBITAL OVERLAP (8 Qs)
  // ==========================================
  {
    title: 'The hybridization of the Nitrogen atom in $\\text{NO}_2^+$, $\\text{NO}_2^-$, and $\\text{NO}_3^-$ are respectively:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Calculate steric number for each species: $\\text{NO}_2^+$ (2 bp, 0 lp), $\\text{NO}_2^-$ (2 bp, 1 lp), $\\text{NO}_3^-$ (3 bp, 0 lp).',
    correct_answer: 'B',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{sp}^2, \\text{sp}, \\text{sp}^3$',
      B: '$\\text{sp}, \\text{sp}^2, \\text{sp}^2$',
      C: '$\\text{sp}, \\text{sp}^2, \\text{sp}^3$',
      D: '$\\text{sp}^2, \\text{sp}^2, \\text{sp}^3$'
    },
    solution_text: 'Let\'s find the steric number (SN) for the central Nitrogen atom:\n- $\\text{NO}_2^+$: $\\text{SN} = 2$ (2 $\\sigma$ bonds, 0 lone pairs) $\\implies \\text{sp}$ hybridization.\n- $\\text{NO}_2^-$: $\\text{SN} = 3$ (2 $\\sigma$ bonds, 1 lone pair) $\\implies \\text{sp}^2$ hybridization.\n- $\\text{NO}_3^-$: $\\text{SN} = 3$ (3 $\\sigma$ bonds, 0 lone pairs) $\\implies \\text{sp}^2$ hybridization.\nThus, the hybridizations are $\\text{sp}, \\text{sp}^2, \\text{sp}^2$. Option B is correct.',
    common_mistake: 'Thinking NO3- is sp3 because it has 3 oxygens, forgetting it has no lone pairs.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The number of $\\sigma$ and $\\pi$ bonds present in a molecule of Pyrophosphoric Acid ($\\text{H}_4\\text{P}_2\\text{O}_7$) are respectively ________ and ________.',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Write the structure of H4P2O7: it has two P atoms connected by a P-O-P bridge. Each P has one P=O bond and two P-OH bonds.',
    correct_answer: '',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '12' }, { answer: '2' }]),
    solution_text: 'The structure of Pyrophosphoric acid is $(\\text{HO})_2\\text{P}(=\\text{O})-\\text{O}-\\text{P}(=\\text{O})(\\text{OH})_2$:\n- Single bonds (each is 1 $\\sigma$ bond):\n  - 4 $\\text{O-H}$ bonds\n  - 4 $\\text{P-OH}$ bonds\n  - 2 $\\text{P-O}$ (bridge) bonds\n- Double bonds (each is 1 $\\sigma$ + 1 $\\pi$ bond):\n  - 2 $\\text{P=O}$ bonds\n- Total $\\sigma$ bonds $= 4 + 4 + 2 + 2 = 12$.\n- Total $\\pi$ bonds $= 2$ (from the two $\\text{P=O}$ bonds).\nThus, the answer is 12 and 2.',
    common_mistake: 'Forgetting to count the O-H single bonds in the total sigma bonds.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The percentage of s-character in the hybrid orbitals of $\\text{sp}$, $\\text{sp}^2$, and $\\text{sp}^3$ hybridized carbon atoms are respectively ________ $\\%$, ________ $\\%$, and ________ $\\%$.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '50' }, { answer: '33.3' }, { answer: '25' }]),
    solution_text: 'The percentage of s-character is calculated by:\n$\\text{s-character (\\%)} = \\frac{1}{\\text{Total number of orbitals}} \\times 100$\n- For $\\text{sp}$: 1 s-orbital out of 2. $\\text{s}\\% = 1/2 \\times 100 = 50\\%$.\n- For $\\text{sp}^2$: 1 s-orbital out of 3. $\\text{s}\\% = 1/3 \\times 100 = 33.3\\%$.\n- For $\\text{sp}^3$: 1 s-orbital out of 4. $\\text{s}\\% = 1/4 \\times 100 = 25\\%$.\nThus, the values are 50, 33.3, and 25.',
    common_mistake: 'Using incorrect rounding or integers for sp2, e.g. writing 33 instead of 33.3.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The state of hybridization of carbon atoms in Ethyne, Ethene, and Ethane are respectively:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Identify the carbon-carbon bond types: ethyne (triple bond), ethene (double bond), ethane (single bond).',
    correct_answer: 'B',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{sp}^3, \\text{sp}^2, \\text{sp}$',
      B: '$\\text{sp}, \\text{sp}^2, \\text{sp}^3$',
      C: '$\\text{sp}^2, \\text{sp}, \\text{sp}^3$',
      D: '$\\text{sp}, \\text{sp}^3, \\text{sp}^2$'
    },
    solution_text: 'Let\'s analyze the bonds of each carbon atom:\n- Ethyne ($\\text{CH}\\equiv\\text{CH}$): Each carbon forms 2 $\\sigma$ bonds $\\implies \\text{sp}$ hybridization.\n- Ethene ($\\text{CH}_2=\\text{CH}_2$): Each carbon forms 3 $\\sigma$ bonds $\\implies \\text{sp}^2$ hybridization.\n- Ethane ($\\text{CH}_3-\\text{CH}_3$): Each carbon forms 4 $\\sigma$ bonds $\\implies \\text{sp}^3$ hybridization.\nThus, option B is correct.',
    common_mistake: 'Reversing the order and picking option A.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The number of $\\text{d}\\pi\\text{-p}\\pi$ bonds in Sulfur trioxide ($\\text{SO}_3$) molecule is ________.',
    difficulty: 'medium',
    type: 'practice',
    notes: 'In SO3, S is sp2 hybridized. It has 6 valence electrons and forms 3 double bonds. Analyze the orbitals participating in pi bonding.',
    correct_answer: '2',
    pattern_group: 'hybridization',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'In $\\text{SO}_3$:\n- Sulfur has valence configuration $3\\text{s}^2 3\\text{p}^4$ and has empty $3\\text{d}$ orbitals. Oxygen has $2\\text{p}$ valence orbitals.\n- Sulfur undergoes $\\text{sp}^2$ hybridization to form 3 $\\sigma$ bonds.\n- The unhybridized $3\\text{p}_z$ orbital of Sulfur overlaps with a $2\\text{p}_z$ orbital of one Oxygen atom to form one $\\text{p}\\pi\\text{-p}\\pi$ bond.\n- The two remaining $\\pi$ bonds are formed by overlapping Sulfur\'s empty $3\\text{d}$ orbitals with the $2\\text{p}$ orbitals of the other two Oxygen atoms.\n- Thus, there are exactly 2 $\\text{d}\\pi\\text{-p}\\pi$ bonds in $\\text{SO}_3$.',
    common_mistake: 'Assuming all three pi bonds are p\\pi-p\\pi, or that they are all d\\pi-p\\pi.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The number of $\\sigma$ and $\\pi$ bonds in Tetracyanoethylene ($\\text{C}_6\\text{N}_4$) are respectively ________ and ________.',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: '',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: '9' }, { answer: '9' }]),
    solution_text: 'Tetracyanoethylene has the structure: $(\\text{N}\\equiv\\text{C})_2\\text{C}=\\text{C}(\\text{C}\\equiv\\text{N})_2$.\n- Sigma bonds:\n  - 1 $\\text{C=C}$ bond $\\implies 1 \\sigma$\n  - 4 $\\text{C-C}$ bonds $\\implies 4 \\sigma$\n  - 4 $\\text{C}\\equiv\\text{N}$ bonds $\\implies 4 \\sigma$\n  - Total $\\sigma$ bonds $= 1 + 4 + 4 = 9$.\n- Pi bonds:\n  - 1 $\\text{C=C}$ bond $\\implies 1 \\pi$\n  - 4 $\\text{C}\\equiv\\text{N}$ bonds $\\implies 4 \\times 2 = 8 \\pi$\n  - Total $\\pi$ bonds $= 1 + 8 = 9$.\nThus, the answer is 9 and 9.',
    common_mistake: 'Counting C-N triple bonds as single or double bonds, leading to lower pi bond counts.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'The state of hybridization of the central Iodine atom in $\\text{IF}_7$ is:',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Iodine has 7 valence electrons and forms 7 single bonds with Fluorine.',
    correct_answer: 'D',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{sp}^3\\text{d}$',
      B: '$\\text{sp}^3\\text{d}^2$',
      C: '$\\text{d}^2\\text{sp}^3$',
      D: '$\\text{sp}^3\\text{d}^3$'
    },
    solution_text: 'For Iodine in $\\text{IF}_7$:\n- Steric Number $= 7$ (7 bond pairs, 0 lone pairs).\n- Hybridization corresponding to steric number 7 is $\\text{sp}^3\\text{d}^3$ (pentagonal bipyramidal geometry).\nOption D is correct.',
    common_mistake: 'Confusing it with octahedral sp3d2, which is for steric number 6.',
    concept_slugs: ['hybridization']
  },
  {
    title: 'In the trigonal bipyramidal molecule $\\text{PCl}_5$, which of the following d-orbitals of Phosphorus participates in the $\\text{sp}^3\\text{d}$ hybridization?',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'The d-orbital used in trigonal bipyramidal hybridization must align along the z-axis (axial bonds).',
    correct_answer: 'A',
    pattern_group: 'hybridization',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{d}_{z^2}$',
      B: '$\\text{d}_{x^2-y^2}$',
      C: '$\\text{d}_{xy}$',
      D: '$\\text{d}_{yz}$'
    },
    solution_text: 'In trigonal bipyramidal $\\text{sp}^3\\text{d}$ hybridization, the hybrid orbitals are formed by mixing $\\text{s, p}_x, \\text{p}_y, \\text{p}_z$ and $\\text{d}_{z^2}$ orbitals. The $\\text{d}_{z^2}$ orbital is chosen because the axial bonds lie along the z-axis, requiring an orbital with density concentrated along this axis. Option A is correct.',
    common_mistake: 'Choosing $\\text{d}_{x^2-y^2}$, which is actually used in octahedral $\\text{sp}^3\\text{d}^2$ or square planar $\\text{dsp}^2$ hybridization.',
    concept_slugs: ['hybridization']
  },

  // ==========================================
  // PATTERN GROUP 4: DIPOLE MOMENT & MOLECULAR POLARITY (8 Qs)
  // ==========================================
  {
    title: 'Although Nitrogen is more electronegative than Phosphorus, the dipole moment of ammonia ($\\text{NH}_3$, $1.47\\,\\text{D}$) is significantly larger than that of nitrogen trifluoride ($\\text{NF}_3$, $0.23\\,\\text{D}$). This is because:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Consider the direction of the lone pair dipole relative to the bond dipoles in both molecules.',
    correct_answer: 'B',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Nitrogen is $\\text{sp}^3$ hybridized in $\\text{NH}_3$ but $\\text{sp}^2$ in $\\text{NF}_3$.',
      B: 'In $\\text{NH}_3$, the orbital dipole due to the lone pair and the net bond dipoles are in the same direction, whereas in $\\text{NF}_3$ they are in opposite directions.',
      C: 'The N-F bonds are non-polar.',
      D: 'The molecular geometry of $\\text{NF}_3$ is trigonal planar, making it symmetrical.'
    },
    solution_text: 'Both $\\text{NH}_3$ and $\\text{NF}_3$ have trigonal pyramidal geometries with one lone pair on Nitrogen:\n- In $\\text{NH}_3$, Nitrogen is more electronegative than Hydrogen, so bond dipoles point from H to N. The lone pair dipole also points outwards from Nitrogen. They reinforce each other.\n- In $\\text{NF}_3$, Fluorine is more electronegative than Nitrogen, so bond dipoles point from N to F. The lone pair dipole points in the opposite direction. They partially cancel out.\nThus, the dipole moment of $\\text{NH}_3$ is much larger. Option B is correct.',
    common_mistake: 'Assuming that since fluorine is the most electronegative element, NF3 must have a larger dipole moment.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'Which of the following molecules has a net dipole moment of zero?',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Look for highly symmetrical molecules where the individual bond dipoles cancel each other out.',
    correct_answer: 'C',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{NF}_3$',
      B: '$\\text{SF}_4$',
      C: '$\\text{BF}_3$',
      D: '$\\text{H}_2\\text{O}$'
    },
    solution_text: 'Let\'s check the symmetry of the molecules:\n- $\\text{NF}_3$: Pyramidal, polar ($\\mu \\ne 0$).\n- $\\text{SF}_4$: See-saw shape, unsymmetrical, polar ($\\mu \\ne 0$).\n- $\\text{BF}_3$: Trigonal planar, completely symmetrical, three B-F bond dipoles cancel each other out ($\\mu = 0$).\n- $\\text{H}_2\\text{O}$: Bent, polar ($\\mu \\ne 0$).\nThus, $\\text{BF}_3$ has a net dipole moment of zero. Option C is correct.',
    common_mistake: 'Assuming BF3 is polar because Fluorine is highly electronegative.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'The order of dipole moments of Ortho, Meta, and Para isomers of Dichlorobenzene is: ________ > ________ > ________.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'ortho' }, { answer: 'meta' }, { answer: 'para' }]),
    solution_text: 'The net dipole moment is the vector sum of the two C-Cl dipoles:\n$\\mu_{\\text{net}} = \\sqrt{\\mu_1^2 + \\mu_2^2 + 2\\mu_1\\mu_2\\cos\\theta}$.\n- For Ortho: $\\theta = 60^\\circ \\implies \\cos 60^\\circ = 0.5$ (maximum vector sum).\n- For Meta: $\\theta = 120^\\circ \\implies \\cos 120^\\circ = -0.5$.\n- For Para: $\\theta = 180^\\circ \\implies \\cos 180^\\circ = -1$ (complete cancellation, $\\mu = 0$).\nThus, the order of dipole moments is Ortho > Meta > Para.',
    common_mistake: 'Writing the order in reverse (Para > Meta > Ortho).',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'A dipole moment is expressed in Debye units (D). $1\\,\\text{D}$ is equal to ________ $\\times 10^{-30}\\,\\text{C\\cdot m}$ (Coulomb meters). (Round to two decimal places)',
    difficulty: 'medium',
    type: 'concept',
    correct_answer: '3.33',
    pattern_group: 'dipole-moment',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'By definition, $1\\,\\text{Debye (D)} = 3.33564 \\times 10^{-30}\\,\\text{C\\cdot m}$. Rounding to two decimal places gives 3.33.',
    common_mistake: 'Using cgs units conversion factor ($10^{-18}\\,\\text{esu\\cdot cm}$) directly as SI conversion factor.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'Which of the following isomers of 1,2-dichloroethene has a non-zero dipole moment?',
    difficulty: 'easy',
    type: 'practice',
    notes: 'Draw the cis and trans structures. Identify which structure has opposing vectors that cancel out.',
    correct_answer: 'A',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Cis-1,2-dichloroethene',
      B: 'Trans-1,2-dichloroethene',
      C: 'Both Cis and Trans isomers',
      D: 'Neither Cis nor Trans isomer'
    },
    solution_text: 'Let\'s analyze the structures:\n- In Cis-1,2-dichloroethene, both chlorine atoms are on the same side of the double bond. The C-Cl dipoles reinforce each other, resulting in a net dipole moment ($\\mu \\approx 1.9\\,\\text{D}$).\n- In Trans-1,2-dichloroethene, the chlorine atoms are on opposite sides. The C-Cl dipoles point in opposite directions and cancel out completely ($\\mu = 0$).\nThus, only the Cis isomer has a non-zero dipole moment. Option A is correct.',
    common_mistake: 'Thinking trans isomers are always polar.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'The correct decreasing order of dipole moments of Hydrogen halides is:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Dipole moment $\\mu = q \\times d$. In hydrogen halides, the electronegativity difference (charge q) decreases dramatically down the group, which dominates over the bond length (distance d) change.',
    correct_answer: 'A',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{HF} > \\text{HCl} > \\text{HBr} > \\text{HI}$',
      B: '$\\text{HI} > \\text{HBr} > \\text{HCl} > \\text{HF}$',
      C: '$\\text{HCl} > \\text{HF} > \\text{HBr} > \\text{HI}$',
      D: '$\\text{HF} > \\text{HI} > \\text{HCl} > \\text{HBr}$'
    },
    solution_text: 'Although the bond length increases from HF to HI, the electronegativity of the halogen decreases very rapidly (F: 4.0, Cl: 3.0, Br: 2.8, I: 2.5). The charge separation ($q$) factor dominates the distance ($d$) factor.\nTherefore, the dipole moment order follows the electronegativity trend:\n$\\text{HF} > \\text{HCl} > \\text{HBr} > \\text{HI}$.\nOption A is correct.',
    common_mistake: 'Putting HI first thinking the large size of Iodine increases the bond distance enough to make it most polar.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'Among $\\text{SF}_4$ and $\\text{XeF}_2$, which statement is correct regarding their dipole moments?',
    difficulty: 'hard',
    type: 'advanced',
    correct_answer: 'B',
    pattern_group: 'dipole-moment',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Both are polar molecules.',
      B: '$\\text{SF}_4$ is polar and $\\text{XeF}_2$ is non-polar.',
      C: '$\\text{SF}_4$ is non-polar and $\\text{XeF}_2$ is polar.',
      D: 'Both are non-polar molecules.'
    },
    solution_text: '- $\\text{SF}_4$: Steric Number = 5 (4 bp, 1 lp). Shape is see-saw. Due to the asymmetric presence of the equatorial lone pair, the bond dipoles do not cancel. $\\mu \\ne 0$ (polar).\n- $\\text{XeF}_2$: Steric Number = 5 (2 bp, 3 lp). Shape is linear. The 3 lone pairs are equatorial (canceling at $120^\\circ$), and the 2 F atoms are axial (canceling at $180^\\circ$). $\\mu = 0$ (non-polar).\nOption B is correct.',
    common_mistake: 'Thinking XeF2 is polar because it has lone pairs, ignoring its linear symmetry.',
    concept_slugs: ['dipole-moment']
  },
  {
    title: 'The dipole moment of chlorobenzene is $1.5\\,\\text{D}$. The dipole moment of meta-dichlorobenzene is ________ D. (Round to two decimal places)',
    difficulty: 'hard',
    type: 'advanced',
    correct_answer: '1.5',
    pattern_group: 'dipole-moment',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'For meta-dichlorobenzene, the two C-Cl dipoles make an angle of $120^\\circ$:\n$\\mu_{\\text{meta}} = \\sqrt{\\mu^2 + \\mu^2 + 2\\mu^2\\cos 120^\\circ}$.\nSince $\\cos 120^\\circ = -0.5$:\n$\\mu_{\\text{meta}} = \\sqrt{2\\mu^2 - \\mu^2} = \\sqrt{\\mu^2} = \\mu = 1.5\\,\\text{D}$.',
    common_mistake: 'Assuming the dipoles cancel to 0 (which is for para) or add up to $3.0$ (linear addition).',
    concept_slugs: ['dipole-moment']
  },

  // ==========================================
  // PATTERN GROUP 5: MOLECULAR ORBITAL THEORY (8 Qs)
  // ==========================================
  {
    title: 'According to Molecular Orbital Theory, which of the following lists the species in the correct increasing order of their bond order?',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Find the total number of electrons and calculate bond order: O2 (16e-), O2+ (15e-), O2- (17e-), O2^2- (18e-).',
    correct_answer: 'C',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{O}_2^+ < \\text{O}_2 < \\text{O}_2^- < \\text{O}_2^{2-}$',
      B: '$\\text{O}_2^{2-} < \\text{O}_2^- < \\text{O}_2^+ < \\text{O}_2$',
      C: '$\\text{O}_2^{2-} < \\text{O}_2^- < \\text{O}_2 < \\text{O}_2^+$',
      D: '$\\text{O}_2^- < \\text{O}_2^{2-} < \\text{O}_2 < \\text{O}_2^+$'
    },
    solution_text: 'Let\'s calculate the bond orders:\n- $\\text{O}_2^{2-}$ (18 electrons): $\\text{BO} = \\frac{10 - 8}{2} = 1.0$\n- $\\text{O}_2^-$ (17 electrons): $\\text{BO} = \\frac{10 - 7}{2} = 1.5$\n- $\\text{O}_2$ (16 electrons): $\\text{BO} = \\frac{10 - 6}{2} = 2.0$\n- $\\text{O}_2^+$ (15 electrons): $\\text{BO} = \\frac{10 - 5}{2} = 2.5$\nThus, the increasing order of bond order is:\n$\\text{O}_2^{2-} < \\text{O}_2^- < \\text{O}_2 < \\text{O}_2^+$.\nOption C is correct.',
    common_mistake: 'Assuming removing electrons always decreases bond order, forgetting that for oxygen, electrons are removed from antibonding orbitals.',
    concept_slugs: ['mot']
  },
  {
    title: 'According to Molecular Orbital Theory, the number of unpaired electrons in a $\\text{B}_2$ molecule is ________.',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'B2 has 10 electrons. Write the M.O. configuration: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} \\pi_{2p_x}^1 \\pi_{2p_y}^1$.',
    correct_answer: '2',
    pattern_group: 'mot',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'For $\\text{B}_2$ (10 electrons):\n- M.O. configuration: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2} (\\pi_{2p_x}^1 \\approx \\pi_{2p_y}^1)$.\n- The last two electrons enter the degenerate $\\pi_{2p_x}$ and $\\pi_{2p_y}$ orbitals with parallel spins according to Hund\'s rule.\n- Therefore, there are exactly 2 unpaired electrons (making B2 paramagnetic).',
    common_mistake: 'Pairing the last two electrons in $\\pi_{2p_x}^2$, which would give 0 unpaired electrons.',
    concept_slugs: ['mot']
  },
  {
    title: 'The molecular orbital configuration of Nitrogen molecule ($\\text{N}_2$) shows that the $\\sigma_{2p_z}$ orbital is higher in energy than the degenerate $\\pi_{2p_x}$ and $\\pi_{2p_y}$ orbitals. This inversion is due to ________-________ mixing.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 's' }, { answer: 'p' }]),
    solution_text: 'For homonuclear diatomic molecules of elements with $Z \\le 7$ (such as $\\text{B}_2, \\text{C}_2, \\text{N}_2$), the energy gap between $2\\text{s}$ and $2\\text{p}$ orbitals is small. This allows significant s-p mixing (specifically between $\\sigma_{2s}$ and $\\sigma_{2p_z}$), raising the energy of the $\\sigma_{2p_z}$ orbital above that of the $\\pi_{2p_x}$ and $\\pi_{2p_y}$ orbitals.',
    common_mistake: 'Interchanging the letters to write p-s mixing instead of s-p mixing.',
    concept_slugs: ['mot']
  },
  {
    title: 'According to Molecular Orbital Theory, which of the following species is diamagnetic?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Diamagnetic species have all electrons paired. Check configuration: B2 (10e-), C2 (12e-), O2 (16e-), O2- (17e-).',
    correct_answer: 'B',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{B}_2$',
      B: '$\\text{C}_2$',
      C: '$\\text{O}_2$',
      D: '$\\text{O}_2^-$'
    },
    solution_text: 'Let\'s write the M.O. configurations of the valence shells:\n- $\\text{B}_2$ (10e-): $\\pi_{2p_x}^1 \\approx \\pi_{2p_y}^1 \\implies 2$ unpaired electrons (paramagnetic).\n- $\\text{C}_2$ (12e-): $\\pi_{2p_x}^2 \\approx \\pi_{2p_y}^2 \\implies 0$ unpaired electrons (diamagnetic).\n- $\\text{O}_2$ (16e-): $\\pi_{2p_x}^{*1} \\approx \\pi_{2p_y}^{*1} \\implies 2$ unpaired electrons (paramagnetic).\n- $\\text{O}_2^-$ (17e-): $\\pi_{2p_x}^{*2} \\approx \\pi_{2p_y}^{*1} \\implies 1$ unpaired electron (paramagnetic).\nThus, $\\text{C}_2$ is diamagnetic. Option B is correct.',
    common_mistake: 'Assuming C2 has 2 unpaired electrons by analogy to C atom, which has 2 unpaired p-electrons.',
    concept_slugs: ['mot']
  },
  {
    title: 'The bond length of $\\text{NO}$ is $1.15\\,\\text{Å}$ and that of $\\text{NO}^+$ is $1.06\\,\\text{Å}$. The decrease in bond length from $\\text{NO}$ to $\\text{NO}^+$ is due to:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Find bond orders of NO (15 electrons) and NO+ (14 electrons). Higher bond order means stronger, shorter bond.',
    correct_answer: 'A',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'An increase in bond order from $2.5$ to $3.0$.',
      B: 'A decrease in bond order from $3.0$ to $2.5$.',
      C: 'No change in bond order, but change in ionic size.',
      D: 'Removal of a bonding electron.'
    },
    solution_text: '- $\\text{NO}$ (15 electrons): Bond Order $= 2.5$.\n- $\\text{NO}^+$ (14 electrons): Formed by removing one electron from the antibonding $\\pi_{2p}^*$ orbital. This increases the Bond Order to 3.0.\n- An increase in bond order increases bond strength and decreases bond length.\nOption A is correct.',
    common_mistake: 'Thinking that positive ions are always smaller so the bond length must decrease without relation to bond order.',
    concept_slugs: ['mot']
  },
  {
    title: 'Which of the following diatomic species has the highest bond dissociation energy?',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Bond dissociation energy is directly proportional to bond order. Calculate bond orders of N2 (3), O2 (2), F2 (1), B2 (1).',
    correct_answer: 'A',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{N}_2$',
      B: '$\\text{O}_2$',
      C: '$\\text{F}_2$',
      D: '$\\text{B}_2$'
    },
    solution_text: 'The bond orders are:\n- $\\text{N}_2$: 3.0 (triple bond)\n- $\\text{O}_2$: 2.0 (double bond)\n- $\\text{F}_2$: 1.0 (single bond)\n- $\\text{B}_2$: 1.0 (single bond)\nSince $\\text{N}_2$ has the highest bond order (3.0), it has the strongest bond and hence the highest bond dissociation energy. Option A is correct.',
    common_mistake: 'Choosing O2 or F2 due to electronegativity arguments.',
    concept_slugs: ['mot']
  },
  {
    title: 'For the Carbon monoxide ($\\text{CO}$) molecule, the bond order is ________.',
    difficulty: 'medium',
    type: 'concept',
    notes: 'CO is isoelectronic with N2 (14 electrons). M.O. configuration results in the same bond order.',
    correct_answer: '3',
    pattern_group: 'mot',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'CO contains 6 (from Carbon) + 8 (from Oxygen) $= 14$ electrons. It is isoelectronic with $\\text{N}_2$.\nUsing the formula for bond order: $\\text{BO} = \\frac{N_b - N_a}{2} = \\frac{10 - 4}{2} = 3$.\nTherefore, the bond order of CO is 3.',
    common_mistake: 'Assuming bond order is 2 because Carbon is group 14 and Oxygen is group 16, forming a standard double bond.',
    concept_slugs: ['mot']
  },
  {
    title: 'Which of the following diatomic species does NOT exist under normal conditions according to Molecular Orbital Theory?',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'A species does not exist if its bond order is zero.',
    correct_answer: 'B',
    pattern_group: 'mot',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{Li}_2$',
      B: '$\\text{Be}_2$',
      C: '$\\text{B}_2$',
      D: '$\\text{C}_2$'
    },
    solution_text: 'Let\'s calculate the bond order for $\\text{Be}_2$ (8 electrons):\n- Configuration: $\\sigma_{1s}^2 \\sigma_{1s}^{*2} \\sigma_{2s}^2 \\sigma_{2s}^{*2}$.\n- Number of bonding electrons ($N_b$) = 4, antibonding electrons ($N_a$) = 4.\n- Bond Order $= \\frac{4 - 4}{2} = 0$.\nSince the bond order is zero, $\\text{Be}_2$ does not exist. Option B is correct.',
    common_mistake: 'Assuming Li2 does not exist because lithium is a metal, whereas gaseous Li2 actually exists with bond order 1.',
    concept_slugs: ['mot']
  },

  // ==========================================
  // PATTERN GROUP 6: HYDROGEN BONDING & INTERMOLECULAR FORCES (8 Qs)
  // ==========================================
  {
    title: 'The boiling point of Hydrogen fluoride ($\\text{HF}$) is higher than that of Hydrogen chloride ($\\text{HCl}$) primarily because of:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Boiling point depends on the strength of intermolecular forces. Fluorine is highly electronegative and forms strong hydrogen bonds.',
    correct_answer: 'D',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'HF has larger molecular mass than HCl.',
      B: 'HF has a covalent bond, while HCl has an ionic bond.',
      C: 'HCl undergoes association through hydrogen bonding.',
      D: 'HF molecules undergo association through strong intermolecular hydrogen bonding.'
    },
    solution_text: 'Fluorine is highly electronegative (4.0) and has a small size. This allows it to form strong hydrogen bonds between HF molecules, causing molecular association. HCl has weaker dipole-dipole forces and does not show significant hydrogen bonding. Thus, HF has a much higher boiling point. Option D is correct.',
    common_mistake: 'Thinking that boiling point is solely determined by molecular mass (which would make HCl higher).',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'Which of the following compounds displays intramolecular hydrogen bonding?',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Intramolecular hydrogen bonding occurs within the same molecule when the hydrogen donor and acceptor are close in space.',
    correct_answer: 'A',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'o-Nitrophenol',
      B: 'p-Nitrophenol',
      C: 'Water',
      D: 'Ethanol'
    },
    solution_text: '- In o-Nitrophenol, the -OH and -NO2 groups are adjacent (ortho position). The hydrogen of the -OH group forms a hydrogen bond with an oxygen of the -NO2 group within the same molecule (intramolecular H-bonding).\n- In p-Nitrophenol, the groups are far apart (para position), so it undergoes intermolecular H-bonding.\nOption A is correct.',
    common_mistake: 'Confusing intramolecular (within a molecule) and intermolecular (between molecules) H-bonding.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'The maximum number of hydrogen bonds that a single water ($\\text{H}_2\\text{O}$) molecule can form in ice is ________.',
    difficulty: 'medium',
    type: 'concept',
    notes: 'Consider the number of hydrogen atoms and the number of lone pairs on the oxygen atom of water.',
    correct_answer: '4',
    pattern_group: 'intermolecular-forces',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'A water molecule contains 2 hydrogen atoms and 2 lone pairs on the oxygen atom. \n- The 2 hydrogen atoms can form 2 hydrogen bonds with lone pairs of oxygen atoms in two neighboring water molecules.\n- The 2 lone pairs on the oxygen atom can accept 2 hydrogen bonds from hydrogen atoms of two other neighboring water molecules.\n- Thus, each water molecule can form a maximum of $2 + 2 = 4$ hydrogen bonds in a tetrahedral cage-like structure of ice.',
    common_mistake: 'Answering 2, thinking only the two hydrogen atoms form bonds, neglecting the lone pairs.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'In ice, water molecules are arranged in an open cage-like structure. Because of this, when ice melts, its density ________.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'increases' }]),
    solution_text: 'In ice, the molecules are held in a rigid, open cage-like structure due to extensive tetrahedral hydrogen bonding. This structure has a large volume and low density. When ice melts, some H-bonds collapse, allowing water molecules to pack closer together, which decreases volume and increases density.',
    common_mistake: 'Writing "decreases", assuming solids are always denser than liquids.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'Which of the following organic liquids is expected to have the highest viscosity due to extensive intermolecular hydrogen bonding?',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: 'C',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Ethanol ($\\text{CH}_3\\text{CH}_2\\text{OH}$)',
      B: 'Ethylene glycol ($\\text{HO-CH}_2-\\text{CH}_2-\\text{OH}$)',
      C: 'Glycerol ($\\text{HO-CH}_2-\\text{CH(OH)}-\\text{CH}_2-\\text{OH}$)',
      D: 'Dimethyl ether ($\\text{CH}_3-\\text{O}-\\text{CH}_3$)'
    },
    solution_text: 'Viscosity increases with the strength of intermolecular forces, particularly hydrogen bonding:\n- Dimethyl ether has no -OH groups $\\implies$ no hydrogen bonding.\n- Ethanol has 1 -OH group per molecule.\n- Ethylene glycol has 2 -OH groups per molecule.\n- Glycerol has 3 -OH groups per molecule, allowing for the most extensive network of intermolecular hydrogen bonds.\nThus, Glycerol has the highest viscosity. Option C is correct.',
    common_mistake: 'Selecting ethanol because it is the most common alcohol, ignoring the number of hydroxyl groups.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'Which of the following elements can act as a hydrogen bond acceptor but NOT a donor in organic compounds?',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: 'D',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Fluorine in $\\text{HF}$',
      B: 'Oxygen in $\\text{CH}_3\\text{OH}$',
      C: 'Nitrogen in $\\text{CH}_3\\text{NH}_2$',
      D: 'Oxygen in $\\text{CH}_3-\\text{C}(=\\text{O})-\\text{CH}_3$'
    },
    solution_text: 'For hydrogen bonding:\n- A donor must have a hydrogen atom directly bonded to an electronegative atom (N, O, F).\n- An acceptor must have a lone pair on an electronegative atom (N, O, F).\nIn Acetone ($\\text{CH}_3-\\text{C}(=\\text{O})-\\text{CH}_3$), the oxygen has lone pairs (acceptor) but there are no hydrogens bonded directly to oxygen, so it cannot act as a donor. Option D is correct.',
    common_mistake: 'Assuming any compound containing oxygen can act as a donor.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'Boiling point of o-nitrophenol is lower than p-nitrophenol. The correct reason is:',
    difficulty: 'medium',
    type: 'concept',
    correct_answer: 'A',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'o-nitrophenol has intramolecular H-bonding which prevents association, whereas p-nitrophenol has intermolecular H-bonding which causes molecular association.',
      B: 'o-nitrophenol has intermolecular H-bonding which increases volatility.',
      C: 'p-nitrophenol has a lower molecular mass.',
      D: 'o-nitrophenol is non-polar.'
    },
    solution_text: 'o-Nitrophenol forms intramolecular hydrogen bonds, creating a ring structure within the single molecule. This reduces its capacity to form hydrogen bonds with neighboring molecules. p-Nitrophenol forms intermolecular hydrogen bonds, leading to extensive association of multiple molecules. Consequently, p-nitrophenol requires more energy to vaporize and has a higher boiling point. Option A is correct.',
    common_mistake: 'Reversing the explanations for ortho and para isomers.',
    concept_slugs: ['intermolecular-forces']
  },
  {
    title: 'The weak intermolecular forces of attraction operating between noble gas atoms in solid state are known as ________ dispersion forces (or London forces).',
    difficulty: 'easy',
    type: 'advanced',
    correct_answer: '',
    pattern_group: 'intermolecular-forces',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'London' }]),
    solution_text: 'Noble gases are monoatomic and non-polar. The only forces of attraction operating between them are London dispersion forces, which arise from temporary dipole-induced dipole moments in the electron clouds of adjacent atoms.',
    common_mistake: 'Writing "dipole", which requires permanent molecular dipoles.',
    concept_slugs: ['intermolecular-forces']
  },

  // ==========================================
  // PATTERN GROUP 7: IONIC CHARACTER, LATTICE ENERGY & FAJAN'S RULES (8 Qs)
  // ==========================================
  {
    title: 'According to Fajan\'s rules, the covalent character of Lithium halides increases in the order:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'For a constant cation (Li+), larger anions are more easily polarized, increasing covalent character.',
    correct_answer: 'B',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{LiI} < \\text{LiBr} < \\text{LiCl} < \\text{LiF}$',
      B: '$\\text{LiF} < \\text{LiCl} < \\text{LiBr} < \\text{LiI}$',
      C: '$\\text{LiCl} < \\text{LiF} < \\text{LiBr} < \\text{LiI}$',
      D: '$\\text{LiF} < \\text{LiBr} < \\text{LiCl} < \\text{LiI}$'
    },
    solution_text: 'According to Fajan\'s rules:\n- Covalent character increases with the size of the anion (larger anions have more polarizable electron clouds).\n- The size of halide ions increases: $\\text{F}^- < \\text{Cl}^- < \\text{Br}^- < \\text{I}^-$.\n- Therefore, the covalent character increases in the same order:\n$\\text{LiF} < \\text{LiCl} < \\text{LiBr} < \\text{LiI}$.\nOption B is correct.',
    common_mistake: 'Reversing the trend because smaller anions form stronger ionic bonds, confusing ionic strength with covalent character.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'The thermal stability of alkaline earth metal carbonates increases down the group from $\\text{BeCO}_3$ to $\\text{BaCO}_3$. This is because:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Consider polarizing power of the cation. Smaller cations polarize the carbonate ion more, making it decompose at lower temperatures.',
    correct_answer: 'A',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'The size of the cation increases down the group, decreasing its polarizing power and stabilizing the carbonate lattice.',
      B: 'Lattice energy increases down the group.',
      C: 'Covalent character increases down the group.',
      D: 'The electronegativity of metal increases down the group.'
    },
    solution_text: 'Smaller cations ($\\text{Be}^{2+}$) have high charge density and exert a strong polarizing effect on the large carbonate ion ($\\text{CO}_3^{2-}$), distorting its electron cloud and facilitating its decomposition into oxide and carbon dioxide. Down the group, the cation size increases ($\\text{Be}^{2+} \\rightarrow \\text{Ba}^{2+}$), polarizing power decreases, and the carbonates become thermally more stable. Option A is correct.',
    common_mistake: 'Attributing the stability to an increase in lattice energy, which actually decreases as ionic sizes increase.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'Fajan\'s rules state that covalent character is favored by a ________ cation size, a ________ anion size, and a ________ charge on either ion.',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'small' }, { answer: 'large' }, { answer: 'high' }]),
    solution_text: 'According to Fajan\'s rules, covalent character is favored by:\n1. Small cation size (high polarizing power).\n2. Large anion size (high polarizability).\n3. High charge on either the cation or anion (increases electrostatic distortion).',
    common_mistake: 'Mixing up small and large in the blanks.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'Lattice energy ($U$) of an ionic solid is proportional to $\\frac{q_1 q_2}{r_0}$, where $q_1, q_2$ are charges on the ions and $r_0$ is the interionic distance. Which of the following compounds has the highest lattice energy?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Look for ions with higher charges first, as charge has a stronger impact on lattice energy than ionic radii.',
    correct_answer: 'D',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{NaCl}$',
      B: '$\\text{LiF}$',
      C: '$\\text{CaO}$',
      D: '$\\text{AlN}$'
    },
    solution_text: 'Let\'s check the product of charges ($q_1 q_2$) for each compound:\n- $\\text{NaCl}$: $+1 \\times -1 = -1$\n- $\\text{LiF}$: $+1 \\times -1 = -1$\n- $\\text{CaO}$: $+2 \\times -2 = -4$\n- $\\text{AlN}$: $+3 \\times -3 = -9$\nSince $\\text{AlN}$ has the highest charge product (9), it has the highest electrostatic attraction and thus the highest lattice energy. Option D is correct.',
    common_mistake: 'Selecting LiF because the ions are very small, forgetting that charge magnitude is a much more dominant factor than size.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'The correct order of hydration energy of alkali metal cations is:',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Hydration energy is inversely proportional to the size of the gaseous ion. Smaller ions have higher charge density and attract water molecules more strongly.',
    correct_answer: 'A',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{Li}^+ > \\text{Na}^+ > \\text{K}^+ > \\text{Rb}^+$',
      B: '$\\text{Rb}^+ > \\text{K}^+ > \\text{Na}^+ > \\text{Li}^+$',
      C: '$\\text{Li}^+ > \\text{K}^+ > \\text{Na}^+ > \\text{Rb}^+$',
      D: '$\\text{Na}^+ > \\text{Li}^+ > \\text{K}^+ > \\text{Rb}^+$'
    },
    solution_text: 'Hydration energy is directly proportional to charge density (charge/size ratio). Since all alkali metal ions have a $+1$ charge, the hydration energy depends on size:\n- Gaseous ion size: $\\text{Li}^+ < \\text{Na}^+ < \\text{K}^+ < \\text{Rb}^+$.\n- Hydration energy order: $\\text{Li}^+ > \\text{Na}^+ > \\text{K}^+ > \\text{Rb}^+$.\nOption A is correct.',
    common_mistake: 'Confusing hydrated ionic size with gaseous ionic size. Li+ is the smallest gaseous ion but becomes the largest hydrated ion due to strong hydration.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'The solubility of alkaline earth metal sulfates in water decreases down the group from $\\text{MgSO}_4$ to $\\text{BaSO}_4$. This is because:',
    difficulty: 'medium',
    type: 'practice',
    correct_answer: 'A',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Hydration energy decreases more rapidly than lattice energy down the group.',
      B: 'Lattice energy increases down the group.',
      C: 'Covalent character increases down the group.',
      D: 'Hydration energy increases down the group.'
    },
    solution_text: 'Solubility is determined by the net balance of Lattice Energy and Hydration Energy. Down the group, both energies decrease due to increasing metal ion size. However, because the sulfate ion is very large, the lattice energy remains relatively constant, while the hydration energy of the metal cation decreases rapidly. Since hydration energy drops faster than lattice energy, solubility decreases down the group. Option A is correct.',
    common_mistake: 'Assuming lattice energy increases down the group.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'Between $\\text{FeCl}_2$ and $\\text{FeCl}_3$, which compound is more covalent according to Fajan\'s rules?',
    difficulty: 'easy',
    type: 'concept',
    correct_answer: 'B',
    pattern_group: 'ionic-fajans',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{FeCl}_2$',
      B: '$\\text{FeCl}_3$',
      C: 'Both are equally covalent.',
      D: 'Neither is covalent.'
    },
    solution_text: 'According to Fajan\'s rules, higher charge on the cation increases its polarizing power, which increases covalent character:\n- In $\\text{FeCl}_2$, Iron is in the $+2$ oxidation state.\n- In $\\text{FeCl}_3$, Iron is in the $+3$ oxidation state.\nSince $\\text{Fe}^{3+}$ has a higher charge and smaller size than $\\text{Fe}^{2+}$, it is more polarizing and causes greater covalent character. Option B is correct.',
    common_mistake: 'Thinking FeCl2 is more covalent due to containing fewer chlorine atoms.',
    concept_slugs: ['ionic-fajans']
  },
  {
    title: 'The lattice energy of $\\text{NaCl}$ calculated using Born-Haber cycle requires: Sublimation energy of metal ($108$), Ionization energy ($496$), Dissociation energy of chlorine ($242$, so half-bond is $121$), Electron affinity of chlorine ($-349$), and Heat of formation of $\\text{NaCl}$ ($-411$). All values in $\\text{kJ/mol}$. The lattice energy of $\\text{NaCl}$ is ________ $\\text{kJ/mol}$.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Use Born-Haber cycle equation: $\\Delta H_f = \\Delta H_{\\text{sub}} + IE + \\frac{1}{2}\\Delta H_{\\text{diss}} + EA - U$. Solve for lattice energy U.',
    correct_answer: '787',
    pattern_group: 'ionic-fajans',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Born-Haber cycle relation:\n$\\Delta H_f = \\Delta H_{\\text{sub}} + IE + \\frac{1}{2} D + EA - U$\nSubstitute the given values:\n$-411 = 108 + 496 + 121 - 349 - U$\n$-411 = 376 - U$\n$U = 376 + 411 = 787\\,\\text{kJ/mol}$.',
    common_mistake: 'Using the full dissociation energy of chlorine ($242$) instead of half of it ($121$) because the reaction only forms 1 mole of NaCl.',
    concept_slugs: ['ionic-fajans']
  },

  // ==========================================
  // PATTERN GROUP 8: MULTI-CONCEPT / ADVANCED (8 Qs)
  // ==========================================
  {
    title: 'The molecule trisilylamine, $\\text{N(SiH}_3)_3$, is planar, whereas trimethylamine, $\\text{N(CH}_3)_3$, is pyramidal. This difference is explained by:',
    difficulty: 'easy',
    type: 'pyq',
    source: 'JEE Main 2021',
    notes: 'Silicon belongs to period 3 and has empty 3d orbitals, while Carbon has no d-orbitals.',
    correct_answer: 'B',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Steric crowding in trimethylamine.',
      B: '$\\text{p}\\pi\\text{-d}\\pi$ back-bonding of Nitrogen\'s lone pair into the empty $\\text{3d}$ orbitals of Silicon in trisilylamine.',
      C: 'The high electronegativity of Carbon.',
      D: 'Silicon undergoing $\\text{sp}^2$ hybridization.'
    },
    solution_text: 'In trisilylamine, the central Nitrogen has a lone pair and is bonded to three Silicon atoms. Silicon has empty, low-energy $\\text{3d}$ orbitals. The lone pair of Nitrogen is donated into these empty $3\\text{d}$ orbitals of Silicon, forming a $\\text{p}\\pi\\text{-d}\\pi$ back-bond. This gives the nitrogen double-bond character, making it $\\text{sp}^2$ hybridized and planar. Trimethylamine lacks d-orbitals on Carbon, so back-bonding is impossible and it remains $\\text{sp}^3$ hybridized and pyramidal. Option B is correct.',
    common_mistake: 'Attributing the trend to simple steric size variations.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'The Lewis acid strength of Boron halides increases in the order: $\\text{BF}_3 < \\text{BCl}_3 < \\text{BBr}_3$. This trend is the reverse of what is expected from electronegativity arguments, and is explained by:',
    difficulty: 'medium',
    type: 'pyq',
    source: 'JEE Main 2022',
    notes: 'Consider back-bonding. Smaller halogens show better overlap for back-donation, reducing their electron deficiency.',
    correct_answer: 'A',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{p}\\pi\\text{-p}\\pi$ back-bonding is strongest in $\\text{BF}_3$ due to similar size of $2\\text{p}$ orbitals, reducing Boron\'s electron deficiency.',
      B: 'Fluorine is highly electronegative and stabilizes the Boron atom.',
      C: 'Chlorine and Bromine are larger, preventing back-bonding due to steric reasons.',
      D: 'Lattice energy variations in the boron halides.'
    },
    solution_text: 'In $\\text{BF}_3$, Boron has an empty $2\\text{p}$ orbital and Fluorine has filled $2\\text{p}$ orbitals. The overlap between these orbitals is highly effective because of their similar size, creating strong $\\text{p}\\pi\\text{-p}\\pi$ back-bonding which partially satisfies Boron\'s electron deficiency. As we go down the group to $\\text{BCl}_3$ and $\\text{BBr}_3$, the halogens use $3\\text{p}$ and $4\\text{p}$ orbitals, which are much larger, making back-bonding weaker. Thus, Boron remains more electron-deficient in $\\text{BBr}_3$, making it the strongest Lewis acid. Option A is correct.',
    common_mistake: 'Thinking BF3 is the strongest Lewis acid because Fluorine is the most electronegative.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'According to Bent\'s rule, in a substituted methyl group, more electronegative substituents prefer hybrid orbitals with ________ s-character, whereas more electropositive substituents prefer orbitals with ________ s-character.',
    difficulty: 'hard',
    type: 'concept',
    correct_answer: '',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'fill_blank',
    blank_positions: JSON.stringify([{ answer: 'less' }, { answer: 'more' }]),
    solution_text: 'Bent\'s rule states: "Atomic s-character concentrates in hybrid orbitals directed toward electropositive substituents." Thus, electronegative substituents prefer hybrid orbitals with less s-character (more p-character), and electropositive groups prefer hybrid orbitals with more s-character.',
    common_mistake: 'Putting more s-character for electronegative groups.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'In Diborane ($\\text{B}_2\\text{H}_6$), the number of 3-center-2-electron (3c-2e) "banana" bonds is ________.',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Diborane has 2 bridging hydrogen atoms and 4 terminal hydrogen atoms.',
    correct_answer: '2',
    pattern_group: 'bonding-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'Diborane has two types of B-H bonds:\n1. 4 terminal B-H bonds: these are regular 2-center-2-electron (2c-2e) covalent bonds.\n2. 2 bridging B-H-B bonds: these are 3-center-2-electron (3c-2e) hydrogen bridge bonds, also called banana bonds.\nThus, the number of banana bonds is 2.',
    common_mistake: 'Counting all 6 bonds as banana bonds.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'Which of the following molecules has a completely coplanar set of atoms in its ground state?',
    difficulty: 'medium',
    type: 'practice',
    notes: 'Check the hybridization and structural constraints. Double bonds and aromatic rings promote planarity, but accumulate steric effects or orthogonal pi bonds.',
    correct_answer: 'A',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Boron trifluoride ($\\text{BF}_3$)',
      B: 'Allene ($\\text{CH}_2=\\text{C}=\\text{CH}_2$)',
      C: 'Biphenyl (in gas phase)',
      D: 'Trimethylamine ($\\text{N(CH}_3)_3$)'
    },
    solution_text: '- $\\text{BF}_3$: $\\text{sp}^2$ hybridized central Boron, completely planar (all 4 atoms in one plane).\n- Allene: The terminal $\\text{CH}_2$ groups are in perpendicular planes due to the orthogonal nature of the adjacent double bonds.\n- Biphenyl: In the gas phase, steric repulsion between ortho-hydrogens twists the two rings by $\\approx 45^\\circ$ relative to each other.\n- Trimethylamine: Pyramidal geometry, non-planar.\nOption A is correct.',
    common_mistake: 'Assuming Allene is planar because all carbon atoms are sp2 or sp hybridized.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'Nitrogen pentachloride ($\\text{NCl}_5$) does not exist, whereas Phosphorus pentachloride ($\\text{PCl}_5$) is stable. The correct reason is:',
    difficulty: 'easy',
    type: 'practice',
    correct_answer: 'B',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: 'Nitrogen is more electronegative than Phosphorus.',
      B: 'Nitrogen does not have valence d-orbitals to expand its octet.',
      C: 'The N-Cl bond energy is too low.',
      D: 'Chlorine cannot polarize Nitrogen.'
    },
    solution_text: 'Nitrogen belongs to period 2 and its valence shell has $n=2$, which contains only $2\\text{s}$ and $2\\text{p}$ subshells (no d-orbitals). Thus, Nitrogen can have at most 4 covalent bonds (octet limit). Phosphorus belongs to period 3 ($n=3$), which has empty $3\\text{d}$ orbitals, enabling it to expand its coordination number to 5 or 6 (forming PCl5 or PCl6-). Option B is correct.',
    common_mistake: 'Attributing the trend to bond energy or size, rather than the quantum availability of d-orbitals.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'The number of P-O-P bonds in a Phosphorus decoxide ($\\text{P}_4\\text{O}_{10}$) molecule is ________.',
    difficulty: 'hard',
    type: 'advanced',
    notes: 'Write the cage structure of P4O10. It is based on a P4 tetrahedron where each edge has a bridging oxygen atom.',
    correct_answer: '6',
    pattern_group: 'bonding-advanced',
    is_numerical: true,
    question_format: 'numerical',
    solution_text: 'In $\\text{P}_4\\text{O}_{10}$, the four Phosphorus atoms are at the corners of a tetrahedron. \n- There are 6 edges on a tetrahedron, and each edge has a bridging Oxygen atom forming a P-O-P bond.\n- Additionally, each Phosphorus has one terminal double-bonded Oxygen atom (P=O).\n- Thus, the total number of bridging P-O-P bonds is 6 (and there are 4 terminal P=O bonds).\nThe answer is 6.',
    common_mistake: 'Answering 4, confusing the number of phosphorus atoms with the number of edges.',
    concept_slugs: ['bonding-advanced']
  },
  {
    title: 'Which of the following compounds has a molecular shape resembling a "see-saw"?',
    difficulty: 'easy',
    type: 'concept',
    notes: 'Search for steric number 5 with 4 bond pairs and 1 lone pair.',
    correct_answer: 'B',
    pattern_group: 'bonding-advanced',
    is_numerical: false,
    question_format: 'mcq',
    options: {
      A: '$\\text{XeF}_4$',
      B: '$\\text{SF}_4$',
      C: '$\\text{ClF}_3$',
      D: '$\\text{BF}_3$'
    },
    solution_text: '- $\\text{SF}_4$ has 4 bond pairs and 1 lone pair on sulfur (steric number = 5). According to VSEPR, the lone pair occupies an equatorial position, giving a see-saw shape.\n- $\\text{XeF}_4$ is square planar.\n- $\\text{ClF}_3$ is T-shaped.\n- $\\text{BF}_3$ is trigonal planar.\nOption B is correct.',
    common_mistake: 'Confusing see-saw (SF4) with square planar (XeF4) or T-shaped (ClF3).',
    concept_slugs: ['bonding-advanced']
  }
];

async function seed() {
  try {
    console.log('Starting Chemical Bonding Seeding...');
    
    // Look up chapter dynamically
    const chapterRes = await pool.query("SELECT id FROM chapters WHERE name = 'Chemical Bonding'");
    if (chapterRes.rows.length === 0) {
      console.error("Chapter 'Chemical Bonding' not found in chapters table.");
      process.exit(1);
    }
    const chapterId = chapterRes.rows[0].id;
    console.log(`Found Chemical Bonding chapter with ID: ${chapterId}`);

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

    console.log('Chemical Bonding seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

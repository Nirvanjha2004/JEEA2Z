import 'dotenv/config';
import pool from './index.js';

const SOLUTION_URL = 'https://youtube.com/watch?v=placeholder';

const seedData = {
  subjects: [
    { name: 'Physics', slug: 'physics' },
    { name: 'Chemistry', slug: 'chemistry' },
    { name: 'Math', slug: 'math' },
  ],
  chapters: {
    physics: [
      {
        name: 'Units & Dimensions',
        questions: [
          { title: 'Dimensional analysis of Planck\'s constant', difficulty: 'easy', type: 'concept' },
          { title: 'Deriving relation between physical quantities using dimensions', difficulty: 'medium', type: 'practice' },
          { title: 'Finding dimensions of universal gravitational constant', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Checking dimensional consistency of kinematic equations', difficulty: 'easy', type: 'concept' },
          { title: 'Dimensional formula of angular momentum and torque', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Conversion of units using dimensional analysis', difficulty: 'medium', type: 'practice' },
          { title: 'Limitations of dimensional analysis in deriving exact relations', difficulty: 'hard', type: 'concept' },
        ],
      },
      {
        name: 'Kinematics',
        questions: [
          { title: 'Projectile motion on an inclined plane', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Relative velocity of two boats crossing a river', difficulty: 'easy', type: 'concept' },
          { title: 'Equations of motion with variable acceleration', difficulty: 'hard', type: 'practice' },
          { title: 'Time of flight and range of a projectile at complementary angles', difficulty: 'medium', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Velocity-time graph analysis for non-uniform motion', difficulty: 'medium', type: 'concept' },
          { title: 'Circular motion with tangential and centripetal acceleration', difficulty: 'hard', type: 'practice' },
          { title: 'Calculus-based kinematics: position as a function of time', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Rain-man problem with relative velocity vectors', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Laws of Motion',
        questions: [
          { title: 'Free body diagram of blocks on a wedge system', difficulty: 'medium', type: 'concept' },
          { title: 'Constraint equations in pulley-block systems', difficulty: 'hard', type: 'practice' },
          { title: 'Friction force on a body on a rotating turntable', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Pseudo force in a non-inertial elevator frame', difficulty: 'medium', type: 'concept' },
          { title: 'Tension in a string connecting blocks on inclined planes', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Banking of roads without friction for a car on a curve', difficulty: 'easy', type: 'concept' },
          { title: 'Motion of connected bodies with friction on a horizontal surface', difficulty: 'medium', type: 'practice' },
        ],
      },
      {
        name: 'Work Energy Power',
        questions: [
          { title: 'Work done by a variable force using integration', difficulty: 'hard', type: 'practice' },
          { title: 'Conservation of energy in a vertical circular loop', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Power delivered by a car engine at constant velocity', difficulty: 'easy', type: 'concept' },
          { title: 'Potential energy curve and equilibrium positions', difficulty: 'medium', type: 'concept' },
          { title: 'Elastic and inelastic collision in one dimension', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Work-energy theorem for a block sliding on a rough surface', difficulty: 'medium', type: 'practice' },
          { title: 'Oblique collision between two identical spheres', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
        ],
      },
      {
        name: 'Rotational Motion',
        questions: [
          { title: 'Moment of inertia of composite bodies using parallel axis theorem', difficulty: 'medium', type: 'concept' },
          { title: 'Rolling without slipping on a rough inclined plane', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Angular momentum conservation in a spinning skater', difficulty: 'easy', type: 'concept' },
          { title: 'Torque and angular acceleration of a disc with tangential force', difficulty: 'medium', type: 'practice' },
          { title: 'Pure rolling condition for a cylinder on a moving platform', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Toppling vs sliding condition for a block on a rough surface', difficulty: 'medium', type: 'concept' },
          { title: 'Combined translational and rotational kinetic energy of a rolling sphere', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Gyroscopic precession of a spinning top', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Gravitation',
        questions: [
          { title: 'Gravitational potential energy at height comparable to Earth\'s radius', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Escape velocity from the surface of a planet', difficulty: 'easy', type: 'concept' },
          { title: 'Orbital velocity and time period of a satellite', difficulty: 'medium', type: 'practice' },
          { title: 'Variation of acceleration due to gravity with depth and height', difficulty: 'medium', type: 'concept' },
          { title: 'Kepler\'s third law applied to elliptical orbits', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Gravitational field due to a uniform ring on its axis', difficulty: 'hard', type: 'practice' },
          { title: 'Geostationary satellite conditions and orbital radius', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
        ],
      },
      {
        name: 'Thermodynamics',
        questions: [
          { title: 'Work done in isothermal vs adiabatic expansion of ideal gas', difficulty: 'medium', type: 'concept' },
          { title: 'Carnot engine efficiency between two temperature reservoirs', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Entropy change in irreversible free expansion', difficulty: 'hard', type: 'practice' },
          { title: 'First law of thermodynamics for a cyclic process on a PV diagram', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Molar specific heat of a gas in a polytropic process', difficulty: 'hard', type: 'concept' },
          { title: 'Kinetic theory: RMS speed and degrees of freedom', difficulty: 'easy', type: 'concept' },
          { title: 'Mixture of ideal gases: equivalent Cp/Cv ratio', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
        ],
      },
      {
        name: 'Waves',
        questions: [
          { title: 'Standing waves on a string fixed at both ends: harmonics', difficulty: 'medium', type: 'concept' },
          { title: 'Doppler effect for a moving source and stationary observer', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Beats phenomenon between two tuning forks', difficulty: 'easy', type: 'concept' },
          { title: 'Resonance in open and closed organ pipes', difficulty: 'medium', type: 'practice' },
          { title: 'Superposition of two waves with different amplitudes and phases', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Speed of transverse wave on a stretched string with variable tension', difficulty: 'hard', type: 'practice' },
          { title: 'Intensity and loudness: inverse square law of sound', difficulty: 'easy', type: 'concept' },
          { title: 'Equation of a progressive wave and particle velocity', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
        ],
      },
      {
        name: 'Electrostatics',
        questions: [
          { title: 'Electric field due to a uniformly charged ring on its axis', difficulty: 'medium', type: 'concept' },
          { title: 'Gauss\'s law applied to an infinite charged plane', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Potential and field inside a conducting shell', difficulty: 'easy', type: 'concept' },
          { title: 'Energy stored in a parallel plate capacitor with dielectric', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Force between two point charges in a medium using Coulomb\'s law', difficulty: 'easy', type: 'practice' },
          { title: 'Equipotential surfaces and their relation to electric field lines', difficulty: 'medium', type: 'concept' },
          { title: 'Capacitors in series and parallel with charge redistribution', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Electric dipole in a non-uniform external field', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Current Electricity',
        questions: [
          { title: 'Kirchhoff\'s junction and loop rules for complex circuits', difficulty: 'medium', type: 'concept' },
          { title: 'Wheatstone bridge balance condition and sensitivity', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Internal resistance of a cell using potentiometer', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Drift velocity and current density in a conductor', difficulty: 'easy', type: 'concept' },
          { title: 'Power dissipation in resistors connected in mixed combination', difficulty: 'medium', type: 'practice' },
          { title: 'Temperature dependence of resistance in metals and semiconductors', difficulty: 'easy', type: 'concept' },
          { title: 'RC circuit charging and discharging time constant', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
        ],
      },
      {
        name: 'Magnetism',
        questions: [
          { title: 'Magnetic force on a current-carrying conductor in a uniform field', difficulty: 'easy', type: 'concept' },
          { title: 'Biot-Savart law: magnetic field at the center of a circular loop', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Ampere\'s circuital law for a solenoid and toroid', difficulty: 'medium', type: 'concept' },
          { title: 'Force between two parallel current-carrying wires', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Cyclotron frequency and radius of charged particle in magnetic field', difficulty: 'medium', type: 'practice' },
          { title: 'Magnetic dipole moment of a current loop and torque', difficulty: 'medium', type: 'concept' },
          { title: 'Electromagnetic induction: Faraday\'s law with changing flux', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Self and mutual inductance of coaxial solenoids', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Optics',
        questions: [
          { title: 'Young\'s double slit experiment: fringe width and intensity pattern', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Refraction through a glass prism at minimum deviation', difficulty: 'medium', type: 'concept' },
          { title: 'Thin lens formula and magnification for combined lenses', difficulty: 'easy', type: 'practice' },
          { title: 'Total internal reflection and critical angle in optical fibers', difficulty: 'easy', type: 'concept' },
          { title: 'Diffraction through a single slit: angular width of central maximum', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Polarization by reflection: Brewster\'s angle', difficulty: 'medium', type: 'concept' },
          { title: 'Mirror formula and image formation by concave and convex mirrors', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Resolving power of a microscope and telescope', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Modern Physics',
        questions: [
          { title: 'Photoelectric effect: threshold frequency and stopping potential', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'de Broglie wavelength of an electron accelerated through potential', difficulty: 'easy', type: 'concept' },
          { title: 'Bohr model: energy levels and spectral series of hydrogen', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Radioactive decay: half-life and mean life calculations', difficulty: 'medium', type: 'concept' },
          { title: 'Nuclear fission and fusion: binding energy per nucleon curve', difficulty: 'easy', type: 'concept' },
          { title: 'Mass-energy equivalence and mass defect in nuclear reactions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'X-ray spectrum: characteristic and continuous spectrum analysis', difficulty: 'hard', type: 'practice' },
        ],
      },
    ],
    chemistry: [
      {
        name: 'Mole Concept',
        questions: [
          { title: 'Stoichiometric calculations with limiting reagent', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Empirical and molecular formula from percentage composition', difficulty: 'easy', type: 'concept' },
          { title: 'Molarity and molality interconversion with solution density', difficulty: 'medium', type: 'practice' },
          { title: 'Equivalent weight and normality in acid-base reactions', difficulty: 'medium', type: 'concept' },
          { title: 'Gay-Lussac\'s law of gaseous volumes in chemical reactions', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Back titration to determine percentage purity of a sample', difficulty: 'hard', type: 'practice' },
          { title: 'Concentration terms: mole fraction, ppm, and mass percentage', difficulty: 'easy', type: 'concept' },
        ],
      },
      {
        name: 'Atomic Structure',
        questions: [
          { title: 'Quantum numbers and electronic configuration of transition metals', difficulty: 'medium', type: 'concept' },
          { title: 'de Broglie wavelength and Heisenberg uncertainty principle', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Photoelectron spectroscopy and orbital energy ordering', difficulty: 'hard', type: 'practice' },
          { title: 'Bohr model calculation: radius and energy for hydrogen-like ions', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Shapes of s, p, d orbitals and nodal planes', difficulty: 'easy', type: 'concept' },
          { title: 'Pauli exclusion principle and Hund\'s rule applications', difficulty: 'easy', type: 'concept' },
          { title: 'Emission spectrum of hydrogen: Lyman, Balmer, Paschen series', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
        ],
      },
      {
        name: 'Chemical Bonding',
        questions: [
          { title: 'VSEPR theory: predicting molecular geometry of XeF4 and SF6', difficulty: 'medium', type: 'concept' },
          { title: 'Hybridization and shape of molecules with lone pairs', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Molecular orbital theory: bond order of O2, N2, and their ions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Dipole moment and molecular polarity of common molecules', difficulty: 'easy', type: 'concept' },
          { title: 'Lattice energy and Born-Haber cycle for ionic compounds', difficulty: 'hard', type: 'practice' },
          { title: 'Hydrogen bonding: effect on boiling point of hydrides', difficulty: 'easy', type: 'concept' },
          { title: 'Fajan\'s rules and covalent character of ionic bonds', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Resonance structures and formal charge in polyatomic ions', difficulty: 'medium', type: 'practice' },
        ],
      },
      {
        name: 'Thermodynamics',
        questions: [
          { title: 'Hess\'s law to calculate enthalpy of formation', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Kirchhoff\'s equation: variation of enthalpy with temperature', difficulty: 'hard', type: 'practice' },
          { title: 'Gibbs free energy and spontaneity of reactions', difficulty: 'medium', type: 'concept' },
          { title: 'Entropy change in mixing of ideal gases', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Bond dissociation energy and enthalpy of reaction', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Calorimetry: heat capacity at constant pressure vs volume', difficulty: 'easy', type: 'concept' },
          { title: 'Enthalpy of combustion and lattice energy calculations', difficulty: 'medium', type: 'practice' },
        ],
      },
      {
        name: 'Equilibrium',
        questions: [
          { title: 'Le Chatelier\'s principle: effect of pressure and temperature on equilibrium', difficulty: 'medium', type: 'concept' },
          { title: 'pH calculation of buffer solutions using Henderson equation', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Common ion effect on solubility of sparingly soluble salts', difficulty: 'medium', type: 'practice' },
          { title: 'Relationship between Kp and Kc for gaseous equilibria', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Hydrolysis of salts and resulting pH of solutions', difficulty: 'medium', type: 'concept' },
          { title: 'Solubility product and selective precipitation of ions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Degree of dissociation and van\'t Hoff factor in weak electrolytes', difficulty: 'hard', type: 'practice' },
          { title: 'Ionic equilibrium: pH of polyprotic acid solutions', difficulty: 'hard', type: 'concept' },
        ],
      },
      {
        name: 'Electrochemistry',
        questions: [
          { title: 'Nernst equation: EMF of a galvanic cell at non-standard conditions', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Faraday\'s laws of electrolysis: mass deposited at electrodes', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Standard electrode potential and electrochemical series', difficulty: 'easy', type: 'concept' },
          { title: 'Conductivity and molar conductivity at infinite dilution', difficulty: 'medium', type: 'concept' },
          { title: 'Kohlrausch\'s law and determination of limiting molar conductivity', difficulty: 'hard', type: 'practice' },
          { title: 'Corrosion as an electrochemical process and its prevention', difficulty: 'easy', type: 'concept' },
          { title: 'Lead-acid battery and hydrogen fuel cell working principle', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
        ],
      },
      {
        name: 'Organic Chemistry Basics',
        questions: [
          { title: 'IUPAC nomenclature of complex branched hydrocarbons', difficulty: 'medium', type: 'concept' },
          { title: 'Inductive and resonance effects on acidity of carboxylic acids', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Hyperconjugation and stability of carbocations', difficulty: 'medium', type: 'concept' },
          { title: 'Electromeric effect in addition reactions of alkenes', difficulty: 'easy', type: 'practice' },
          { title: 'Isomerism: structural, geometrical, and optical isomers', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Relative acidity and basicity using electronic effects', difficulty: 'hard', type: 'practice' },
          { title: 'Reaction intermediates: carbocations, carbanions, and free radicals', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Hydrocarbons',
        questions: [
          { title: 'Markovnikov vs anti-Markovnikov addition to alkenes', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Ozonolysis of alkenes and alkynes: product identification', difficulty: 'medium', type: 'practice' },
          { title: 'Electrophilic aromatic substitution: directing effects of substituents', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Birch reduction of aromatic compounds', difficulty: 'hard', type: 'practice' },
          { title: 'Conformational analysis of ethane and cyclohexane', difficulty: 'medium', type: 'concept' },
          { title: 'Preparation of alkanes by Wurtz reaction and decarboxylation', difficulty: 'easy', type: 'concept' },
          { title: 'Acidity of terminal alkynes and formation of acetylides', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
        ],
      },
      {
        name: 'Aldehydes & Ketones',
        questions: [
          { title: 'Nucleophilic addition: mechanism of HCN addition to aldehydes', difficulty: 'medium', type: 'concept' },
          { title: 'Aldol condensation and Cannizzaro reaction', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Wittig reaction for alkene synthesis from carbonyl compounds', difficulty: 'hard', type: 'practice' },
          { title: 'Clemmensen vs Wolff-Kishner reduction selectivity', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Tollens and Fehling\'s test to distinguish aldehydes from ketones', difficulty: 'easy', type: 'concept' },
          { title: 'Cross aldol and Claisen-Schmidt condensation products', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Grignard reagent addition to formaldehyde and ketones', difficulty: 'medium', type: 'practice' },
        ],
      },
      {
        name: 'Amines',
        questions: [
          { title: 'Gabriel phthalimide synthesis of primary amines', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Basicity order of amines: effect of alkyl groups and solvation', difficulty: 'medium', type: 'concept' },
          { title: 'Hofmann bromamide degradation for amine preparation', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Diazotization and coupling reaction for azo dye formation', difficulty: 'hard', type: 'practice' },
          { title: 'Hinsberg test to distinguish primary, secondary, tertiary amines', difficulty: 'easy', type: 'concept' },
          { title: 'Carbylamine reaction as a test for primary amines', difficulty: 'easy', type: 'concept' },
          { title: 'Sandmeyer and Gattermann reactions of diazonium salts', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
        ],
      },
      {
        name: 'Coordination Compounds',
        questions: [
          { title: 'Crystal field theory: splitting in octahedral and tetrahedral complexes', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'IUPAC naming of coordination compounds with multiple ligands', difficulty: 'medium', type: 'concept' },
          { title: 'Isomerism in coordination compounds: geometrical and optical', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Effective atomic number rule and stability of complexes', difficulty: 'medium', type: 'practice' },
          { title: 'Magnetic properties from d-electron configuration of metal ions', difficulty: 'hard', type: 'concept' },
          { title: 'Chelate effect and stability of EDTA complexes', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Spectrochemical series and color of transition metal complexes', difficulty: 'easy', type: 'concept' },
          { title: 'Werner\'s theory and primary vs secondary valency', difficulty: 'easy', type: 'concept' },
        ],
      },
      {
        name: 'p-Block Elements',
        questions: [
          { title: 'Anomalous properties of boron and carbon in their groups', difficulty: 'medium', type: 'concept' },
          { title: 'Allotropy of phosphorus: white, red, and black phosphorus', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Structures of oxoacids of sulphur and phosphorus', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Interhalogen compounds: types and hydrolysis reactions', difficulty: 'medium', type: 'practice' },
          { title: 'Diborane structure and bonding: three-center two-electron bonds', difficulty: 'hard', type: 'concept' },
          { title: 'Noble gas compounds: structure of XeF2, XeF4, XeOF2', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Ozone layer depletion and reactions of chlorofluorocarbons', difficulty: 'easy', type: 'concept' },
        ],
      },
      {
        name: 'd & f Block Elements',
        questions: [
          { title: 'Variable oxidation states of first-row transition metals', difficulty: 'medium', type: 'concept' },
          { title: 'Preparation and properties of potassium permanganate', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Catalytic activity of transition metals: heterogeneous catalysis', difficulty: 'easy', type: 'concept' },
          { title: 'Lanthanoid contraction and its effects on properties', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Preparation and properties of potassium dichromate', difficulty: 'medium', type: 'practice' },
          { title: 'Electronic configuration anomalies: Cu, Cr, and their ions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Colour and magnetic moment of transition metal ions', difficulty: 'medium', type: 'concept' },
          { title: 'Actinoids: general characteristics and comparison with lanthanoids', difficulty: 'easy', type: 'concept' },
        ],
      },
    ],
    math: [
      {
        name: 'Sets & Relations',
        questions: [
          { title: 'Number of equivalence relations on a finite set', difficulty: 'hard', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'De Morgan\'s laws and Venn diagram based problems', difficulty: 'easy', type: 'concept' },
          { title: 'Reflexive, symmetric, transitive properties of relations', difficulty: 'medium', type: 'concept' },
          { title: 'Power set cardinality and subset counting', difficulty: 'easy', type: 'practice' },
          { title: 'Domain and range of composite relations', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Number of surjective functions between two finite sets', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Quadratic Equations',
        questions: [
          { title: 'Nature of roots using discriminant for parametric quadratics', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Relation between roots and coefficients of cubic equations', difficulty: 'hard', type: 'practice' },
          { title: 'Common roots of two quadratic equations', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Location of roots: both roots greater than a given number', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Maximum and minimum value of a quadratic expression', difficulty: 'easy', type: 'concept' },
          { title: 'Descartes rule of signs for positive and negative roots', difficulty: 'medium', type: 'concept' },
          { title: 'Transformation of equations: roots of reciprocal equations', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Sequences & Series',
        questions: [
          { title: 'Sum of n terms of an arithmetico-geometric series', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'AM-GM-HM inequality and its applications', difficulty: 'medium', type: 'concept' },
          { title: 'Sum of infinite geometric series with common ratio conditions', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Telescoping series and method of differences', difficulty: 'hard', type: 'practice' },
          { title: 'nth term of AP, GP, HP and their properties', difficulty: 'easy', type: 'concept' },
          { title: 'Sum of squares and cubes of first n natural numbers', difficulty: 'medium', type: 'practice' },
          { title: 'Insertion of arithmetic and geometric means between two numbers', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
        ],
      },
      {
        name: 'Permutations & Combinations',
        questions: [
          { title: 'Circular permutations with identical objects', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Distribution of distinct objects into distinct groups', difficulty: 'hard', type: 'practice' },
          { title: 'Derangements: number of permutations with no fixed points', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Combinations with repetition allowed', difficulty: 'medium', type: 'concept' },
          { title: 'Number of ways to arrange letters of a word with repetitions', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Multinomial theorem and distribution of identical objects', difficulty: 'hard', type: 'practice' },
          { title: 'Number of integral solutions of linear equations using stars and bars', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Binomial Theorem',
        questions: [
          { title: 'General term and middle term of binomial expansion', difficulty: 'easy', type: 'concept' },
          { title: 'Coefficient of a specific power of x in binomial expansion', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Sum of binomial coefficients and their properties', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Greatest term in the expansion of (1+x)^n', difficulty: 'medium', type: 'practice' },
          { title: 'Multinomial expansion and number of terms', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Approximations using binomial theorem for small x', difficulty: 'easy', type: 'concept' },
          { title: 'Remainder when a large power is divided by a number using binomial', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Complex Numbers',
        questions: [
          { title: 'Modulus and argument of complex numbers in polar form', difficulty: 'easy', type: 'concept' },
          { title: 'Cube roots of unity and their properties', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Rotation of complex numbers in the Argand plane', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Locus of a complex number satisfying |z - z1| = |z - z2|', difficulty: 'medium', type: 'practice' },
          { title: 'De Moivre\'s theorem for finding nth roots of complex numbers', difficulty: 'medium', type: 'concept' },
          { title: 'Triangle inequality and its applications in complex plane', difficulty: 'hard', type: 'practice' },
          { title: 'Geometrical representation: circles and lines in complex plane', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
        ],
      },
      {
        name: 'Matrices & Determinants',
        questions: [
          { title: 'Properties of determinants: row and column operations', difficulty: 'medium', type: 'concept' },
          { title: 'Solving system of linear equations using Cramer\'s rule', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Cayley-Hamilton theorem and finding inverse of a matrix', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Adjoint and inverse of a 3x3 matrix', difficulty: 'medium', type: 'practice' },
          { title: 'Rank of a matrix and conditions for consistency', difficulty: 'hard', type: 'concept' },
          { title: 'Symmetric and skew-symmetric matrix decomposition', difficulty: 'easy', type: 'concept' },
          { title: 'Product of determinants and determinant of product of matrices', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Eigenvalues and characteristic equation of a matrix', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Probability',
        questions: [
          { title: 'Bayes\' theorem: conditional probability in medical testing', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Binomial distribution: mean and variance of number of successes', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Total probability theorem with mutually exclusive events', difficulty: 'medium', type: 'concept' },
          { title: 'Probability of at least one event occurring', difficulty: 'easy', type: 'practice' },
          { title: 'Geometric probability: random point in a region', difficulty: 'hard', type: 'practice' },
          { title: 'Independent vs mutually exclusive events with Venn diagrams', difficulty: 'easy', type: 'concept' },
          { title: 'Expected value and variance in random variable problems', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
        ],
      },
      {
        name: 'Trigonometry',
        questions: [
          { title: 'General solution of trigonometric equations involving multiple angles', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Inverse trigonometric function identities and simplification', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Properties of triangles: sine rule and cosine rule applications', difficulty: 'medium', type: 'concept' },
          { title: 'Maximum and minimum values of trigonometric expressions', difficulty: 'medium', type: 'practice' },
          { title: 'Sum and product formulas for sine and cosine', difficulty: 'easy', type: 'concept' },
          { title: 'Heights and distances: angle of elevation and depression problems', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Conditional identities in a triangle: if A+B+C=π', difficulty: 'hard', type: 'practice' },
          { title: 'Domain and range of inverse trigonometric functions', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Straight Lines',
        questions: [
          { title: 'Family of lines passing through intersection of two given lines', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Angle bisectors of two lines and identification of acute bisector', difficulty: 'medium', type: 'concept' },
          { title: 'Distance of a point from a line and between parallel lines', difficulty: 'easy', type: 'practice' },
          { title: 'Area of triangle formed by coordinate axes and a line', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Concurrency condition for three lines using determinant', difficulty: 'medium', type: 'concept' },
          { title: 'Image of a point with respect to a line', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Pair of straight lines from a homogeneous second degree equation', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Circles',
        questions: [
          { title: 'Equation of tangent to a circle in slope form', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Radical axis and radical center of three circles', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Orthogonal circles: condition for perpendicular intersection', difficulty: 'hard', type: 'practice' },
          { title: 'Length of tangent from an external point to a circle', difficulty: 'easy', type: 'concept' },
          { title: 'Equation of circle passing through three given points', difficulty: 'medium', type: 'practice' },
          { title: 'Common tangents to two circles: direct and transverse', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Power of a point with respect to a circle', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Conic Sections',
        questions: [
          { title: 'Eccentricity and directrix of an ellipse from its equation', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Equation of tangent and normal to a parabola at a point', difficulty: 'medium', type: 'concept' },
          { title: 'Asymptotes and rectangular hyperbola properties', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Chord of contact from an external point to a conic', difficulty: 'hard', type: 'practice' },
          { title: 'Focal chord properties of a parabola', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Auxiliary circle and parametric equations of an ellipse', difficulty: 'medium', type: 'concept' },
          { title: 'Conjugate hyperbola and transverse axis length', difficulty: 'medium', type: 'practice' },
          { title: 'Locus problems involving parabola and tangent conditions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
        ],
      },
      {
        name: 'Functions',
        questions: [
          { title: 'Finding domain and range of composite functions', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Inverse function existence and computation', difficulty: 'medium', type: 'concept' },
          { title: 'Even, odd functions and their graphical properties', difficulty: 'easy', type: 'concept' },
          { title: 'Functional equations: finding f(x) given f(x+y) relations', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Periodic functions: period of sin²x, |cos x|, etc.', difficulty: 'medium', type: 'practice' },
          { title: 'Bijective, injective, surjective function identification', difficulty: 'easy', type: 'concept' },
          { title: 'Number of onto functions between finite sets', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Limits & Continuity',
        questions: [
          { title: 'L\'Hôpital\'s rule for 0/0 and ∞/∞ indeterminate forms', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Squeeze theorem applied to oscillating functions', difficulty: 'medium', type: 'concept' },
          { title: 'Continuity and differentiability of piecewise defined functions', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Standard limits: (sin x)/x, (1+1/n)^n, (e^x - 1)/x', difficulty: 'easy', type: 'concept' },
          { title: 'Limit of the form 1^∞ using logarithmic transformation', difficulty: 'hard', type: 'practice' },
          { title: 'Intermediate value theorem and its applications', difficulty: 'medium', type: 'concept' },
          { title: 'Evaluating limits using Taylor series expansion', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
        ],
      },
      {
        name: 'Differentiation',
        questions: [
          { title: 'Implicit differentiation of equations like x²+y²=a²', difficulty: 'medium', type: 'concept' },
          { title: 'Logarithmic differentiation for products and powers', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Higher order derivatives and Leibniz theorem', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Differentiation of parametric functions: x=at², y=2at', difficulty: 'medium', type: 'practice' },
          { title: 'Chain rule for composite functions with multiple variables', difficulty: 'easy', type: 'concept' },
          { title: 'Derivative of inverse trigonometric functions', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'nth derivative of standard functions: e^ax, sin(bx)', difficulty: 'hard', type: 'practice' },
        ],
      },
      {
        name: 'Application of Derivatives',
        questions: [
          { title: 'Rolle\'s theorem and Lagrange\'s mean value theorem applications', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Rate of change: volume of sphere when radius increases', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Maxima and minima of functions using second derivative test', difficulty: 'medium', type: 'concept' },
          { title: 'Tangent and normal to a curve at a given point', difficulty: 'easy', type: 'practice' },
          { title: 'Monotonicity: intervals of increase and decrease', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Optimization problems: minimizing material for a container', difficulty: 'hard', type: 'practice' },
          { title: 'Concavity and points of inflection of a function', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Integration',
        questions: [
          { title: 'Integration by partial fractions for rational functions', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 2' },
          { title: 'Integration using trigonometric substitution', difficulty: 'medium', type: 'concept' },
          { title: 'Definite integral using properties: f(a-x) = f(x)', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 1' },
          { title: 'Reduction formulas for ∫sin^n(x)dx and ∫cos^n(x)dx', difficulty: 'hard', type: 'practice' },
          { title: 'Integration by parts: ∫x²e^x dx and ILATE rule', difficulty: 'easy', type: 'concept' },
          { title: 'Walli\'s formula for definite integrals of trig powers', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
          { title: 'Leibniz integral rule: differentiation under the integral sign', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Standard integrals involving √(a²-x²) and 1/(x²+a²)', difficulty: 'easy', type: 'practice' },
        ],
      },
      {
        name: 'Area Under Curves',
        questions: [
          { title: 'Area between parabola and line using definite integration', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 1' },
          { title: 'Area enclosed between two curves: x² = 4y and y² = 4x', difficulty: 'medium', type: 'concept' },
          { title: 'Area bounded by |x| + |y| = a using symmetry', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 1' },
          { title: 'Area of region defined by inequalities in the xy-plane', difficulty: 'hard', type: 'practice' },
          { title: 'Area between sine curve and x-axis over one period', difficulty: 'easy', type: 'practice' },
          { title: 'Area of ellipse using integration', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 2' },
          { title: 'Area using horizontal strips vs vertical strips comparison', difficulty: 'medium', type: 'concept' },
        ],
      },
      {
        name: 'Differential Equations',
        questions: [
          { title: 'Solving homogeneous differential equations by substitution y = vx', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Apr Shift 1' },
          { title: 'Linear first-order ODE: integrating factor method', difficulty: 'medium', type: 'concept' },
          { title: 'Formation of differential equation from a family of curves', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jul Shift 2' },
          { title: 'Bernoulli\'s equation reduction to linear form', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2022 Paper 2' },
          { title: 'Variable separable form and direct integration', difficulty: 'easy', type: 'concept' },
          { title: 'Orthogonal trajectory of a given family of curves', difficulty: 'hard', type: 'practice' },
          { title: 'Applications: Newton\'s law of cooling and population growth models', difficulty: 'medium', type: 'practice' },
        ],
      },
      {
        name: 'Vectors & 3D',
        questions: [
          { title: 'Scalar triple product and volume of parallelepiped', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2023 Jan Shift 2' },
          { title: 'Equation of plane passing through three non-collinear points', difficulty: 'medium', type: 'concept' },
          { title: 'Shortest distance between two skew lines', difficulty: 'hard', type: 'pyq', source: 'JEE Advanced 2023 Paper 2' },
          { title: 'Vector triple product and BAC-CAB rule', difficulty: 'medium', type: 'practice' },
          { title: 'Angle between a line and a plane using direction ratios', difficulty: 'easy', type: 'pyq', source: 'JEE Main 2022 Jun Shift 1' },
          { title: 'Image of a point in a plane using foot of perpendicular', difficulty: 'hard', type: 'practice' },
          { title: 'Line of intersection of two planes and its direction', difficulty: 'medium', type: 'concept' },
          { title: 'Coplanarity condition for four points in 3D space', difficulty: 'medium', type: 'pyq', source: 'JEE Main 2022 Jul Shift 1' },
        ],
      },
    ],
  },
};

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Drop tables in reverse dependency order
    console.log('Dropping existing tables...');
    await client.query('DROP TABLE IF EXISTS user_progress CASCADE');
    await client.query('DROP TABLE IF EXISTS questions CASCADE');
    await client.query('DROP TABLE IF EXISTS chapters CASCADE');
    await client.query('DROP TABLE IF EXISTS subjects CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Create tables
    console.log('Creating tables...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');

    await client.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE subjects (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE chapters (
        id SERIAL PRIMARY KEY,
        subject_id INT REFERENCES subjects(id),
        name TEXT NOT NULL,
        order_index INT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        chapter_id INT REFERENCES chapters(id),
        title TEXT NOT NULL,
        difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')) NOT NULL,
        type TEXT CHECK(type IN ('pyq','concept','practice')) NOT NULL,
        source TEXT,
        solution_url TEXT,
        notes TEXT,
        order_index INT NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE user_progress (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        question_id INT REFERENCES questions(id) ON DELETE CASCADE,
        status TEXT CHECK(status IN ('todo','done','revisit')) DEFAULT 'todo',
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, question_id)
      )
    `);

    // Seed subjects
    console.log('Seeding subjects...');
    const subjectIds = {};
    for (const subject of seedData.subjects) {
      const result = await client.query(
        'INSERT INTO subjects (name, slug) VALUES ($1, $2) RETURNING id',
        [subject.name, subject.slug]
      );
      subjectIds[subject.slug] = result.rows[0].id;
    }

    // Seed chapters and questions
    let totalQuestions = 0;
    let totalChapters = 0;

    for (const [subjectSlug, chapters] of Object.entries(seedData.chapters)) {
      const subjectId = subjectIds[subjectSlug];
      console.log(`Seeding ${subjectSlug} chapters...`);

      for (let chapterIdx = 0; chapterIdx < chapters.length; chapterIdx++) {
        const chapter = chapters[chapterIdx];

        const chapterResult = await client.query(
          'INSERT INTO chapters (subject_id, name, order_index) VALUES ($1, $2, $3) RETURNING id',
          [subjectId, chapter.name, chapterIdx + 1]
        );
        const chapterId = chapterResult.rows[0].id;
        totalChapters++;

        // Seed questions for this chapter
        for (let qIdx = 0; qIdx < chapter.questions.length; qIdx++) {
          const q = chapter.questions[qIdx];
          await client.query(
            `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, order_index)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              chapterId,
              q.title,
              q.difficulty,
              q.type,
              q.source || null,
              SOLUTION_URL,
              qIdx + 1,
            ]
          );
          totalQuestions++;
        }
      }
    }

    await client.query('COMMIT');

    console.log('\n--- Seed Summary ---');
    console.log(`Subjects: ${seedData.subjects.length}`);
    console.log(`Chapters: ${totalChapters}`);
    console.log(`Questions: ${totalQuestions}`);
    console.log('Seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
}

seed();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  // GROUP 1: Alkanes & Conformers (alkanes-conformers) - 8 questions
  {
    "pattern_group": "alkanes-conformers",
    "title": "Photochemical chlorination of isobutane yields two monochlorinated products. The major product is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Isobutyl chloride (1-chloro-2-methylpropane)",
      "B": "tert-Butyl chloride (2-chloro-2-methylpropane)",
      "C": "sec-Butyl chloride",
      "D": "n-Butyl chloride"
    },
    "notes": "Selectivity of chlorination ($1^\\circ : 2^\\circ : 3^\\circ = 1 : 3.8 : 5$) must be balanced against statistical probability (number of hydrogens).",
    "solution_text": "Isobutane, $(\\text{CH}_3)_3\\text{CH}$, has 9 primary ($1^\\circ$) hydrogens on the methyl groups and only 1 tertiary ($3^\\circ$) hydrogen. The relative rates of chlorination at $298\\,\\text{K}$ are $1^\\circ : 3^\\circ = 1 : 5$.\n- Relative rate of forming primary product (isobutyl chloride) = $9 \\times 1 = 9.0$.\n- Relative rate of forming tertiary product (tert-butyl chloride) = $1 \\times 5 = 5.0$.\nThus, the major product is isobutyl chloride (relative yield $\\approx 9.0 / (9.0 + 5.0) \\approx 64.3\\%$). Option A is correct.",
    "common_mistake": "Selecting tert-butyl chloride (Option B) by assuming the greater stability of the $3^\circ$ carbocation/radical guarantees it will be the major product, neglecting the statistical factor of 9:1 primary-to-tertiary hydrogens.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "The correct order of stability for the conformations of n-butane is:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Anti > Gauche > Partially Eclipsed > Fully Eclipsed",
      "B": "Anti > Gauche > Fully Eclipsed > Partially Eclipsed",
      "C": "Gauche > Anti > Partially Eclipsed > Fully Eclipsed",
      "D": "Anti > Partially Eclipsed > Gauche > Fully Eclipsed"
    },
    "notes": "Evaluate stability using torsional strain (eclipsed vs staggered) and steric/van der Waals strain (methyl-methyl interactions).",
    "solution_text": "Conformations of n-butane:\n1) Anti conformation (staggered, methyl groups at $180^\\circ$): Minimum torsional and steric strain (Most stable).\n2) Gauche conformation (staggered, methyl groups at $60^\\circ$): Staggered but has minor steric interaction between methyl groups.\n3) Partially Eclipsed conformation (methyl eclipsed with hydrogen): High torsional strain.\n4) Fully Eclipsed conformation (methyl eclipsed with methyl, $0^\\circ$ dihedral): Maximum torsional and steric strain (Least stable).\nTherefore, the stability order is Anti > Gauche > Partially Eclipsed > Fully Eclipsed. Option A is correct.",
    "common_mistake": "Reversing Gauche and Anti, or placing Fully Eclipsed as more stable than Partially Eclipsed.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "Which of the following alkanes cannot be prepared in good yield by the standard Wurtz reaction?",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "n-Butane",
      "B": "n-Hexane",
      "C": "n-Pentane",
      "D": "2,3-Dimethylbutane"
    },
    "notes": "Wurtz reaction involves coupling of two alkyl halides. Symmetrical products with even carbon counts give high yields.",
    "solution_text": "Wurtz reaction involves the reaction of alkyl halides with sodium metal in dry ether to form symmetrical alkanes containing an even number of carbon atoms ($2\\text{R}-\\text{X} + 2\\text{Na} \\rightarrow \\text{R}-\\text{R} + 2\\text{NaX}$).\nTo prepare an unsymmetrical alkane like n-pentane ($\\text{C}_5\\text{H}_{12}$), we would need a mixture of two different alkyl halides (e.g. ethyl halide and propyl halide). This leads to a mixture of three products: n-butane, n-pentane, and n-hexane. These alkanes have close boiling points and are difficult to separate, resulting in a very poor yield of n-pentane. Option C is correct.",
    "common_mistake": "Selecting n-butane or 2,3-dimethylbutane, which are both symmetrical and easily prepared in high yield.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "For the chair conformation of methylcyclohexane, the methyl group is more stable in the equatorial position than the axial position. This stability difference is primarily due to:",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Angle strain in the axial position",
      "B": "1,3-diaxial steric interactions in the axial position",
      "C": "Torsional strain in the equatorial position",
      "D": "Ring flipping energy barriers"
    },
    "notes": "Examine the spatial arrangement of the axial methyl group relative to the axial hydrogens on C3 and C5.",
    "solution_text": "When the methyl group of methylcyclohexane is in the axial position, it sits close to the axial hydrogens on C3 and C5. This creates steric repulsion known as 1,3-diaxial interactions. When the chair ring-flips to place the methyl group in the equatorial position, it points away from the rest of the ring, eliminating these steric repulsions and lowering the overall potential energy. Option B is correct.",
    "common_mistake": "Attributing the difference to angle strain (Option A), but chair cyclohexane is free of angle strain.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "Identify the starting materials required to prepare ethylcyclohexane in high yield using the Corey-House synthesis:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Ethyl chloride and cyclohexyl chloride with sodium metal",
      "B": "Lithium dicyclohexylcopper (Gilman reagent) and ethyl iodide",
      "C": "Cyclohexene and ethane in the presence of peroxide",
      "D": "Cyclohexyl chloride and ethyl alcohol"
    },
    "notes": "Corey-House synthesis couples a Gilman reagent (lithium dialkylcopper, $\\text{R}_2\\text{CuLi}$) with a primary alkyl halide ($\\text{R}'\\text{X}$).",
    "solution_text": "Corey-House synthesis is an excellent method for synthesizing unsymmetrical alkanes ($\\text{R}-\\text{R}'$). It involves reacting a Gilman reagent (lithium dialkylcopper, $\\text{R}_2\\text{CuLi}$) with a primary alkyl halide ($\\text{R}'\\text{X}$ via an $\\text{S}_N2$ pathway). To synthesize ethylcyclohexane, we can react lithium dicyclohexylcopper, $(\\text{C}_6\\text{H}_{11})_2\\text{CuLi}$, with ethyl iodide, $\\text{CH}_3\\text{CH}_2\\text{I}$, to form the $\\text{C}-\\text{C}$ bond cleanly without side products like Wurtz coupling. Option B is correct.",
    "common_mistake": "Choosing Option A, which is the Wurtz reaction and would yield a mixture of diethyl, dicyclohexyl, and ethylcyclohexane.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "Electrolysis of an aqueous solution of sodium succinate yields which of the following gases at the anode?",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Ethane and $\\text{CO}_2$",
      "B": "Ethene and $\\text{CO}_2$",
      "C": "Ethyne and $\\text{CO}_2$",
      "D": "Propene and $\\text{CO}_2$"
    },
    "notes": "Succinate is a dicarboxylate: $^-\\text{OOC}-\\text{CH}_2-\\text{CH}_2-\\text{COO}^-$. Radical coupling occurs intramolecularly.",
    "solution_text": "Kolbe's electrolytic method of sodium succinate ($^-\\text{OOC}-\\text{CH}_2-\\text{CH}_2-\\text{COO}^-$) proceeds via oxidation of the carboxylate ions at the anode:\n1) $^-\\text{OOC}-\\text{CH}_2-\\text{CH}_2-\\text{COO}^- \\rightarrow ^\\bullet\\text{OOC}-\\text{CH}_2-\\text{CH}_2-\\text{COO}^\\bullet + 2e^-$\n2) Decarboxylation yields a diradical: $^\\bullet\\text{CH}_2-\\text{CH}_2^\bullet + 2\\text{CO}_2$\n3) Intramolecular combination of the radical centers creates a double bond: $\\text{CH}_2=\\text{CH}_2$ (ethene).\nThus, ethene and $\\text{CO}_2$ are released at the anode. Option B is correct.",
    "common_mistake": "Selecting ethane (Option A), forgetting that succinate is a dicarboxylic acid derivative and forms a double bond rather than linking two separate carbon fragments.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "The number of structurally isomeric monochloro derivatives possible for 2-methylbutane is ________.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "4",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Identify all non-equivalent carbon positions in 2-methylbutane: $(\\text{CH}_3)_2\\text{CH}-\\text{CH}_2-\\text{CH}_3$.",
    "solution_text": "Structure of 2-methylbutane:\n$\\text{C}^1\\text{H}_3-\\text{C}^2\\text{H}(\\text{C}^{1'}\\text{H}_3)-\\text{C}^3\\text{H}_2-\\text{C}^4\\text{H}_3$.\nLet's replace one hydrogen atom at different carbon positions with chlorine to find the structural isomers:\n1) Substitution at C1 or C1' (equivalent methyls): $\\text{Cl}-\\text{CH}_2-\\text{CH}(\\text{CH}_3)-\\text{CH}_2-\\text{CH}_3$ (1-chloro-2-methylbutane).\n2) Substitution at C2 (tertiary carbon): $(\\text{CH}_3)_2\\text{C(Cl)}-\\text{CH}_2-\\text{CH}_3$ (2-chloro-2-methylbutane).\n3) Substitution at C3 (secondary carbon): $(\\text{CH}_3)_2\\text{CH}-\\text{CH(Cl)}-\\text{CH}_3$ (2-chloro-3-methylbutane, or 3-chloro-2-methylbutane).\n4) Substitution at C4 (primary methyl carbon): $(\\text{CH}_3)_2\\text{CH}-\\text{CH}_2-\\text{CH}_2-\\text{Cl}$ (1-chloro-3-methylbutane).\nThis yields exactly 4 structurally distinct monochloro isomers.",
    "common_mistake": "Counting C1 and C1' as different positions and reporting 5, or forgetting C4 entirely.",
    "concept_slugs": ["alkanes-conformers"]
  },
  {
    "pattern_group": "alkanes-conformers",
    "title": "For 1,2-ethanediol (ethylene glycol), the most stable conformation is the gauche form, which is more stable than the anti form. This exception to the normal staggered rule is due to:",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Steric relief of bulky hydroxyl groups",
      "B": "Intramolecular hydrogen bonding in the gauche form",
      "C": "Dipole-dipole repulsion in the anti form",
      "D": "Hyperconjugation between C-C bonds"
    },
    "notes": "Look for non-covalent attractive interactions that can stabilize a conformation despite higher steric crowding.",
    "solution_text": "Normally, the anti conformation is the most stable for butane-like structures because it minimizes steric and torsional strain. However, in 1,2-ethanediol (ethylene glycol, $\\text{HO}-\\text{CH}_2-\\text{CH}_2-\\text{OH}$), the gauche conformation brings the two highly polar $-\\text{OH}$ groups close enough ($60^\circ$ dihedral angle) to form a stable 5-membered ring via intramolecular hydrogen bonding ($\\text{O}-\\text{H}\\cdots\\text{O}$). This hydrogen bonding stabilizes the gauche form by $\\approx 8-12\\,\\text{kJ/mol}$ relative to the anti form. Option B is correct.",
    "common_mistake": "Selecting Option C, assuming that dipole-dipole interactions make the anti form unstable, rather than recognizing the positive stabilizing effect of hydrogen bonding in the gauche form.",
    "concept_slugs": ["alkanes-conformers"]
  },

  // GROUP 2: Alkenes: Synthesis & Elimination Rules (alkenes-elimination) - 8 questions
  {
    "pattern_group": "alkenes-elimination",
    "title": "Dehydrohalogenation of 2-bromobutane with $\\text{alcoholic KOH}$ gives two main isomers of 2-butene. The major product and the rule governing its formation are:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "cis-2-butene (Hofmann rule)",
      "B": "trans-2-butene (Saytzeff rule)",
      "C": "1-butene (Saytzeff rule)",
      "D": "trans-2-butene (Hofmann rule)"
    },
    "notes": "E2 elimination. Saytzeff's rule dictates that the more substituted, conjugated, or sterically relaxed alkene is the major product.",
    "solution_text": "During dehydrohalogenation of 2-bromobutane with $\\text{alcoholic KOH}$ (a strong base), E2 elimination occurs. The base can abstract a proton from either C1 or C3:\n- Proton abstraction from C1 yields 1-butene (monosubstituted alkene).\n- Proton abstraction from C3 yields 2-butene (disubstituted alkene).\nAccording to Saytzeff's rule, the more substituted alkene is the major product because it is thermodynamically more stable. Among the 2-butene isomers, trans-2-butene is more stable than cis-2-butene due to lesser steric clash between the two methyl groups. Thus, trans-2-butene is the major product. Option B is correct.",
    "common_mistake": "Selecting 1-butene (Option C) because C1 has more hydrogens (statistical preference), forgetting that E2 elimination is thermodynamically controlled and favors the more substituted product under standard bases.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "To convert 2-butyne to trans-2-butene, the appropriate reagent is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{H}_2$ in the presence of $\\text{Pd/BaSO}_4$ and quinoline",
      "B": "$\\text{Na}$ in liquid $\\text{NH}_3$",
      "C": "$\\text{LiAlH}_4$ in ether",
      "D": "$\\text{B}_2\\text{H}_6$ followed by acetic acid"
    },
    "notes": "Birch reduction of alkynes yields trans-alkenes, whereas poisoned catalytic hydrogenation (Lindlar's) yields cis-alkenes.",
    "solution_text": "The partial reduction of internal alkynes to alkenes depends on the reagents:\n- $\\text{Na}$ or $\\text{Li}$ in liquid $\\text{NH}_3$ (Birch reduction) proceeds via a radical anion intermediate and protonation to yield the thermodynamically more stable trans-alkene (anti-addition of hydrogens).\n- $\\text{H}_2/\\text{Pd/BaSO}_4$ with quinoline (Lindlar's catalyst) yields the cis-alkene (syn-addition of hydrogens).\nThus, to prepare trans-2-butene, we use $\\text{Na/liq. }\\text{NH}_3$. Option B is correct.",
    "common_mistake": "Selecting Lindlar's catalyst (Option A), which stereoselectively yields cis-2-butene.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "The ease of acid-catalyzed dehydration of the following alcohols follows the order:\n1) $\\text{CH}_3\\text{CH}_2\\text{OH}$\n2) $(\\text{CH}_3)_2\\text{CHOH}$\n3) $(\\text{CH}_3)_3\\text{COH}$",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "1 > 2 > 3",
      "B": "3 > 2 > 1",
      "C": "3 > 1 > 2",
      "D": "2 > 3 > 1"
    },
    "notes": "Acid-catalyzed dehydration of alcohols occurs via an E1 pathway. The rate-determining step is carbocation formation.",
    "solution_text": "Dehydration of alcohols in the presence of acid goes through a carbocation intermediate (E1 mechanism):\n- $(\\text{CH}_3)_3\\text{COH}$ (3) forms a tertiary ($3^\\circ$) carbocation, $(\\text{CH}_3)_3\\text{C}^+$, which is highly stabilized by $+I$ and 9 alpha-hydrogens (hyperconjugation).\n- $(\\text{CH}_3)_2\\text{CHOH}$ (2) forms a secondary ($2^\\circ$) carbocation with 6 alpha-hydrogens.\n- $\\text{CH}_3\\text{CH}_2\\text{OH}$ (1) forms a primary ($1^\\circ$) carbocation with 3 alpha-hydrogens.\nSince tertiary carbocations are much easier to form than secondary and primary, the ease of dehydration follows the order: $3^\\circ > 2^\circ > 1^\circ$ (3 > 2 > 1). Option B is correct.",
    "common_mistake": "Ordering as 1 > 2 > 3, confusing the ease of elimination with steric hindrance in substitution reactions.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "Heating the quaternary ammonium hydroxide $(\\text{CH}_3)_3\\text{N}^+-\\text{CH}(\\text{CH}_3)\\text{CH}_2\\text{CH}_3\\,\\text{OH}^-$ yields which alkene as the major product?",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "trans-2-Butene",
      "B": "cis-2-Butene",
      "C": "1-Butene",
      "D": "Ethene"
    },
    "notes": "Hofmann elimination of quaternary ammonium hydroxides favors the formation of the least substituted, least stable alkene.",
    "solution_text": "Hofmann elimination occurs when quaternary ammonium hydroxides are heated. The leaving group is a bulky amine, $(\\text{CH}_3)_3\\text{N}$. Due to the bulky leaving group and the carbanion-like transition state, the base abstracts the most acidic hydrogen (which is on the least substituted beta-carbon, as it is less sterically hindered and forms a more stable carbanion transition state).\nFor $(\\text{CH}_3)_3\\text{N}^+-\\text{CH}(\\text{CH}_3)\\text{C}^\\beta\\text{H}_2-\\text{CH}_3$:\n- The beta-hydrogens are on the methyl group (C1) and C3.\n- The methyl group (C1) hydrogens are more acidic and less sterically blocked than C3 hydrogens.\n- Deprotonation at C1 yields 1-butene. Option C is correct.",
    "common_mistake": "Selecting trans-2-butene (Option A), which would be the Saytzeff product favored in standard alkyl halide eliminations but not in Hofmann elimination of quaternary salts.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "When trans-1-bromo-2-methylcyclohexane is heated with strong base, E2 elimination occurs to give a single major product. The structure of this major product is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "1-methylcyclohexene",
      "B": "3-methylcyclohexene",
      "C": "Methylenecyclohexane",
      "D": "4-methylcyclohexene"
    },
    "notes": "E2 elimination in cyclohexane rings requires the leaving group and the beta-hydrogen to be trans-diaxial (anti-periplanar).",
    "solution_text": "In cyclohexanes, E2 elimination can only occur if the leaving group ($\\text{Br}$) and the adjacent $\\beta$-hydrogen are trans-diaxial (anti-periplanar, $180^\circ$ dihedral angle).\nIn trans-1-bromo-2-methylcyclohexane, both the bromine and the methyl group are trans to each other (one is axial, the other is equatorial, or both are equatorial). To undergo elimination, the bromine must occupy the axial position.\n- In this conformation, the hydrogen on C2 (bearing the methyl group) is equatorial because the methyl is axial. Thus, the H on C2 cannot be trans-diaxial to the Br.\n- The only available trans-diaxial beta-hydrogen is on C6 (which is axial). Therefore, elimination occurs exclusively between C1 and C6 to yield 3-methylcyclohexene. Option B is correct.",
    "common_mistake": "Selecting 1-methylcyclohexene (Option A) by applying Saytzeff's rule directly, forgetting that the stereochemical requirement for trans-diaxial alignment in E2 overrides thermodynamic stability.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "Elimination of HBr from meso-1,2-dibromo-1,2-diphenylethane using $\\text{NaNH}_2$ gives:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "(E)-1-bromo-1,2-diphenylethene",
      "B": "(Z)-1-bromo-1,2-diphenylethene",
      "C": "diphenylacetylene",
      "D": "a racemic mixture of 1-bromo-1,2-diphenylethene"
    },
    "notes": "E2 elimination is stereospecific. Draw the Fischer projection of the meso isomer and rotate to place H and Br anti-periplanar.",
    "solution_text": "E2 is a stereospecific anti-elimination. If we draw the Newman projection of meso-1,2-dibromo-1,2-diphenylethane and rotate the C-C bond so that one hydrogen atom is anti ($180^\\circ$) to one of the bromine atoms, the two phenyl groups end up on the same side of the double bond (cis/Z configuration) and the remaining Br and H are on the other side. Consequently, elimination of $\\text{HBr}$ yields (Z)-1-bromo-1,2-diphenylethene. Option B is correct.",
    "common_mistake": "Selecting the (E) isomer (Option A) assuming that trans/E alkenes are always favored, neglecting the stereospecificity of the E2 mechanism on a meso diastereomer.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "Reaction of 2-bromo-2,3-dimethylbutane with potassium tert-butoxide ($\\text{t-BuOK}$) yields the major product:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "2,3-dimethyl-2-butene",
      "B": "2,3-dimethyl-1-butene",
      "C": "3,3-dimethyl-1-butene",
      "D": "2,3-dimethylbut-2-ene-1-ol"
    },
    "notes": "Evaluate the steric bulk of the base. Bulky bases like $\\text{t-BuO}^-$ favor abstraction of the most accessible primary hydrogens.",
    "solution_text": "2-bromo-2,3-dimethylbutane, $(\\text{CH}_3)_2\\text{CH}-\\text{C(Br)}(\\text{CH}_3)_2$, has two types of beta-hydrogens:\n- 1 tertiary hydrogen on C3.\n- 9 primary hydrogens on the three methyl groups (C1 and methyls attached to C2).\nWhen reacting with a highly bulky base like potassium tert-butoxide ($\\text{t-BuOK}$), the base is sterically hindered from reaching the internal tertiary hydrogen. Instead, it abstracts one of the highly accessible primary hydrogens. This leads to the Hofmann product, 2,3-dimethyl-1-butene, as the major product. Option B is correct.",
    "common_mistake": "Selecting 2,3-dimethyl-2-butene (Option A) which is the highly stable Saytzeff product, forgetting that bulky bases shift the E2 pathway towards kinetic/Hofmann control.",
    "concept_slugs": ["alkenes-elimination"]
  },
  {
    "pattern_group": "alkenes-elimination",
    "title": "The acid-catalyzed dehydration of 3,3-dimethylbutan-2-ol gives a rearranged alkene as the major product. The number of alpha-hydrogens ($\\alpha$-H) in this major product is ________.",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "12",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Trace the E1 dehydration pathway: protonation, loss of water to form carbocation, 1,2-methyl shift to form a more stable carbocation, followed by deprotonation.",
    "solution_text": "Let's trace the mechanism:\n1) Protonation of 3,3-dimethylbutan-2-ol, $(\\text{CH}_3)_3\\text{C}-\\text{CH(OH)}-\\text{CH}_3$, and loss of water yields a secondary ($2^\\circ$) carbocation: $(\\text{CH}_3)_3\\text{C}-\\text{C}^+\\text{H}-\\text{CH}_3$.\n2) A 1,2-methyl shift occurs from C3 to C2 to form a much more stable tertiary ($3^\\circ$) carbocation: $(\\text{CH}_3)_2\\text{C}^+-\\text{CH}(\\text{CH}_3)_2$.\n3) Deprotonation by weak base (water) occurs to give the most substituted and stable alkene: tetramethylethylene (2,3-dimethyl-2-butene), $(\\text{CH}_3)_2\\text{C}=\\text{C}(\\text{CH}_3)_2$.\n4) The product $(\\text{CH}_3)_2\\text{C}=\\text{C}(\\text{CH}_3)_2$ contains four methyl groups directly attached to the double-bonded carbons. Therefore, it has $4 \\times 3 = 12$ alpha-hydrogens, making it highly stable.",
    "common_mistake": "Writing 6 or 9, by assuming no methyl rearrangement occurs or failing to count the methyls on both sides of the symmetrical double bond.",
    "concept_slugs": ["alkenes-elimination"]
  },

  // GROUP 3: Alkenes: Addition & Oxidation Reactions (alkenes-additions) - 8 questions
  {
    "pattern_group": "alkenes-additions",
    "title": "Hydroboration-oxidation of 1-methylcyclopentene gives:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "trans-2-methylcyclopentanol",
      "B": "cis-2-methylcyclopentanol",
      "C": "1-methylcyclopentanol",
      "D": "a mixture of cis and trans-2-methylcyclopentanol"
    },
    "notes": "Hydroboration-oxidation is a syn-addition of water across the double bond with anti-Markovnikov regiochemistry.",
    "solution_text": "Hydroboration-oxidation of an alkene adds H and OH across the double bond:\n1) Regiochemistry: anti-Markovnikov. The boron adds to the less hindered carbon (C2), putting the $-\\text{OH}$ group on C2 and $-\\text{H}$ on C1.\n2) Stereochemistry: syn-addition. Boron and hydrogen add to the same face of the ring double bond.\nSince the H and OH are added syn (on the same side), the methyl group on C1 is pushed to the opposite side. Consequently, the $-\\text{OH}$ group and the methyl group are trans to each other, yielding trans-2-methylcyclopentanol. Option A is correct.",
    "common_mistake": "Selecting 1-methylcyclopentanol (Option C), which is the Markovnikov hydration product (obtained via acid-catalyzed hydration or oxymercuration-demercuration).",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "An organic compound A ($\\text{C}_6\\text{H}_{10}$) on reductive ozonolysis yields hexanedial as the only product. The compound A is:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "1,3-cyclohexadiene",
      "B": "cyclohexene",
      "C": "methylcyclopentene",
      "D": "1-hexene"
    },
    "notes": "Since only a single dicarbonyl compound is formed from a $\\text{C}_6$ alkene, the reactant must be a symmetrical cyclic alkene.",
    "solution_text": "Reductive ozonolysis cleaves the $\\text{C}=\\text{C}$ double bond and inserts carbonyl groups ($=\\text{O}$) at both carbons. Since the product is hexanedial, $\\text{OHC}-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CHO}$ (a 6-carbon dialdehyde), the starting material must have been a 6-carbon cyclic alkene. Cleaving the double bond of cyclohexene opens the ring to form hexanedial. Option B is correct.",
    "common_mistake": "Choosing 1,3-cyclohexadiene (Option A) which has two double bonds and would yield two fragments (succinaldehyde and glyoxal).",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "Addition of bromine ($\\text{Br}_2$) in $\\text{CCl}_4$ to trans-2-butene yields:",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Racemic 2,3-dibromobutane",
      "B": "Meso-2,3-dibromobutane",
      "C": "d-2,3-dibromobutane",
      "D": "l-2,3-dibromobutane"
    },
    "notes": "Bromination proceeds via a cyclic bromonium ion, which forces an anti-addition of the two bromine atoms.",
    "solution_text": "Bromination of an alkene is an anti-addition:\n- For a trans-alkene, anti-addition of identical groups yields a meso compound (symmetry is preserved).\n- For a cis-alkene, anti-addition yields a racemic mixture of enantiomers.\nTherefore, trans-2-butene + $\\text{Br}_2$ gives meso-2,3-dibromobutane. Option B is correct.",
    "common_mistake": "Selecting racemic mixture (Option A), which is the product of anti-addition on cis-2-butene.",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "Oxymercuration-demercuration of 3,3-dimethyl-1-butene gives which of the following as the major product?",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "2,3-dimethyl-2-butanol",
      "B": "3,3-dimethyl-2-butanol",
      "C": "3,3-dimethyl-1-butanol",
      "D": "2,2-dimethyl-3-butanol"
    },
    "notes": "Compare the carbocation intermediate of acid-catalyzed hydration with the mercurinium ion intermediate in oxymercuration.",
    "solution_text": "Oxymercuration-demercuration adds water across a double bond with Markovnikov regiochemistry. Crucially, the intermediate is a cyclic mercurinium ion, not a free carbocation. Because there is no free carbocation intermediate, no skeletal rearrangements (like methyl or hydride shifts) occur. Thus, the $-\\text{OH}$ group adds directly to the C2 carbon of 3,3-dimethyl-1-butene, giving 3,3-dimethyl-2-butanol. Option B is correct. (In contrast, acid-catalyzed hydration would involve rearrangement to give 2,3-dimethyl-2-butanol).",
    "common_mistake": "Choosing 2,3-dimethyl-2-butanol (Option A), which is the rearranged product obtained only when a free carbocation is formed (such as in acid-catalyzed hydration).",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "The major product of the reaction of 3-methyl-1-butene with $\\text{HBr}$ in the presence of benzoyl peroxide is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "2-bromo-3-methylbutane",
      "B": "1-bromo-3-methylbutane",
      "C": "2-bromo-2-methylbutane",
      "D": "1-bromo-2-methylbutane"
    },
    "notes": "In the presence of peroxides, $\\text{HBr}$ addition goes through a free radical mechanism (anti-Markovnikov addition).",
    "solution_text": "The reaction of 3-methyl-1-butene, $(\\text{CH}_3)_2\\text{CH}-\\text{CH}=\\text{CH}_2$, with $\\text{HBr}$ in the presence of peroxides proceeds via a free-radical chain mechanism (Kharasch effect):\n1) $\\text{Br}^\bullet$ radical attacks the double bond first to form the more stable carbon radical: $(\\text{CH}_3)_2\\text{CH}-\\text{C}^\bullet\\text{H}-\\text{CH}_2-\\text{Br}$ (secondary radical stabilized by $+I$ and hyperconjugation).\n2) The radical abstracts a hydrogen atom from $\\text{HBr}$ to form 1-bromo-3-methylbutane.\nThis is an anti-Markovnikov addition. Option B is correct.",
    "common_mistake": "Selecting 2-bromo-2-methylbutane (Option C), which is the rearranged product of the electrophilic addition of $\\text{HBr}$ *without* peroxides.",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "Reaction of cis-2-butene with cold, dilute alkaline $\\text{KMnO}_4$ solution (Baeyer's reagent) gives:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Racemic butane-2,3-diol",
      "B": "Meso-butane-2,3-diol",
      "C": "Butan-2-one",
      "D": "Acetaldehyde"
    },
    "notes": "Dilute alkaline $\\text{KMnO}_4$ performs a syn-dihydroxylation. Apply stereochemical rules for syn addition to cis alkenes.",
    "solution_text": "Hydroxylation using Baeyer's reagent (cold, dilute, alkaline $\\text{KMnO}_4$) is a syn-addition of two hydroxyl groups across the double bond:\n- Syn-addition to a cis-alkene yields the meso compound (meso-butane-2,3-diol), as the two $-\\text{OH}$ groups add to the same face, preserving the internal plane of symmetry.\n- Syn-addition to a trans-alkene yields a racemic mixture.\nOption B is correct.",
    "common_mistake": "Selecting racemic butane-2,3-diol (Option A), which is obtained via anti-dihydroxylation (e.g. epoxidation followed by acid hydrolysis) of cis-2-butene.",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "Epoxidation of cyclohexene with mCPBA followed by acid-catalyzed hydrolysis yields:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "cis-cyclohexane-1,2-diol",
      "B": "trans-cyclohexane-1,2-diol",
      "C": "cyclohexanone",
      "D": "adipic acid"
    },
    "notes": "mCPBA adds oxygen to form a 3-membered epoxide ring (syn addition). Acid-catalyzed ring opening occurs via backside attack of water.",
    "solution_text": "Reaction sequence:\n1) Cyclohexene + mCPBA forms cyclohexene oxide (epoxide ring, syn face).\n2) In acid, the epoxide oxygen is protonated. Water attacks one of the carbons from the backside (anti-attack) to open the ring.\n3) This results in the two hydroxyl groups being trans to each other, giving trans-cyclohexane-1,2-diol. Option B is correct.",
    "common_mistake": "Selecting cis-cyclohexane-1,2-diol (Option A), neglecting that ring opening of epoxides involves nucleophilic backside attack, which inverts stereochemistry at one carbon, leading to net anti-addition.",
    "concept_slugs": ["alkenes-additions"]
  },
  {
    "pattern_group": "alkenes-additions",
    "title": "Reductive ozonolysis ($\\text{O}_3$, followed by $\\text{Zn/H}_2\\text{O}$) of 1-methylcyclohexene yields which of the following dicarbonyl compounds?",
    "difficulty": "easy",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Hexanedial",
      "B": "6-Oxoheptanal",
      "C": "5-Oxohexanal",
      "D": "Heptanedial"
    },
    "notes": "Identify the double bond carbons and cleave them to form carbonyl groups. One will be a ketone and the other an aldehyde.",
    "solution_text": "1-methylcyclohexene has a double bond between C1 (which has the methyl substituent) and C2. Under reductive ozonolysis, the C1=C2 bond is cleaved:\n- C1 (with methyl group) becomes a ketone group: $\\text{CH}_3-\\text{CO}-$.\n- C2 (with a hydrogen) becomes an aldehyde group: $-\\text{CHO}$.\nOpening the 6-membered ring gives a 7-carbon chain: $\\text{CH}_3-\\text{CO}-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CH}_2-\\text{CHO}$ (6-oxoheptanal). Option B is correct.",
    "common_mistake": "Choosing hexanedial (Option A), which has only 6 carbons and is formed by the ozonolysis of cyclohexene itself (without the methyl group).",
    "concept_slugs": ["alkenes-additions"]
  },

  // GROUP 4: Alkynes: Synthesis, Acidity & Hydration (alkynes-reactions) - 8 questions
  {
    "pattern_group": "alkynes-reactions",
    "title": "The major product obtained when propyne is treated with $\\text{dilute H}_2\\text{SO}_4$ in the presence of $\\text{HgSO}_4$ is:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Propanal",
      "B": "Acetone",
      "C": "Propan-1-ol",
      "D": "Propan-2-ol"
    },
    "notes": "Kucherov reaction adds water to alkynes with Markovnikov regiochemistry to form an enol, which tautomerizes to a carbonyl compound.",
    "solution_text": "The hydration of propyne ($\\text{CH}_3-\\text{C}\\equiv\\text{CH}$) in the presence of $\\text{Hg}^{2+}/\\text{H}^+$ is the Kucherov reaction:\n1) Regiochemistry: Markovnikov addition of water. $-\\text{OH}$ adds to C2 and $-\\text{H}$ adds to C1.\n2) This yields an enol intermediate: $\\text{CH}_3-\\text{C}(\\text{OH})=\\text{CH}_2$.\n3) The enol is unstable and rapidly tautomerizes to the more stable keto form: $\\text{CH}_3-\\text{CO}-\\text{CH}_3$ (acetone/propanone).\nOption B is correct.",
    "common_mistake": "Selecting propanal (Option A), which would be the anti-Markovnikov hydration product.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "The reagents and order of reactions to convert acetylene into 2-butyne are:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{NaNH}_2$ (2 eq) followed by $\\text{CH}_3\\text{I}$ (2 eq)",
      "B": "$\\text{Na}$ in liquid $\\text{NH}_3$ followed by ethyl bromide",
      "C": "$\\text{alc. KOH}$ followed by methyl iodide",
      "D": "$\\text{H}_2/\\text{Pd}$ followed by chloromethane"
    },
    "notes": "Use strong base to deprotonate the acidic terminal C-H bonds of acetylene, then perform alkylation via an $\\text{S}_N2$ pathway.",
    "solution_text": "Acetylene (ethyne, $\\text{HC}\\equiv\\text{CH}$) has two acidic terminal protons. Treating it with 2 equivalents of a very strong base like sodamide ($\\text{NaNH}_2$) deprotonates it to form sodium acetylide, $\\text{Na}^+ \\, ^-\\text{C}\\equiv\\text{C}^- \\, \\text{Na}^+$. Adding 2 equivalents of methyl iodide ($\\text{CH}_3\\text{I}$) leads to double nucleophilic substitution ($\\text{S}_N2$) to yield 2-butyne ($\\text{CH}_3-\\text{C}\\equiv\\text{C}-\\text{CH}_3$). Option A is correct.",
    "common_mistake": "Choosing $\\text{alc. KOH}$ (Option C), which is not basic enough to deprotonate terminal alkynes (pKa $\\approx 25$; $\\text{OH}^-$ cannot deprotonate it, whereas $\\text{NH}_2^-$ with conjugate acid pKa $\\approx 38$ is suitable).",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "The correct order of acidic strength among the following hydrocarbons is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Ethyne > Ethene > Ethane",
      "B": "Ethane > Ethene > Ethyne",
      "C": "Ethene > Ethyne > Ethane",
      "D": "Ethyne > Ethane > Ethene"
    },
    "notes": "Evaluate the hybridization of the carbon atom bearing the hydrogen. Higher s-character makes the carbon more electronegative.",
    "solution_text": "The acidity of hydrocarbons depends on the hybridization of the carbon carbon-hydrogen bond:\n- Ethyne ($\\text{HC}\\equiv\\text{CH}$): Carbon is $sp$ hybridized ($50\\%$ s-character).\n- Ethene ($\\text{H}_2\\text{C}=\\text{CH}_2$): Carbon is $sp^2$ hybridized ($33.3\\%$ s-character).\n- Ethane ($\\text{H}_3\\text{C}-\\text{CH}_3$): Carbon is $sp^3$ hybridized ($25\\%$ s-character).\nSince s-orbitals are closer to the nucleus, electrons in an orbital with higher s-character are held more tightly, making the conjugate base (carbanion) more stable. Thus, acidity order is: $sp > sp^2 > sp^3$ (Ethyne > Ethene > Ethane). Option A is correct.",
    "common_mistake": "Selecting Option B, confusing carbanion stability with carbocation stability.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "Passing acetylene through a red-hot iron tube at $873\\,\\text{K}$ results in cyclic polymerization to form:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Cyclooctatetraene",
      "B": "Benzene",
      "C": "Toluene",
      "D": "Mesitylene"
    },
    "notes": "This is a classic thermal trimerization reaction of acetylene to form a highly resonance-stabilized aromatic ring.",
    "solution_text": "When acetylene (ethyne) is passed through a red-hot iron tube at $873\\,\\text{K}$, three molecules of ethyne undergo cyclic trimerization to yield a molecule of benzene ($3\\text{C}_2\\text{H}_2 \\rightarrow \\text{C}_6\\text{H}_6$). Option B is correct.",
    "common_mistake": "Selecting cyclooctatetraene (Option A) which would be a tetramerization product.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "Ozonolysis of but-2-yne followed by treatment with water (zinc-free) yields:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Acetaldehyde",
      "B": "Acetic acid",
      "C": "Butane-2,3-dione",
      "D": "Ethyl alcohol"
    },
    "notes": "Unlike alkenes, ozonolysis of alkynes cleaves the triple bond to form carboxylic acids under oxidative/hydrolytic conditions.",
    "solution_text": "Ozonolysis of alkynes cleaves both the pi bonds and the sigma bond:\n1) But-2-yne, $\\text{CH}_3-\\text{C}\\equiv\\text{C}-\\text{CH}_3$, reacts with ozone to form an ozonide.\n2) Hydrolysis of this intermediate in the absence of a reducing agent (like Zn) leads to complete cleavage of the $\\text{C}-\\text{C}$ single bond, giving two molecules of acetic acid, $\\text{CH}_3\\text{COOH}$. Option B is correct.",
    "common_mistake": "Selecting butane-2,3-dione (Option C), which is the product of milder, non-cleavage oxidation pathways or reductive ozonolysis in some contexts.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "Addition of excess hydrochloric acid ($\\text{HCl}$) to propyne yields which of the following gem-dichlorides as the major product?",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "1,1-dichloropropane",
      "B": "2,2-dichloropropane",
      "C": "1,2-dichloropropane",
      "D": "1,3-dichloropropane"
    },
    "notes": "The addition of HX to alkynes follows Markovnikov's rule twice. The second addition is guided by resonance stabilization of the halogen atom.",
    "solution_text": "Addition of $\\text{HCl}$ to propyne ($\\text{CH}_3-\\text{C}\\equiv\\text{CH}$):\n1) First addition: H adds to C1 and Cl adds to C2 (Markovnikov rule) to form 2-chloropropene, $\\text{CH}_3-\\text{C(Cl)}=\\text{CH}_2$.\n2) Second addition: H again adds to C1 and Cl to C2. The carbocation at C2, $\\text{CH}_3-\\text{C}^+\\text{(Cl)}-\\text{CH}_3$, is stabilized by resonance (lone pair donation from the chlorine atom: $-\\text{C}^+-\\ddot{\\text{Cl}} \\leftrightarrow -\\text{C}=\\text{Cl}^+$). This yields 2,2-dichloropropane. Option B is correct.",
    "common_mistake": "Selecting 1,2-dichloropropane (Option C), which is formed by adding chlorine gas ($\\text{Cl}_2$) to propene, not by adding $\\text{HCl}$ to propyne.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "The minimum number of moles of sodamide ($\\text{NaNH}_2$) required to convert 1,2-dibromopropane into propyne is ________.",
    "difficulty": "hard",
    "type": "practice",
    "correct_answer": "3",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Account for the double dehydrohalogenation steps AND the acid-base reaction of the resulting terminal alkyne.",
    "solution_text": "Conversion of 1,2-dibromopropane to propyne:\n1) First elimination: 1 mole of $\\text{NaNH}_2$ removes one $\\text{HBr}$ to form 2-bromopropene.\n2) Second elimination: 1 mole of $\\text{NaNH}_2$ removes the second $\\text{HBr}$ to form propyne.\n3) Since propyne is a terminal alkyne (acidic proton), the strong base $\\text{NaNH}_2$ will immediately deprotonate it to form sodium propylide: $\\text{CH}_3-\\text{C}\\equiv\\text{CH} + \\text{NaNH}_2 \\rightarrow \\text{CH}_3-\\text{C}\\equiv\\text{C}^-\\text{Na}^+ + \\text{NH}_3$. This consumes a 3rd mole of base. (Propyne is regenerated during subsequent aqueous workup). Hence, a minimum of 3 moles of $\\text{NaNH}_2$ is required.",
    "common_mistake": "Writing 2 moles, forgetting that terminal alkynes are acidic enough to consume one mole of the strong amide base.",
    "concept_slugs": ["alkynes-reactions"]
  },
  {
    "pattern_group": "alkynes-reactions",
    "title": "Hydroboration-oxidation of propyne using disiamylborane followed by alkaline $\\text{H}_2\\text{O}_2$ yields:",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Propanone",
      "B": "Propanal",
      "C": "Propanoic acid",
      "D": "Propan-1-ol"
    },
    "notes": "Disiamylborane is a bulky borane that prevents double hydroboration and adds to terminal alkynes with anti-Markovnikov regiochemistry.",
    "solution_text": "Hydroboration-oxidation of a terminal alkyne:\n1) Disiamylborane is highly sterically hindered and adds syn and anti-Markovnikov across the triple bond of propyne ($\\text{CH}_3-\\text{C}\\equiv\\text{CH}$). The boron adds to the terminal C1, giving $\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{B(Sia)}_2$.\n2) Oxidation with alkaline $\\text{H}_2\\text{O}_2$ replaces the boron with $-\\text{OH}$, yielding the enol: $\\text{CH}_3-\\text{CH}=\\text{CH}-\\text{OH}$.\n3) Tautomerization of this enol gives propanal (an aldehyde). Option B is correct.",
    "common_mistake": "Selecting propanone (Option A), which is the product of Markovnikov hydration (Kucherov reaction).",
    "concept_slugs": ["alkynes-reactions"]
  },

  // GROUP 5: Aromatic Hydrocarbons & EAS Mechanism (aromatic-eas-mechanisms) - 8 questions
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "In the nitration of benzene using a mixture of concentrated $\\text{HNO}_3$ and concentrated $\\text{H}_2\\text{SO}_4$, the active electrophile is:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{NO}_3^-$",
      "B": "$\\text{NO}_2^+$",
      "C": "$\\text{NO}^+$",
      "D": "$\\text{HNO}_2$"
    },
    "notes": "Evaluate the acid-base reaction between $\\text{HNO}_3$ and $\\text{H}_2\\text{SO}_4$ that generates the electrophile.",
    "solution_text": "In the nitrating mixture, sulfuric acid is a stronger acid than nitric acid. $\\text{H}_2\\text{SO}_4$ protonates the $-\\text{OH}$ group of $\\text{HNO}_3$:\n$\\text{HNO}_3 + \\text{H}_2\\text{SO}_4 \\leftrightarrow \\text{H}_2\\text{O}^+-\\text{NO}_2 + \\text{HSO}_4^-$\nThe protonated species then loses water to form the nitronium ion:\n$\\text{H}_2\\text{O}^+-\\text{NO}_2 \\rightarrow \\text{H}_2\\text{O} + \\text{NO}_2^+$\nThe nitronium ion ($\\text{NO}_2^+$) is the active electrophile that attacks benzene. Option B is correct.",
    "common_mistake": "Selecting $\\text{NO}^+$ (Option C), which is the nitrosonium ion used in diazotization, not nitration.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "Friedel-Crafts alkylation of benzene with n-propyl chloride in the presence of anhydrous $\\text{AlCl}_3$ yields Cumene (isopropylbenzene) as the major product. This is due to:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$1,2$-hydride shift in the propyl carbocation",
      "B": "$1,2$-methyl shift in the propyl carbocation",
      "C": "Steric hindrance of the n-propyl group",
      "D": "Reversibility of the alkylation reaction"
    },
    "notes": "The primary propyl carbocation generated initially undergoes rearrangement to a more stable carbocation before attacking the ring.",
    "solution_text": "Mechanism:\n1) n-Propyl chloride reacts with the Lewis acid $\\text{AlCl}_3$ to form a primary carbocation complex: $\\text{CH}_3\\text{CH}_2\\text{CH}_2^+ \\,\\text{AlCl}_4^-$.\n2) Before electrophilic attack on the benzene ring can occur, this unstable $1^\circ$ carbocation undergoes a $1,2$-hydride shift to form the more stable secondary ($2^\circ$) isopropyl carbocation, $\\text{CH}_3-\\text{C}^+\\text{H}-\\text{CH}_3$.\n3) The isopropyl carbocation then attacks benzene to yield cumene (isopropylbenzene) as the major product. Option A is correct.",
    "common_mistake": "Assuming a methyl shift (Option B) occurs, whereas only a hydride shift is needed to convert the primary propyl cation to a secondary isopropyl cation.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "Which of the following cyclic compounds is non-aromatic in nature?",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "D",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Furan",
      "B": "Pyridine",
      "C": "Cycloheptatrienyl cation (tropylium ion)",
      "D": "Cycloheptatriene"
    },
    "notes": "Aromatic compounds must be cyclic, planar, fully conjugated, and have $4n+2$ pi-electrons. A single $sp^3$ hybridized carbon in the ring blocks conjugation.",
    "solution_text": "Let's check the structural requirements:\n- Furan: cyclic, planar, conjugated (lone pair on oxygen participates), $6\\pi$ electrons - Aromatic.\n- Pyridine: cyclic, planar, conjugated, $6\\pi$ electrons - Aromatic.\n- Tropylium cation: cyclic, planar, fully conjugated (positive charge on carbon provides an empty p-orbital), $6\\pi$ electrons - Aromatic.\n- Cycloheptatriene: contains a $-\\text{CH}_2-$ group (an $sp^3$ hybridized carbon) in the ring, which lacks a p-orbital. This blocks continuous conjugation around the ring, making it non-aromatic. Option D is correct.",
    "common_mistake": "Selecting tropylium cation (Option C) because it has a charge, forgetting that its ring is fully conjugated and highly stable.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "During the sulfonation of benzene with fuming sulfuric acid (oleum), the active electrophilic species is:",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{HSO}_3^+$",
      "B": "$\\text{SO}_3$",
      "C": "$\\text{SO}_4^{2-}$",
      "D": "$\\text{H}_3\\text{SO}_4^+$"
    },
    "notes": "Sulfonation is unique because the active electrophile is a neutral molecule with a highly electron-deficient sulfur atom.",
    "solution_text": "In concentrated sulfuric acid or oleum, sulfur trioxide ($\\text{SO}_3$) is generated via the equilibrium:\n$2\\text{H}_2\\text{SO}_4 \\leftrightarrow \\text{SO}_3 + \\text{H}_3\\text{O}^+ + \\text{HSO}_4^-$\nAlthough $\\text{SO}_3$ is neutral, the sulfur atom is bonded to three highly electronegative oxygen atoms, creating a strong partial positive charge on sulfur ($S^{\\delta+}$). This highly electrophilic sulfur atom attacks the benzene ring. Option B is correct.",
    "common_mistake": "Choosing a positively charged species like $\\text{HSO}_3^+$ (Option A) due to the assumption that all EAS electrophiles must be cations.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "The catalyst/reagent mixture used in the Gattermann-Koch reaction to convert benzene to benzaldehyde is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{CO} + \\text{HCl}$ in the presence of anhydrous $\\text{AlCl}_3$ and $\\text{CuCl}$",
      "B": "$\\text{HCN} + \\text{HCl}$ in the presence of $\\text{AlCl}_3$",
      "C": "$\\text{CHCl}_3 + \\text{KOH}$",
      "D": "$\\text{CO}_2 + \\text{NaOH}$"
    },
    "notes": "Recall the industrial/laboratory method for formylation of benzene using carbon monoxide.",
    "solution_text": "The Gattermann-Koch reaction formylates benzene to benzaldehyde. It uses carbon monoxide ($\\text{CO}$) and hydrochloric acid ($\\text{HCl}$) in the presence of anhydrous aluminium chloride ($\\text{AlCl}_3$) and copper(I) chloride ($\\text{CuCl}$) as catalysts. The reagents generate a transient formyl chloride species which acts as the electrophile source. Option A is correct.",
    "common_mistake": "Confusing it with the Gattermann aldehyde synthesis (Option B) which uses $\\text{HCN} + \\text{HCl}$.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "Friedel-Crafts alkylation of benzene with 1-chlorobutane and anhydrous $\\text{AlCl}_3$ gives which of the following as the major product?",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "sec-Butylbenzene",
      "B": "n-Butylbenzene",
      "C": "tert-Butylbenzene",
      "D": "Isobutylbenzene"
    },
    "notes": "Trace the carbocation rearrangement of the primary 1-butyl cation.",
    "solution_text": "When 1-chlorobutane reacts with $\\text{AlCl}_3$, a primary carbocation complex is formed: $\\text{CH}_3\\text{CH}_2\\text{CH}_2\\text{CH}_2^+ \\,\\text{AlCl}_4^-$. This primary carbocation is unstable and undergoes a $1,2$-hydride shift to form the more stable secondary carbocation: $\\text{CH}_3\\text{CH}_2-\\text{C}^+\\text{H}-\\text{CH}_3$. electrophilic attack of this secondary cation on benzene yields sec-butylbenzene (2-phenylbutane) as the major product. Option A is correct.",
    "common_mistake": "Selecting n-butylbenzene (Option B) by neglecting carbocation rearrangement, or tert-butylbenzene (Option C) by assuming it must rearrange all the way to tertiary (which is impossible without a methyl shift that would require a higher activation energy).",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "For which of the following electrophilic aromatic substitution reactions of benzene is a significant primary kinetic isotope effect ($k_H / k_D > 1$) observed?",
    "difficulty": "hard",
    "type": "practice",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Nitration",
      "B": "Chlorination",
      "C": "Sulfonation",
      "D": "Bromination"
    },
    "notes": "A kinetic isotope effect is observed if the rate-determining step involves the breaking of the C-H (or C-D) bond.",
    "solution_text": "In electrophilic aromatic substitution, the mechanism consists of two steps:\n1) Attack of the electrophile to form a cationic cyclohexadienyl intermediate (Wheland intermediate). This is usually the slow, rate-determining step.\n2) Elimination of a proton to restore aromaticity. This is usually very fast.\nBecause proton loss is not rate-determining, nitration and halogenation show no kinetic isotope effect ($k_H/k_D \\approx 1$). However, sulfonation is highly reversible, and the second step (deprotonation) has a high activation energy. Thus, the second step is rate-limiting in sulfonation, showing a significant primary kinetic isotope effect ($k_H/k_D \\approx 2-3$). Option C is correct.",
    "common_mistake": "Assuming all EAS reactions show an isotope effect, or selecting nitration (Option A) due to its high reaction rate.",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },
  {
    "pattern_group": "aromatic-eas-mechanisms",
    "title": "The number of monochloro derivatives (excluding stereoisomers) formed by the free radical chlorination of toluene under sunlight is ________.",
    "difficulty": "easy",
    "type": "advanced",
    "correct_answer": "1",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Distinguish between side-chain chlorination (radical pathway under light/heat) and ring chlorination (electrophilic pathway with Lewis acid).",
    "solution_text": "When toluene is treated with chlorine gas under sunlight/heat, the reaction proceeds via a free-radical mechanism. The benzyl radical ($\\text{C}_6\\text{H}_5\\text{CH}_2^\\bullet$) is extremely stable due to resonance stabilization with the aromatic ring. Therefore, chlorination occurs exclusively on the side-chain methyl group ($sp^3$ carbon), yielding benzyl chloride ($\\text{C}_6\\text{H}_5\\text{CH}_2\\text{Cl}$) as the sole monochlorinated product. Thus, the number of structural isomers is exactly 1.",
    "common_mistake": "Writing 3 or 4, by confusing side-chain radical chlorination with ring electrophilic chlorination (which yields ortho and para chlorotoluenes).",
    "concept_slugs": ["aromatic-eas-mechanisms"]
  },

  // GROUP 6: Directive Influence & Disubstituted Benzenes (directive-influence-eas) - 8 questions
  {
    "pattern_group": "directive-influence-eas",
    "title": "Nitration of aniline with concentrated $\\text{HNO}_3 - \\text{H}_2\\text{SO}_4$ mixture yields a significant amount ($~47\\%$) of meta-nitroaniline. This is because:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$-\\text{NH}_2$ group is meta-directing under normal conditions",
      "B": "In strongly acidic medium, aniline is protonated to form anilinium ion which is meta-directing",
      "C": "Nitric acid acts as a reducing agent",
      "D": "The reaction goes through a benzyne intermediate"
    },
    "notes": "Aniline is highly basic. Think about the dominant ionic species present in concentrated sulfuric acid.",
    "solution_text": "Aniline ($\\text{C}_6\\text{H}_5\\text{NH}_2$) contains a highly activating, ortho/para-directing $-\\text{NH}_2$ group. However, nitration requires a mixture of concentrated $\\text{H}_2\\text{SO}_4$ and $\\text{HNO}_3$. Under these strongly acidic conditions, the basic amine group is protonated to form the anilinium ion, $-\\text{NH}_3^+$. The positive charge makes the $-\\text{NH}_3^+$ group highly electron-withdrawing ($-I$ effect) and meta-directing. Because a substantial fraction of aniline exists as the anilinium ion, nitration yields a mixture containing about $51\\%$ para, $47\\%$ meta, and $2\\%$ ortho isomers. Option B is correct.",
    "common_mistake": "Assuming $-\\text{NH}_2$ itself directs to meta (Option A), or that the reaction undergoes an elimination-addition (benzyne) pathway.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "Chlorobenzene is ortho/para-directing in electrophilic aromatic substitution but is deactivated towards EAS relative to benzene. This is due to:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$-I$ effect dominates over $+M$ effect for activation, but $+M$ determines orientation",
      "B": "$+M$ effect dominates over $-I$ effect for activation",
      "C": "Only $-I$ effect operates",
      "D": "Resonance is completely inhibited in chlorobenzene"
    },
    "notes": "Evaluate the dual effects of halogens: inductive withdrawal (-I) vs resonance donation (+M).",
    "solution_text": "Halogens present two competing electronic effects:\n1) Inductive effect ($-I$): Halogens are highly electronegative and withdraw electron density from the sigma framework, deactivating the ring relative to benzene.\n2) Mesomeric/Resonance effect ($+M$): The lone pairs on halogen can be donated to the ring's pi system, stabilizing the cationic intermediate at the ortho and para positions.\nBecause the inductive withdrawal is stronger than the resonance donation, halogens are deactivating overall. However, the resonance stabilization still directs incoming electrophiles to the ortho and para positions. Option A is correct.",
    "common_mistake": "Selecting Option B, which is true for other ortho/para-directors like $-\\text{OCH}_3$ or $-\\text{OH}$ (which are activating).",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "To prepare p-nitroaniline from aniline, the amino group must first be protected by acetylation with acetic anhydride. The purpose of this acetylation is to:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Prevent oxidation of the amino group and decrease its strong activating power to avoid poly-nitration",
      "B": "Make the amino group meta-directing",
      "C": "Increase the solubility of aniline",
      "D": "Prevent the formation of anilinium hydrogen sulfate"
    },
    "notes": "Acetylation converts the amine to an amide, which delocalizes the nitrogen lone pair into the carbonyl group.",
    "solution_text": "Direct nitration of aniline is problematic because nitric acid is a strong oxidizing agent and oxidizes aniline, and aniline is protonated to meta-directing anilinium. To solve this, the $-\\text{NH}_2$ group is protected by acetylation to form acetanilide, $-\\text{NHCOCH}_3$. The lone pair of nitrogen is now delocalized into the carbonyl group ($-\\text{C}=\\text{O}$), which decreases its electron-donating power. This moderates activation, prevents oxidation/poly-nitration, and avoids protonation to the anilinium ion, allowing clean mono-substitution at the para position. Option A is correct.",
    "common_mistake": "Believing acetylation makes the group meta-directing (Option B), whereas amide is still ortho/para-directing.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "Arrange the following compounds in decreasing order of reactivity towards electrophilic nitration:\n1) $\\text{Benzene}$\n2) $\\text{Toluene}$\n3) $\\text{Nitrobenzene}$\n4) $\\text{Anisole}$",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "4 > 2 > 1 > 3",
      "B": "4 > 1 > 2 > 3",
      "C": "2 > 4 > 1 > 3",
      "D": "3 > 1 > 2 > 4"
    },
    "notes": "Nitration is electrophilic. Rate increases with electron-donating groups and decreases with electron-withdrawing groups.",
    "solution_text": "Substituent effects on Electrophilic Aromatic Substitution (EAS):\n- Anisole (4): Contains $-\\text{OCH}_3$, which is strongly activating via $+M$ effect.\n- Toluene (2): Contains $-\\text{CH}_3$, which is weakly activating via $+I$ and hyperconjugation.\n- Benzene (1): Reference compound.\n- Nitrobenzene (3): Contains $-\\text{NO}_2$, which is strongly deactivating via $-M$ and $-I$ effects.\nTherefore, the reactivity order is: Anisole > Toluene > Benzene > Nitrobenzene (4 > 2 > 1 > 3). Option A is correct.",
    "common_mistake": "Putting Toluene as more reactive than Anisole, forgetting that mesomeric donation ($+M$) of $-\\text{OCH}_3$ is much stronger than inductive/hyperconjugative donation of $-\\text{CH}_3$.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "When phenol is treated with excess bromine water, the white precipitate formed is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "o-bromophenol",
      "B": "p-bromophenol",
      "C": "2,4,6-tribromophenol",
      "D": "2,4-dibromophenol"
    },
    "notes": "Water is a highly polar solvent that increases the ionization of phenol to the highly activated phenoxide ion.",
    "solution_text": "Phenol is highly reactive towards electrophilic substitution. In the presence of a highly polar solvent like water, phenol ionizes significantly to the phenoxide ion ($\\text{C}_6\\text{H}_5\\text{O}^-$). The phenoxide ion has an extremely strong electron-donating resonance effect ($+M$), making the ring highly activated. Electrophilic bromination occurs rapidly at all available ortho and para positions to yield a white precipitate of 2,4,6-tribromophenol. Option C is correct. (Under non-polar solvents like $\\text{CS}_2$ at low temperature, mono-bromination is achieved instead).",
    "common_mistake": "Selecting mono-brominated products (Option A or B), which are only obtained when using a non-polar solvent like carbon disulfide ($\\text{CS}_2$) at low temperature to moderate the reaction.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "Birch reduction of anisole (methoxybenzene) with $\\text{Na}$ in liquid $\\text{NH}_3$ and ethanol yields:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "1-methoxy-1,4-cyclohexadiene",
      "B": "1-methoxy-1,3-cyclohexadiene",
      "C": "methoxycyclohexane",
      "D": "3-methoxy-1,4-cyclohexadiene"
    },
    "notes": "Anisole contains an electron-donating methoxy group. Birch reduction of benzene rings with electron-donating groups yields a 1,4-diene where the substituent is on the double bond.",
    "solution_text": "During Birch reduction, electron-donating groups (like $-\\text{OCH}_3$ in anisole) direct the reduction so that the carbons bearing the substituent and the para carbon do not receive hydrogens. The mechanism proceeds via electron addition, and protonation occurs at the positions that maximize the distance of negative charge from the electron-donating group. This results in the formation of 1-methoxy-1,4-cyclohexadiene (where C1 has the $-\\text{OCH}_3$ group and is part of a double bond). Option A is correct.",
    "common_mistake": "Selecting 1-methoxy-1,3-cyclohexadiene (Option B), which is a conjugated diene, whereas Birch reduction specifically yields non-conjugated 1,4-dienes.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "Friedel-Crafts acylation of toluene with acetyl chloride in the presence of anhydrous $\\text{AlCl}_3$ gives mainly:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "o-methylacetophenone",
      "B": "p-methylacetophenone",
      "C": "m-methylacetophenone",
      "D": "acetophenone"
    },
    "notes": "Evaluate the steric factors of the electrophile. The acylium ion ($CH_3CO^+$) is bulky.",
    "solution_text": "Toluene has a methyl group which is ortho/para-directing. The electrophile in Friedel-Crafts acylation is the acylium ion ($\\text{CH}_3\\text{CO}^+$). Due to the steric bulk of both the methyl group on the benzene ring and the incoming acylium electrophile, attack at the ortho position is sterically hindered. Thus, substitution occurs predominantly at the less hindered para position, yielding p-methylacetophenone as the major product. Option B is correct.",
    "common_mistake": "Choosing o-methylacetophenone (Option A), neglecting the steric clash between adjacent methyl and acetyl groups.",
    "concept_slugs": ["directive-influence-eas"]
  },
  {
    "pattern_group": "directive-influence-eas",
    "title": "To synthesize m-bromonitrobenzene from benzene, the correct sequence of reagents is:",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "First $\\text{Br}_2/\\text{FeBr}_3$ then $\\text{HNO}_3/\\text{H}_2\\text{SO}_4$",
      "B": "First $\\text{HNO}_3/\\text{H}_2\\text{SO}_4$ then $\\text{Br}_2/\\text{FeBr}_3$",
      "C": "Heat with $\\text{HBr}$ under light",
      "D": "First $\\text{HNO}_3/\\text{H}_2\\text{SO}_4$ then $\\text{CH}_3\\text{Br}/\\text{AlCl}_3$"
    },
    "notes": "Look at the directive influence of both groups. Nitro is meta-directing, while bromine is ortho/para-directing.",
    "solution_text": "To obtain m-bromonitrobenzene, the two groups must be meta to each other:\n- The nitro group ($-\\text{NO}_2$) is meta-directing.\n- The bromine atom ($-\\text{Br}$) is ortho/para-directing.\nIf we brominate first (Option A), the bromine will direct the subsequent nitration to the ortho/para positions, yielding p-bromonitrobenzene (and some ortho). If we nitrate first (Option B), the nitro group directs the subsequent bromination to the meta position, yielding m-bromonitrobenzene. Option B is correct.",
    "common_mistake": "Choosing Option A, which yields p-bromonitrobenzene as the major product.",
    "concept_slugs": ["directive-influence-eas"]
  }
];

// Write the questions to JSON file
const destPath = path.join(__dirname, 'hydrocarbons_questions.json');
fs.writeFileSync(destPath, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Successfully generated ${questions.length} Hydrocarbons questions in hydrocarbons_questions.json`);

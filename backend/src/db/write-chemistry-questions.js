import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  // GROUP 1: first-law-work (8 questions)
  {
    "pattern_group": "first-law-work",
    "title": "One mole of an ideal gas at $300\\,\\text{K}$ is expanded isothermally from $1\\,\\text{dm}^3$ to $10\\,\\text{dm}^3$. The change in internal energy ($\\Delta U$) of the gas is ________ $\\text{kJ}$.",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "0",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Recall the dependency of internal energy of an ideal gas on temperature.",
    "solution_text": "For an ideal gas, the internal energy $U$ depends only on the absolute temperature $T$. The change in internal energy is given by $\\Delta U = n C_v \\Delta T$. Since the process is isothermal, temperature is constant, so $\\Delta T = 0$. Therefore, $\\Delta U = 0\\,\\text{kJ}$.",
    "common_mistake": "Calculating work done using $W = -nRT \\ln(V_2/V_1)$ and setting $\\Delta U$ equal to that value, forgetting that $\\Delta U = 0$ for an isothermal process in ideal gases.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "A monatomic ideal gas ($C_v = 1.5R$) is expanded adiabatically and reversibly from an initial volume of $1\\,\\text{L}$ at $300\\,\\text{K}$ to a final volume of $8\\,\\text{L}$. The final temperature of the gas is ________ $\\text{K}$.",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "75",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Use the relation $T V^{\\gamma - 1} = \\text{constant}$ for reversible adiabatic process.",
    "solution_text": "For a monatomic ideal gas, $C_v = 1.5R$ and $C_p = C_v + R = 2.5R$, so the specific heat ratio is $\\gamma = 2.5/1.5 = 5/3$. In a reversible adiabatic process: $T_1 V_1^{\\gamma - 1} = T_2 V_2^{\\gamma - 1} \\implies T_2 = T_1 \\left(\\frac{V_1}{V_2}\\right)^{\\gamma - 1}$. Substituting the values: $T_2 = 300 \\times \\left(\\frac{1}{8}\\right)^{2/3} = 300 \\times \\frac{1}{4} = 75\\,\\text{K}$.",
    "common_mistake": "Using $\\gamma$ instead of $\\gamma - 1$ as the exponent, leading to $300 \\times (1/8)^{5/3} = 300/32 = 9.375\\,\\text{K}$.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "For the free expansion of an ideal gas under adiabatic conditions in a vacuum, which of the following set of parameters is correct?",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$W = 0$, $Q = 0$, $\\Delta T = 0$",
      "B": "$W \\ne 0$, $Q = 0$, $\\Delta T = 0$",
      "C": "$W = 0$, $Q \\ne 0$, $\\Delta T < 0$",
      "D": "$W = 0$, $Q = 0$, $\\Delta T < 0$"
    },
    "notes": "Free expansion means expanding against zero external pressure ($P_{\\text{ext}} = 0$).",
    "solution_text": "In free expansion, the external pressure is zero ($P_{\\text{ext}} = 0$), so the work done is $W = -P_{\\text{ext}} \\Delta V = 0$. Since the conditions are adiabatic, $Q = 0$. By the First Law of Thermodynamics, $\\Delta U = Q + W = 0 + 0 = 0$. For an ideal gas, $\\Delta U = n C_v \\Delta T = 0 \\implies \\Delta T = 0$. Thus, $W=0, Q=0, \\Delta T=0$. Option A is correct.",
    "common_mistake": "Assuming that adiabatic expansion must always result in cooling ($\\Delta T < 0$), forgetting that this is only true for expansion against a non-zero external pressure.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "Three moles of an ideal gas expand isothermally at $300\\,\\text{K}$ against a constant external pressure of $1\\,\\text{atm}$ from a volume of $20\\,\\text{L}$ to $80\\,\\text{L}$. The work done by the gas is ________ $\\text{L\\cdot atm}$.",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "60",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Calculate work for an irreversible expansion against a constant external pressure.",
    "solution_text": "For expansion against a constant external pressure (irreversible process), the work done on the system is: $W = -P_{\\text{ext}} \\Delta V = -P_{\\text{ext}} (V_2 - V_1) = -1\\,\\text{atm} \\times (80\\,\\text{L} - 20\\,\\text{L}) = -60\\,\\text{L\\cdot atm}$. The work done *by* the gas is the magnitude of this value, which is $60\\,\\text{L\\cdot atm}$.",
    "common_mistake": "Using the formula for reversible isothermal work $W = -nRT \\ln(V_2/V_1)$, which is only valid when the external pressure changes continuously to match gas pressure.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "Which of the following physical quantities is a state function but not a path function?",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Internal Energy ($U$)",
      "B": "Heat ($q$)",
      "C": "Work ($w$)",
      "D": "Heat capacity ($C$)"
    },
    "notes": "State functions depend only on the initial and final states of the system, not on the path taken.",
    "solution_text": "Internal energy ($U$) is a state function because its change depends only on the initial and final states: $\\Delta U = U_f - U_i$. On the other hand, heat ($q$) and work ($w$) depend on the specific path taken between states and are path functions. Option A is correct.",
    "common_mistake": "Confusing the First Law equation $\\Delta U = q + w$ and thinking that since $q$ and $w$ sum to $\\Delta U$, they must also be state functions.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "A system absorbs $500\\,\\text{J}$ of heat and performs $200\\,\\text{J}$ of work on the surroundings. The change in internal energy ($\\Delta U$) of the system is ________ $\\text{J}$.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "300",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Apply the sign conventions for the First Law of Thermodynamics: $Q > 0$ for heat absorbed, $W < 0$ for work done by system.",
    "solution_text": "According to IUPAC sign convention, the First Law of Thermodynamics is $\\Delta U = Q + W$. Heat absorbed by the system is positive: $Q = +500\\,\\text{J}$. Work done by the system on the surroundings is negative: $W = -200\\,\\text{J}$. Substituting these: $\\Delta U = 500\\,\\text{J} - 200\\,\\text{J} = 300\\,\\text{J}$.",
    "common_mistake": "Adding the work directly as positive ($\\Delta U = 500 + 200 = 700\\,\\text{J}$), violating the convention that work done by the system decreases its energy.",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "For the reaction: $\\text{C}(s) + \\text{CO}_2(g) \\rightleftharpoons 2\\text{CO}(g)$, the difference between the enthalpy of reaction at constant pressure and constant volume ($\\Delta H - \\Delta U$) at $300\\,\\text{K}$ is ________ $\\text{kJ}$. (Take $R = 8.314\\,\\text{J/mol\\,K}$, round to two decimal places)",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "2.49",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Use the relation $\\Delta H = \\Delta U + \\Delta n_g R T$, considering only gaseous reactants and products.",
    "solution_text": "The relationship is $\\Delta H = \\Delta U + \\Delta n_g R T \\implies \\Delta H - \\Delta U = \\Delta n_g R T$. For the reaction $\\text{C}(s) + \\text{CO}_2(g) \\rightleftharpoons 2\\text{CO}(g)$, the gaseous moles of products is 2, and gaseous moles of reactants is 1 (Carbon is solid). Thus, $\\Delta n_g = 2 - 1 = 1$. Now calculate: $\\Delta H - \\Delta U = 1 \\times 8.314\\,\\text{J/mol\\,K} \\times 300\\,\\text{K} = 2494.2\\,\\text{J} = 2.49\\,\\text{kJ}$.",
    "common_mistake": "Including solid Carbon in the calculation of gaseous mole difference (giving $\\Delta n_g = 2 - 2 = 0 \\implies \\Delta H - \\Delta U = 0$).",
    "concept_slugs": ["first-law-work"]
  },
  {
    "pattern_group": "first-law-work",
    "title": "One mole of an ideal gas undergoes a polytropic expansion in which $P V^2 = \\text{constant}$ from temperature $T_1$ to $T_2$. The work done on the gas is given by:",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$R(T_2 - T_1)$",
      "B": "$R(T_1 - T_2)$",
      "C": "$-R(T_2 - T_1)$",
      "D": "$2R(T_1 - T_2)$"
    },
    "notes": "Apply the work formula for a polytropic process $PV^n = C$: $W = \\frac{nR(T_2 - T_1)}{n-1}$.",
    "solution_text": "The work done during a polytropic process $PV^n = \\text{constant}$ is given by: $W = \\frac{nR(T_2 - T_1)}{n-1}$. Here, $n = 2$ and $n_g = 1\\,\\text{mole}$. Substituting these gives: $W = \\frac{1 \\times R(T_2 - T_1)}{2 - 1} = R(T_2 - T_1)$. Option A is correct.",
    "common_mistake": "Confusing the polytropic work denominator as $1-n$ and writing $-R(T_2-T_1)$ without considering the definition of work in chemistry vs physics.",
    "concept_slugs": ["first-law-work"]
  },

  // GROUP 2: thermochemistry-reaction-enthalpy (8 questions)
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "The standard enthalpies of combustion of Carbon (graphite) and Carbon Monoxide (CO) are $-393.5\\,\\text{kJ/mol}$ and $-283.0\\,\\text{kJ/mol}$ respectively. The standard enthalpy of formation of Carbon Monoxide is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$-110.5\\,\\text{kJ/mol}$",
      "B": "$110.5\\,\\text{kJ/mol}$",
      "C": "$-676.5\\,\\text{kJ/mol}$",
      "D": "$676.5\\,\\text{kJ/mol}$"
    },
    "notes": "Write the combustion equations and manipulate them to obtain the formation equation of CO.",
    "solution_text": "We want to find the enthalpy of reaction for: $\\text{C}(s, \\text{graphite}) + \\frac{1}{2}\\text{O}_2(g) \\rightarrow \\text{CO}(g)$.\nGiven combustion equations:\n1) $\\text{C}(s) + \\text{O}_2(g) \\rightarrow \\text{CO}_2(g)$, $\\Delta H_1 = -393.5\\,\\text{kJ/mol}$\n2) $\\text{CO}(g) + \\frac{1}{2}\\text{O}_2(g) \\rightarrow \\text{CO}_2(g)$, $\\Delta H_2 = -283.0\\,\\text{kJ/mol}$\nSubtracting Eq (2) from Eq (1) gives: $\\text{C}(s) + \\frac{1}{2}\\text{O}_2(g) \\rightarrow \\text{CO}(g)$.\nSo, $\\Delta_f H^\\circ(\\text{CO}) = \\Delta H_1 - \\Delta H_2 = -393.5 - (-283.0) = -110.5\\,\\text{kJ/mol}$. Option A is correct.",
    "common_mistake": "Adding the two enthalpy values directly (giving $-676.5\\,\\text{kJ/mol}$), or reversing the subtraction to get $+110.5\\,\\text{kJ/mol}$.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "Given the following thermochemical equations:\n1) $\\text{S}(s) + \\text{O}_2(g) \\rightarrow \\text{SO}_2(g)$, $\\Delta H = -297\\,\\text{kJ/mol}$\n2) $2\\text{SO}_3(g) \\rightarrow 2\\text{SO}_2(g) + \\text{O}_2(g)$, $\\Delta H = +198\\,\\text{kJ/mol}$\nThe standard enthalpy of formation of $\\text{SO}_3(g)$ is ________ $\\text{kJ/mol}$. (Write as an integer)",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "-396",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Enthalpy of formation is the heat change when 1 mole of substance is formed from its elements in standard state.",
    "solution_text": "We need the enthalpy for: $\\text{S}(s) + 1.5\\text{O}_2(g) \\rightarrow \\text{SO}_3(g)$.\nFrom Eq (2): $\\text{SO}_2(g) + \\frac{1}{2}\\text{O}_2(g) \\rightarrow \\text{SO}_3(g)$, $\\Delta H = -99\\,\\text{kJ/mol}$ (reverse and divide by 2).\nAdding this to Eq (1):\n$\\text{S}(s) + \\text{O}_2(g) + \\text{SO}_2(g) + \\frac{1}{2}\\text{O}_2(g) \\rightarrow \\text{SO}_2(g) + \\text{SO}_3(g) \\implies \\text{S}(s) + 1.5\\text{O}_2(g) \\rightarrow \\text{SO}_3(g)$.\n$\\Delta H_{\\text{formation}} = -297\\,\\text{kJ/mol} + (-99\\,\\text{kJ/mol}) = -396\\,\\text{kJ/mol}$.",
    "common_mistake": "Adding $+198$ directly without dividing by 2 or reversing the direction, leading to $-99\\,\\text{kJ/mol}$.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "The enthalpy of neutralization of a strong acid with a strong base is constant ($-57.3\\,\\text{kJ/mol}$) because:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Strong acids and strong bases do not react completely.",
      "B": "The net reaction always represents the combination of $H^+(aq)$ and $OH^-(aq)$ to form $H_2O(l)$.",
      "C": "Both acids and bases are in their standard states.",
      "D": "The salt formed is always soluble in water."
    },
    "notes": "Strong acids and strong bases are completely dissociated in aqueous solution.",
    "solution_text": "Since strong acids and strong bases dissociate completely in dilute aqueous solutions, the net ionic equation for neutralization is always: $\\text{H}^+(aq) + \\text{OH}^-(aq) \\rightarrow \\text{H}_2\\text{O}(l)$. Since the reactants and products are identical in all such reactions, the enthalpy change is constant at $-57.3\\,\\text{kJ/mol}$. Option B is correct.",
    "common_mistake": "Attributing the constant value to the properties of the salt or standard state definitions instead of complete dissociation of ions.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "The enthalpy of combustion of methane is $-890\\,\\text{kJ/mol}$. The heat released when $3.2\\,\\text{g}$ of methane is completely burned in excess oxygen is ________ $\\text{kJ}$.",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "178",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Calculate the moles of methane first, then multiply by the enthalpy of combustion.",
    "solution_text": "Molar mass of methane ($\\text{CH}_4$) $= 12 + 4(1) = 16\\,\\text{g/mol}$. Moles of methane burned $= \\frac{3.2\\,\\text{g}}{16\\,\\text{g/mol}} = 0.2\\,\\text{mol}$. Heat released per mole is $890\\,\\text{kJ}$. For $0.2\\,\\text{mol}$: $\\text{Heat released} = 0.2 \\times 890\\,\\text{kJ} = 178\\,\\text{kJ}$.",
    "common_mistake": "Using a negative sign for 'heat released' (writing $-178$), whereas 'released' already implies the negative direction.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "By convention, the standard enthalpy of formation ($\\Delta_f H^\\circ$) of which of the following substances is taken as zero at $298\\,\\text{K}$?",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\text{O}_2(g)$",
      "B": "$\\text{O}_3(g)$",
      "C": "$\\text{H}_2\\text{O}(l)$",
      "D": "$\\text{C}(s, \\text{diamond})$"
    },
    "notes": "Standard enthalpy of formation is zero for elements in their most stable reference state.",
    "solution_text": "The reference standard state for oxygen is diatomic gas ($\\text{O}_2(g)$) at $298\\,\\text{K}$ and $1\\,\\text{bar}$, so its $\\Delta_f H^\\circ = 0$. For ozone ($\\text{O}_3(g)$), carbon diamond, and water, the values are non-zero. For carbon, graphite is the standard state, not diamond. Option A is correct.",
    "common_mistake": "Selecting diamond as zero because it is pure carbon, neglecting that graphite is the thermodynamic reference state.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "The enthalpy of neutralization of $\\text{HCl}$ by $\\text{NaOH}$ is $-57.3\\,\\text{kJ/mol}$ and that of $\\text{HCN}$ by $\\text{NaOH}$ is $-12.3\\,\\text{kJ/mol}$. The enthalpy of ionization of $\\text{HCN}$ is ________ $\\text{kJ/mol}$.",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "45",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Neutralization of weak acids involves an endothermic dissociation step: $\\Delta H_{\\text{neut}} = \\Delta H_{\\text{neut, strong}} + \\Delta H_{\\text{ion}}$.",
    "solution_text": "Neutralization of strong acid and strong base releases $-57.3\\,\\text{kJ/mol}$. For weak acid $\\text{HCN}$, part of the heat released is consumed to dissociate the weak acid: $\\Delta H_{\\text{neut}} = \\Delta H_{\\text{neut, strong}} + \\Delta H_{\\text{ion}} \\implies -12.3 = -57.3 + \\Delta H_{\\text{ion}} \\implies \\Delta H_{\\text{ion}} = 57.3 - 12.3 = 45.0\\,\\text{kJ/mol}$.",
    "common_mistake": "Subtracting in the wrong direction or using negative signs incorrectly, yielding $-69.6$ or $-45\\,\\text{kJ/mol}$.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "Hess's Law of constant heat summation is a direct thermodynamic consequence of:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Entropy increasing in the universe",
      "B": "Equilibrium constant dependency on temperature",
      "C": "Conservation of energy (First Law of Thermodynamics)",
      "D": "Le Chatelier's principle"
    },
    "notes": "Hess's Law states that enthalpy change of a reaction is independent of the pathway.",
    "solution_text": "Enthalpy is a state function. The total enthalpy change for a reaction depends only on the initial and final states, which is a statement of the conservation of energy (First Law). If the heat change depended on the path, one could create a cycle that indefinitely produces energy, violating the First Law. Option C is correct.",
    "common_mistake": "Linking Hess's Law to entropy or spontaneity (Second Law) instead of energy conservation.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },
  {
    "pattern_group": "thermochemistry-reaction-enthalpy",
    "title": "The standard enthalpy of sublimation of solid Iodine is $62\\,\\text{kJ/mol}$ and its enthalpy of fusion is $15\\,\\text{kJ/mol}$. The standard enthalpy of vaporization of liquid Iodine is ________ $\\text{kJ/mol}$.",
    "difficulty": "medium",
    "type": "advanced",
    "correct_answer": "47",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Apply Hess's Law: $\\text{Sublimation} = \\text{Fusion} + \\text{Vaporization}$.",
    "solution_text": "By Hess's Law, sublimation (Solid $\\rightarrow$ Gas) can be written as a two-step process: fusion (Solid $\\rightarrow$ Liquid) followed by vaporization (Liquid $\\rightarrow$ Gas). Therefore: $\\Delta H_{\\text{sub}} = \\Delta H_{\\text{fus}} + \\Delta H_{\\text{vap}} \\implies 62 = 15 + \\Delta H_{\\text{vap}} \\implies \\Delta H_{\\text{vap}} = 62 - 15 = 47\\,\\text{kJ/mol}$.",
    "common_mistake": "Adding the values directly ($62 + 15 = 77\\,\\text{kJ/mol}$), violating the step relationship.",
    "concept_slugs": ["thermochemistry-reaction-enthalpy"]
  },

  // GROUP 3: bond-enthalpies-kirchhoff (8 questions)
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "The bond dissociation energies of $\\text{H}-\\text{H}$, $\\text{C}=\\text{C}$ and $\\text{C}-\\text{C}$ bonds are $435$, $615$ and $347\\,\\text{kJ/mol}$ respectively. If the average bond energy of the $\\text{C}-\\text{H}$ bond is $414\\,\\text{kJ/mol}$, the enthalpy change for the hydrogenation of ethene ($\\text{C}_2\\text{H}_4(g) + \\text{H}_2(g) \\rightarrow \\text{C}_2\\text{H}_6(g)$) is ________ $\\text{kJ/mol}$.",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "-125",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Enthalpy change is the sum of bond energies of reactants broken minus the sum of bond energies of products formed.",
    "solution_text": "Bonds broken (Reactants):\n- $1 \\times \\text{C}=\\text{C}$ bond $= 615\\,\\text{kJ/mol}$\n- $1 \\times \\text{H}-\\text{H}$ bond $= 435\\,\\text{kJ/mol}$\n- $4 \\times \\text{C}-\\text{H}$ bonds $= 4 \\times 414 = 1656\\,\\text{kJ/mol}$\nTotal Reactant BE $= 615 + 435 + 1656 = 2706\\,\\text{kJ/mol}$.\nBonds formed (Products):\n- $1 \\times \\text{C}-\\text{C}$ bond $= 347\\,\\text{kJ/mol}$\n- $6 \\times \\text{C}-\\text{H}$ bonds $= 6 \\times 414 = 2484\\,\\text{kJ/mol}$\nTotal Product BE $= 347 + 2484 = 2831\\,\\text{kJ/mol}$.\nReaction Enthalpy $\\Delta H = \\sum \\text{BE}_{\\text{reactants}} - \\sum \\text{BE}_{\\text{products}} = 2706 - 2831 = -125\\,\\text{kJ/mol}$.",
    "common_mistake": "Calculating $\\Delta H$ as Products minus Reactants (which would give $+125\\,\\text{kJ/mol}$), which is only used for enthalpies of formation.",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "For a reaction, the heat capacity difference is $\\Delta C_p = -20\\,\\text{J/K\\cdot mol}$. If the standard reaction enthalpy is $-100\\,\\text{kJ/mol}$ at $300\\,\\text{K}$, its reaction enthalpy at $350\\,\\text{K}$ is ________ $\\text{kJ/mol}$.",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "-101",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Use Kirchhoff's equation: $\\Delta H(T_2) = \\Delta H(T_1) + \\Delta C_p (T_2 - T_1)$. Keep unit consistency.",
    "solution_text": "By Kirchhoff's Law: $\\Delta H(T_2) = \\Delta H(T_1) + \\Delta C_p (T_2 - T_1)$.\nGiven $\\Delta H(300\\,\\text{K}) = -100\\,\\text{kJ/mol} = -100,000\\,\\text{J/mol}$, and $\\Delta C_p = -20\\,\\text{J/K\\cdot mol}$.\nFor $T_2 = 350\\,\\text{K}$:\n$\\Delta H(350\\,\\text{K}) = -100,000\\,\\text{J/mol} + (-20\\,\\text{J/K\\cdot mol}) \\times (350 - 300)\n= -100,000 - 20 \\times 50 = -100,000 - 1000 = -101,000\\,\\text{J/mol} = -101\\,\\text{kJ/mol}$.",
    "common_mistake": "Adding $\\Delta C_p$ directly without multiplying by the temperature difference $\\Delta T = 50$, or mixing units (adding $-20\\,\\text{J}$ directly to $-100\\,\\text{kJ}$).",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "Kirchhoff's equation relates the temperature dependency of reaction enthalpy to:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Volume change of the reaction",
      "B": "Heat capacity differences between products and reactants",
      "C": "Entropy change of surroundings",
      "D": "Gibbs free energy of reaction"
    },
    "notes": "Recall the derivative of enthalpy with respect to temperature at constant pressure.",
    "solution_text": "Since $\\left(\\frac{\\partial H}{\\partial T}\right)_P = C_p$, the variation of reaction enthalpy with temperature is governed by the difference in heat capacities: $\\left(\\frac{\\partial \\Delta H}{\\partial T}\right)_P = \\Delta C_p$. Integrating this yields Kirchhoff's equation. Option B is correct.",
    "common_mistake": "Selecting entropy change or free energy, confusing it with the Gibbs-Helmholtz equation.",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "The standard enthalpy of reaction for $\\text{H}_2(g) + \\text{Cl}_2(g) \\rightarrow 2\\text{HCl}(g)$ is $-184\\,\\text{kJ}$. If the bond energies of $\\text{H}-\\text{H}$ and $\\text{Cl}-\\text{Cl}$ are $435$ and $243\\,\\text{kJ/mol}$ respectively, the bond energy of $\\text{H}-\\text{Cl}$ bond is ________ $\\text{kJ/mol}$.",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "431",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Express the reaction enthalpy in terms of the reactant and product bond energies.",
    "solution_text": "The reaction involves breaking 1 mole of $\\text{H}-\\text{H}$ bonds and 1 mole of $\\text{Cl}-\\text{Cl}$ bonds, and forming 2 moles of $\\text{H}-\\text{Cl}$ bonds. Thus:\n$\\Delta H = \\text{BE}(\\text{H}-\\text{H}) + \\text{BE}(\\text{Cl}-\\text{Cl}) - 2\\text{BE}(\\text{H}-\\text{Cl})$\n$-184 = 435 + 243 - 2\\text{BE}(\\text{H}-\\text{Cl})$\n$-184 = 678 - 2\\text{BE}(\\text{H}-\\text{Cl}) \\implies 2\\text{BE}(\\text{H}-\\text{Cl}) = 678 + 184 = 862 \\implies \\text{BE}(\\text{H}-\\text{Cl}) = 431\\,\\text{kJ/mol}$.",
    "common_mistake": "Neglecting the coefficient of 2 in front of the product bond energy, yielding $862\\,\\text{kJ/mol}$.",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "Which of the following statements about bond enthalpies is incorrect?",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Bond enthalpy is always an endothermic quantity (positive).",
      "B": "The bond enthalpy of a diatomic molecule is equal to its bond dissociation energy.",
      "C": "The bond enthalpy of a polyatomic molecule is the same as the bond dissociation energy of the first bond broken.",
      "D": "Bond enthalpies are average values calculated from various molecules containing that bond."
    },
    "notes": "Think about polyatomic molecules like methane ($CH_4$) where each C-H bond has a different dissociation energy.",
    "solution_text": "For polyatomic molecules, the energy required to break subsequent bonds changes due to structural changes (e.g. in $CH_4$, breaking the first C-H requires $435\\,\\text{kJ/mol}$, but the average of all four is $414\\,\\text{kJ/mol}$). Thus, bond enthalpy is defined as the average bond dissociation energy, not the energy of the first bond. Option C is correct.",
    "common_mistake": "Thinking bond enthalpy is a negative quantity because bond formation releases energy, forgetting that the definition of bond enthalpy refers to bond dissociation (breaking).",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "For the reaction $2\\text{H}_2(g) + \\text{O}_2(g) \\rightarrow 2\\text{H}_2\\text{O}(g)$, the molar constant-pressure heat capacities are $C_p(\\text{H}_2) = 29\\,\\text{J/K\\cdot mol}$, $C_p(\\text{O}_2) = 30\\,\\text{J/K\\cdot mol}$, and $C_p(\\text{H}_2\\text{O}, g) = 33\\,\\text{J/K\\cdot mol}$. The value of $\\Delta C_p$ for this reaction is ________ $\\text{J/K}$.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "-22",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "$\\Delta C_p = \\sum n_p C_p(\\text{products}) - \\sum n_r C_p(\\text{reactants})$.",
    "solution_text": "Calculate the difference using stoichiometric coefficients:\n$\\Delta C_p = 2 \\times C_p(\\text{H}_2\\text{O}) - [2 \\times C_p(\\text{H}_2) + 1 \\times C_p(\\text{O}_2)]$\n$\\Delta C_p = 2(33) - [2(29) + 30] = 66 - [58 + 30] = 66 - 88 = -22\\,\\text{J/K}$.",
    "common_mistake": "Ignoring the stoichiometric coefficients and calculating simple difference as $33 - (29 + 30) = -26\\,\\text{J/K}$.",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "In a water molecule, the bond dissociation energies of the two $\\text{O}-\\text{H}$ bonds are $502\\,\\text{kJ/mol}$ and $427\\,\\text{kJ/mol}$ respectively. The average bond enthalpy of the $\\text{O}-\\text{H}$ bond in water is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$502\\,\\text{kJ/mol}$",
      "B": "$464.5\\,\\text{kJ/mol}$",
      "C": "$427\\,\\text{kJ/mol}$",
      "D": "$929\\,\\text{kJ/mol}$"
    },
    "notes": "Average bond enthalpy is the total energy required to break all such bonds divided by the number of bonds.",
    "solution_text": "The total energy to dissociate both $\\text{O}-\\text{H}$ bonds in water is $502 + 427 = 929\\,\\text{kJ/mol}$. Since there are 2 bonds, the average bond enthalpy is $\\text{BE}_{\\text{avg}} = 929 / 2 = 464.5\\,\\text{kJ/mol}$. Option B is correct.",
    "common_mistake": "Adding the values directly without dividing by 2 (option D), or assuming it is equal to the first dissociation energy (option A).",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },
  {
    "pattern_group": "bond-enthalpies-kirchhoff",
    "title": "The enthalpy of formation of benzene from gaseous atoms is calculated using standard bond energies as $-5380\\,\\text{kJ/mol}$. If the experimental enthalpy of formation of benzene from gaseous atoms is $-5532\\,\\text{kJ/mol}$, the resonance energy of benzene is ________ $\\text{kJ/mol}$.",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "-152",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Resonance stabilization makes the actual molecule more stable (more exothermic enthalpy of formation) than calculated.",
    "solution_text": "Resonance energy is the difference between the experimental stability and the calculated stability of the localized structure: $\\text{Resonance Energy} = \\Delta H_{\\text{formation, exp}} - \\Delta H_{\\text{formation, calc}} = -5532\\,\\text{kJ/mol} - (-5380\\,\\text{kJ/mol}) = -152\\,\\text{kJ/mol}$. The negative sign indicates stabilization.",
    "common_mistake": "Calculating as $+152\\,\\text{kJ/mol}$, which would represent destabilization rather than stabilization.",
    "concept_slugs": ["bond-enthalpies-kirchhoff"]
  },

  // GROUP 4: entropy-spontaneity-second-law (8 questions)
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "The enthalpy of vaporization of water is $40.66\\,\\text{kJ/mol}$ at its boiling point $373\\,\\text{K}$. The entropy change for the vaporization of 1 mole of water is approximately:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$10.9\\,\\text{J/K\\cdot mol}$",
      "B": "$109.0\\,\\text{J/K\\cdot mol}$",
      "C": "$40.66\\,\\text{J/K\\cdot mol}$",
      "D": "$1.09\\,\\text{J/K\\cdot mol}$"
    },
    "notes": "At boiling point, phase transition is in equilibrium, so $\\Delta S = \\Delta H / T$.",
    "solution_text": "At constant temperature and pressure during phase transition, the entropy change is: $\\Delta S = \\frac{\\Delta H_{\\text{vap}}}{T_b}$.\nSubstituting the values: $\\Delta S = \\frac{40.66 \\times 10^3\\,\\text{J/mol}}{373\\,\\text{K}} \\approx 109\\,\\text{J/K\\cdot mol}$. Option B is correct.",
    "common_mistake": "Forgetting to convert $\\Delta H_{\\text{vap}}$ from $\\text{kJ}$ to $\\text{J}$, yielding $0.109\\,\\text{J/K\\cdot mol}$ or selecting option A.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "Two moles of an ideal gas expand isothermally and reversibly from a volume of $10\\,\\text{L}$ to $100\\,\\text{L}$ at $300\\,\\text{K}$. The entropy change of the gas is ________ $\\text{J/K}$. (Take $R = 8.314\\,\\text{J/mol\\,K}$, $\\ln 10 = 2.303$, round to one decimal place)",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "38.3",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Apply the entropy change formula for isothermal expansion: $\\Delta S = n R \\ln(V_2 / V_1)$.",
    "solution_text": "For an isothermal process, the change in entropy of an ideal gas is: $\\Delta S = n R \\ln\\left(\\frac{V_2}{V_1}\\right)$.\nSubstituting the values:\n$\\Delta S = 2 \\times 8.314 \\times \\ln\\left(\\frac{100}{10}\\right) = 16.628 \\times \\ln(10) = 16.628 \\times 2.303 \\approx 38.3\\,\\text{J/K}$.",
    "common_mistake": "Calculating heat or using temperature directly in the calculation, or using base-10 log without $2.303$ multiplication.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "For a reversible process in an isolated system, the change in entropy of the universe ($\\Delta S_{\\text{univ}}$) is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Equal to zero",
      "B": "Greater than zero",
      "C": "Less than zero",
      "D": "Constant but non-zero"
    },
    "notes": "Recall the second law criteria for reversible and irreversible processes.",
    "solution_text": "According to the Second Law of Thermodynamics, for any process occurring in the universe: $\\Delta S_{\\text{univ}} \\ge 0$. The equality holds for reversible processes, and inequality holds for spontaneous (irreversible) processes. Option A is correct.",
    "common_mistake": "Assuming that entropy of an isolated system always increases (greater than zero), neglecting that for a perfectly reversible process it is constant (change is zero).",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "When one mole of ideal gas A is mixed isothermally and isobarically with one mole of ideal gas B, the entropy change of mixing is ________ $R \\ln 2$.",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "2",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "The entropy of mixing formula is $\\Delta S_{\\text{mix}} = -R \\sum n_i \\ln x_i$.",
    "solution_text": "Mole fractions: $x_A = \\frac{1}{1+1} = 0.5$, $x_B = 0.5$. The entropy of mixing is:\n$\\Delta S_{\\text{mix}} = -R [n_A \\ln x_A + n_B \\ln x_B] = -R [1 \\ln(0.5) + 1 \\ln(0.5)] = -2R \\ln(0.5) = -2R \\ln(2^{-1}) = 2R \\ln 2$. Thus, the coefficient is 2.",
    "common_mistake": "Assuming entropy change is negative because it is mixing, or neglecting the mole fraction logarithm.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "An endothermic reaction can be spontaneous only if:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "The entropy of the system increases significantly so that $T\\Delta S > \\Delta H$.",
      "B": "The entropy of the system decreases.",
      "C": "The temperature of the reaction is lowered to absolute zero.",
      "D": "The reaction is carried out at constant volume."
    },
    "notes": "A reaction is spontaneous if the change in Gibbs free energy is negative ($\\Delta G < 0$).",
    "solution_text": "Gibbs free energy change is $\\Delta G = \\Delta H - T\\Delta S$. For an endothermic reaction, $\\Delta H > 0$. For $\\Delta G$ to be negative, the term $T\\Delta S$ must be positive and larger in magnitude than $\\Delta H$. Thus, $\\Delta S$ must be positive (entropy increases) and temperature $T$ must be high enough so that $T\\Delta S > \\Delta H$. Option A is correct.",
    "common_mistake": "Thinking endothermic reactions can never be spontaneous, or that they are spontaneous at low temperatures.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "The enthalpy of fusion of ice is $6.0\\,\\text{kJ/mol}$ at $0^\\circ\\text{C}$. The entropy change when $180\\,\\text{g}$ of water freezes at $0^\\circ\\text{C}$ is ________ $\\text{J/K}$. (Round to nearest integer)",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "-220",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Calculate the moles of water first. Freezing is the reverse of fusion, so its enthalpy change is negative.",
    "solution_text": "Moles of water $n = \\frac{180\\,\\text{g}}{18\\,\\text{g/mol}} = 10\\,\\text{mol}$. Enthalpy of freezing: $\\Delta H_{\\text{freezing}} = -6.0\\,\\text{kJ/mol} = -6000\\,\\text{J/mol}$. Temperature $T = 0^\\circ\\text{C} = 273.15\\,\\text{K}$.\nEntropy change of freezing per mole: $\\Delta S = \\frac{\\Delta H_{\\text{freezing}}}{T} = \\frac{-6000}{273.15} \\approx -21.97\\,\\text{J/K\\cdot mol}$.\nFor 10 moles: $\\Delta S_{\\text{total}} = 10 \\times (-21.97) = -219.7 \\approx -220\\,\\text{J/K}$.",
    "common_mistake": "Using $+220\\,\\text{J/K}$ (forgetting that freezing is exothermic and decreases entropy), or using temperature in Celsius.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "In which of the following processes does the entropy of the system decrease?",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Sublimation of dry ice",
      "B": "Condensation of water vapour",
      "C": "Dissolution of salt in water",
      "D": "Thermal decomposition of calcium carbonate"
    },
    "notes": "Entropy decreases when a substance becomes more ordered (e.g. Gas $\\rightarrow$ Liquid).",
    "solution_text": "Condensation involves conversion of water vapour (gas) into liquid water, which increases molecular ordering and thus decreases entropy ($\\Delta S < 0$). In other options, solid turns to gas, solid dissolves to ions, or solid decomposes to produce gas, all of which increase entropy. Option B is correct.",
    "common_mistake": "Thinking dissolution decreases entropy because the salt disappears, forgetting that solid crystals break down into highly mobile hydrated ions.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "entropy-spontaneity-second-law",
    "title": "A system undergoes an isothermal irreversible expansion at $300\\,\\text{K}$ absorbing $600\\,\\text{J}$ of heat from the surroundings. The entropy change of the surroundings is:",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$+2.0\\,\\text{J/K}$",
      "B": "$-2.0\\,\\text{J/K}$",
      "C": "$0.0\\,\\text{J/K}$",
      "D": "$-0.2\\,\\text{J/K}$"
    },
    "notes": "Surroundings always transfer heat reversibly, so $\\Delta S_{\\text{surr}} = -Q_{\\text{sys}} / T$.",
    "solution_text": "Since the surroundings are very large, any heat transfer to or from them is considered reversible. Therefore, the entropy change of the surroundings is: $\\Delta S_{\\text{surr}} = \\frac{Q_{\\text{surr}}}{T}$. Since the system absorbs $600\\,\\text{J}$, the surroundings lose $600\\,\\text{J}$, so $Q_{\\text{surr}} = -600\\,\\text{J}$. Thus, $\\Delta S_{\\text{surr}} = \\frac{-600\\,\\text{J}}{300\\,\\text{K}} = -2.0\\,\\text{J/K}$. Option B is correct.",
    "common_mistake": "Assuming that because the process is irreversible, the surroundings' entropy change cannot be calculated using $Q/T$.",
    "concept_slugs": ["entropy-spontaneity-second-law"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "For a chemical reaction, $\\Delta H^\\circ = -120\\,\\text{kJ/mol}$ and $\\Delta S^\\circ = -400\\,\\text{J/K\\cdot mol}$ at $298\\,\\text{K}$. The standard Gibbs free energy change ($\\Delta G^\\circ$) is:",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$-800\\,\\text{kJ/mol}$",
      "B": "$0.8\\,\\text{kJ/mol}$",
      "C": "$-0.8\\,\\text{kJ/mol}$",
      "D": "$120.8\\,\\text{kJ/mol}$"
    },
    "notes": "Use the equation $\\Delta G^\\circ = \\Delta H^\\circ - T \\Delta S^\\circ$, keeping unit conversions in mind.",
    "solution_text": "Using Gibbs-Helmholtz equation:\n$\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$\n$\\Delta H^\\circ = -120\\,\\text{kJ/mol} = -120,000\\,\\text{J/mol}$\n$\\Delta S^\\circ = -400\\,\\text{J/K\\cdot mol}$, and $T = 298\\,\\text{K}$.\n$\\Delta G^\\circ = -120,000 - 298 \\times (-400) = -120,000 + 119,200 = -800\\,\\text{J/mol} = -0.8\\,\\text{kJ/mol}$. Option C is correct.",
    "common_mistake": "Mixing units by subtracting $-400$ directly from $-120$, yielding $-120 - 298(-0.4) = -0.8$, or getting signs wrong.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "For the reaction: $\\text{A}(s) \\rightarrow \\text{B}(g) + \\text{C}(g)$, the standard enthalpy and entropy changes are $\\Delta H^\\circ = +80\\,\\text{kJ/mol}$ and $\\Delta S^\\circ = +200\\,\\text{J/K\\cdot mol}$ respectively. The minimum temperature above which the reaction becomes spontaneous is ________ \\text{K}.",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "400",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Spontaneity requires $\\Delta G < 0$. Set $\\Delta G = 0$ to find the threshold temperature.",
    "solution_text": "Spontaneity condition: $\\Delta G = \\Delta H - T\\Delta S < 0 \\implies T\\Delta S > \\Delta H \\implies T > \\frac{\\Delta H}{\\Delta S}$.\nGiven $\\Delta H = 80\\,\\text{kJ/mol} = 80,000\\,\\text{J/mol}$ and $\\Delta S = 200\\,\\text{J/K\\cdot mol}$:\n$T > \\frac{80,000}{200} = 400\\,\\text{K}$. Thus, the minimum temperature is $400\\,\\text{K}$.",
    "common_mistake": "Dividing $80$ by $200$ without unit conversion, yielding $0.4\\,\\text{K}$.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "The decrease in Gibbs free energy ($-\\Delta G$) of a system at constant temperature and pressure represents:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "The heat exchanged at constant volume.",
      "B": "The maximum expansion work obtainable.",
      "C": "The maximum non-expansion work (useful work) obtainable.",
      "D": "The entropy change of the surroundings."
    },
    "notes": "Gibbs free energy represents the 'free' energy available to do useful work.",
    "solution_text": "At constant temperature and pressure, the change in Gibbs free energy is related to non-expansion work (like electrical work in electrochemical cells) by: $dW_{\\text{useful}} = -dG$. Thus, $-\\Delta G$ represents the maximum useful non-expansion work obtainable. Option C is correct.",
    "common_mistake": "Confusing Gibbs free energy change with expansion work ($-P\\Delta V$) or total internal energy changes.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "For a gaseous reaction at $300\\,\\text{K}$, the standard Gibbs free energy change is $\\Delta G^\\circ = -11.5\\,\\text{kJ/mol}$. The equilibrium constant $K_p$ is approximately $10^k$. The value of $k$ is ________. (Take $R = 8.314\\,\\text{J/mol\\,K}$, $\\ln 10 = 2.303$)",
    "difficulty": "medium",
    "type": "concept",
    "correct_answer": "2",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Apply the relation $\\Delta G^\\circ = -RT \\ln K_p$.",
    "solution_text": "We know: $\\Delta G^\\circ = -RT \\ln K_p = -2.303 RT \\log_{10} K_p$.\nSubstituting values:\n$-11500\\,\\text{J/mol} = -2.303 \\times 8.314\\,\\text{J/mol\\,K} \\times 300\\,\\text{K} \\times k$\n$-11500 = -2.303 \\times 2494.2 \\times k \\approx -5744.1 \\times k$\n$k = \\frac{-11500}{-5744.1} \\approx 2$. Thus, $K_p \\approx 10^2$, and the exponent $k$ is 2.",
    "common_mistake": "Using $\\ln$ instead of $\\log_{10}$ directly, which leads to $k = 4.6$.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "A reaction has a positive enthalpy change ($\\Delta H > 0$) and a negative entropy change ($\\Delta S < 0$). This reaction is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Spontaneous at high temperatures.",
      "B": "Non-spontaneous at all temperatures.",
      "C": "Spontaneous at low temperatures.",
      "D": "In equilibrium at all temperatures."
    },
    "notes": "Evaluate the sign of $\\Delta G = \\Delta H - T\\Delta S$.",
    "solution_text": "For a reaction with $\\Delta H > 0$ and $\\Delta S < 0$:\n$\\Delta G = \\Delta H - T\\Delta S = (+ \\text{value}) - T(- \\text{value}) = (+ \\text{value}) + T(\\text{value})$.\nSince both terms are positive and absolute temperature $T > 0$, $\\Delta G$ is positive at all temperatures. Hence, the reaction is non-spontaneous at all temperatures. Option B is correct.",
    "common_mistake": "Thinking that raising the temperature can make any reaction spontaneous, forgetting that if $\\Delta S$ is negative, higher temperature increases $\\Delta G$.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "At $1\\,\\text{atm}$ pressure, the normal boiling point of a liquid is $400\\,\\text{K}$. The change in Gibbs free energy ($\\Delta G$) for the vaporization of 2 moles of this liquid at $400\\,\\text{K}$ and $1\\,\\text{atm}$ is ________ \\text{J}.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "0",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "At the normal transition point, the system is in thermodynamic equilibrium.",
    "solution_text": "At the normal boiling point ($400\\,\\text{K}$, $1\\,\\text{atm}$), liquid and vapour phases are in dynamic equilibrium. For any system in equilibrium, the change in Gibbs free energy is exactly zero: $\\Delta G = 0\\,\\text{J}$.",
    "common_mistake": "Attempting to calculate using $\\Delta H_{\\text{vap}}$ and $\\Delta S_{\\text{vap}}$ and finding a non-zero value, or forgetting that $\\Delta G$ (not $\\Delta G^\\circ$) is zero at equilibrium.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "The fundamental thermodynamic equation for a closed system containing only PV work is $dG = VdP - SdT$. From this equation, the derivative $\\left(\\frac{\\partial G}{\\partial T}\\right)_P$ is equal to:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$V$",
      "B": "$S$",
      "C": "$-S$",
      "D": "$-V$"
    },
    "notes": "Evaluate the differential at constant pressure ($dP = 0$).",
    "solution_text": "From the equation $dG = VdP - SdT$. At constant pressure, $dP = 0$. So: $dG = -SdT \\implies \\left(\\frac{\\partial G}{\\partial T}\\right)_P = -S$. Option C is correct.",
    "common_mistake": "Choosing option B ($S$) because of sign confusion, or option A ($V$).",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "gibbs-free-energy-equilibrium",
    "title": "Which of the following describes the thermodynamic principle of coupled chemical reactions?",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "D",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Combining two spontaneous reactions to make them faster.",
      "B": "Using an external pressure change to force a reaction to equilibrium.",
      "C": "Running a reaction at constant entropy so $\\Delta H = \\Delta G$.",
      "D": "Driving an endergonic (non-spontaneous) reaction by coupling it to a highly exergonic (spontaneous) reaction."
    },
    "notes": "Coupled reactions share common intermediates to sum up their free energy changes.",
    "solution_text": "A non-spontaneous reaction ($\\Delta G_1 > 0$) can occur if it is coupled to a highly spontaneous reaction ($\\Delta G_2 < 0$) via a common intermediate, such that the net Gibbs free energy change is negative: $\\Delta G_{\\text{net}} = \\Delta G_1 + \\Delta G_2 < 0$. Option D is correct.",
    "common_mistake": "Thinking coupled reactions are just physical mixing without free-energy additive interactions.",
    "concept_slugs": ["gibbs-free-energy-equilibrium"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "The Third Law of Thermodynamics establishes which of the following principles?",
    "difficulty": "easy",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "C",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Internal energy is conserved in all processes.",
      "B": "Entropy of the universe always increases.",
      "C": "The entropy of a perfectly crystalline substance is zero at absolute zero temperature.",
      "D": "Entropy can never be calculated absolutely."
    },
    "notes": "The Third Law allows the determination of absolute values of entropy.",
    "solution_text": "The Third Law of Thermodynamics states that the entropy of a perfectly crystalline solid approaches zero as the temperature approaches absolute zero ($0\\,\\text{K}$). This acts as a reference point for calculating absolute entropies at other temperatures. Option C is correct.",
    "common_mistake": "Confusing the statement with the Second Law (option B).",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "When 1 mole of liquid benzene is burned in a bomb calorimeter (constant volume) at $298\\,\\text{K}$, the heat released is $3263.9\\,\\text{kJ}$. The enthalpy of combustion ($\\Delta H_c$) of benzene is ________ $\\text{kJ/mol}$ at $298\\,\\text{K}$. (Take $R = 8.314\\,\\text{J/mol\\,K}$, reaction: $\\text{C}_6\\text{H}_6(l) + 7.5\\text{O}_2(g) \\rightarrow 6\\text{CO}_2(g) + 3\\text{H}_2\\text{O}(l)$, round to nearest integer)",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Advanced 2022",
    "correct_answer": "-3268",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Relate constant-volume heat ($\\Delta U$) to constant-pressure enthalpy change ($\\Delta H$) using $\\Delta H = \\Delta U + \\Delta n_g R T$.",
    "solution_text": "Since volume is constant in a bomb calorimeter, the heat released is equal to change in internal energy: $\\Delta U = -3263.9\\,\\text{kJ/mol} = -3263900\\,\\text{J/mol}$.\nThe combustion equation: $\\text{C}_6\\text{H}_6(l) + 7.5\\text{O}_2(g) \\rightarrow 6\\text{CO}_2(g) + 3\\text{H}_2\\text{O}(l)$.\n$\\Delta n_g = n_g(\\text{products}) - n_g(\\text{reactants}) = 6 - 7.5 = -1.5$.\nNow, calculate $\\Delta H = \\Delta U + \\Delta n_g R T$:\n$\\Delta H = -3263900\\,\\text{J/mol} + (-1.5) \\times 8.314\\,\\text{J/mol\\,K} \\times 298\\,\\text{K}$\n$\\Delta H = -3263900 - 3716.358 = -3267616.358\\,\\text{J/mol} \\approx -3268\\,\\text{kJ/mol}$.",
    "common_mistake": "Using $\\Delta n_g = 6 - (1 + 7.5) = -2.5$ by including liquid benzene in gaseous moles, or forgetting to write the value as negative (exothermic).",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "The heat change measured in a bomb calorimeter during a chemical reaction represents:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\Delta U$ (change in internal energy)",
      "B": "$\\Delta H$ (change in enthalpy)",
      "C": "$\\Delta G$ (change in Gibbs free energy)",
      "D": "$W$ (expansion work)"
    },
    "notes": "A bomb calorimeter consists of a rigid steel vessel which cannot change its volume.",
    "solution_text": "Because the volume of a bomb calorimeter is fixed ($\\Delta V = 0$), no expansion work is done ($W = 0$). According to the First Law, $\\Delta U = Q + W = Q_v$. Therefore, the heat measured at constant volume ($Q_v$) is equal to the change in internal energy ($\\Delta U$). Option A is correct.",
    "common_mistake": "Assuming all calorimetry measurements give enthalpy change ($\\Delta H$), which is only true for constant pressure (coffee-cup) calorimeters.",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "According to the Third Law of Thermodynamics, the entropy of a perfectly crystalline solid at absolute zero ($0\\,\\text{K}$) is ________ $\\text{J/K}$.",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "0",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "State the standard value defined by the Third Law.",
    "solution_text": "The Third Law defines absolute zero entropy for a perfectly ordered system: $S = 0\\,\\text{K}$ at $T = 0\\,\\text{K}$. Wait, entropy unit is J/K. Let's make it $S = 0\\,\\text{J/K}$ at $T = 0\\,\\text{K}$.",
    "common_mistake": "Thinking it is a non-zero constant or depends on the material's molecular weight.",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "In a coffee-cup calorimeter, $50\\,\\text{mL}$ of $1.0\\,\\text{M}\\,\\text{HCl}$ is mixed with $50\\,\\text{mL}$ of $1.0\\,\\text{M}\\,\\text{NaOH}$. The temperature of the mixture rises from $25.0^\\circ\\text{C}$ to $31.8^\\circ\\text{C}$. Assuming the specific heat capacity of the solution is $4.18\\,\\text{J/g}^\\circ\\text{C}$ and its density is $1.0\\,\\text{g/mL}$, the heat generated by the reaction is approximately:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$1.42\\,\\text{kJ}$",
      "B": "$2.84\\,\\text{kJ}$",
      "C": "$5.68\\,\\text{kJ}$",
      "D": "$28.4\\,\\text{kJ}$"
    },
    "notes": "Calculate solution mass ($50\\,\\text{mL} + 50\\,\\text{mL} = 100\\,\\text{g}$), then use $Q = m c \\Delta T$.",
    "solution_text": "Total volume of mixture $= 50 + 50 = 100\\,\\text{mL}$. Total mass of solution $= 100\\,\\text{mL} \\times 1.0\\,\\text{g/mL} = 100\\,\\text{g}$.\nTemperature rise $\\Delta T = 31.8 - 25.0 = 6.8^\\circ\\text{C}$.\nHeat absorbed by solution: $Q = m c \\Delta T = 100\\,\\text{g} \\times 4.18\\,\\text{J/g}^\\circ\\text{C} \\times 6.8^\\circ\\text{C} = 2842.4\\,\\text{J} = 2.84\\,\\text{kJ}$. Option B is correct.",
    "common_mistake": "Using only $50\\,\\text{g}$ as the mass (option A), forgetting to add the volumes of both reactants.",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "A combustion reaction in a bomb calorimeter releases $20.0\\,\\text{kJ}$ of heat. If the temperature of the calorimeter increases by $4.0^\\circ\\text{C}$, the heat capacity of the calorimeter is ________ $\\text{kJ/}^\\circ\\text{C}$.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "5",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Heat capacity $C_{\\text{cal}} = Q / \\Delta T$.",
    "solution_text": "The heat capacity of the calorimeter is the ratio of heat exchanged to the change in temperature: $C_{\\text{cal}} = \\frac{Q}{\\Delta T} = \\frac{20.0\\,\\text{kJ}}{4.0^\\circ\\text{C}} = 5.0\\,\\text{kJ/}^\\circ\\text{C}$.",
    "common_mistake": "Multiplying the values ($20 \\times 4 = 80$) instead of dividing.",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "Some substances, like Carbon Monoxide (CO), have a non-zero entropy at absolute zero ($0\\,\\text{K}$) due to structural disorder. This remaining entropy is called:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Residual entropy",
      "B": "Gibbs entropy",
      "C": "Vibrational entropy",
      "D": "Standard state entropy"
    },
    "notes": "This refers to the entropy of disorder in orientation locked in at absolute zero.",
    "solution_text": "When a substance is cooled to absolute zero, if its molecules can pack in multiple random orientations (like C-O vs O-C in a crystal), it has a non-zero entropy ($S > 0$) called residual entropy. Option A is correct.",
    "common_mistake": "Confusing it with standard state entropy which is defined at $298\\,\\text{K}$.",
    "concept_slugs": ["third-law-calorimetry"]
  },
  {
    "pattern_group": "third-law-calorimetry",
    "title": "As the temperature of any pure crystalline solid approaches absolute zero ($0\\,\\text{K}$), its heat capacity ($C_p$):",
    "difficulty": "hard",
    "type": "advanced",
    "correct_answer": "B",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Approaches infinity.",
      "B": "Approaches zero.",
      "C": "Remains constant at a non-zero value.",
      "D": "Depends on standard pressure."
    },
    "notes": "Apply the Debye $T^3$ law for heat capacities at very low temperatures.",
    "solution_text": "According to the Debye model of solids, at very low temperatures, the heat capacity is proportional to $T^3$. As $T \\rightarrow 0$, the vibrational modes freeze out, and the heat capacity approaches zero. Option B is correct.",
    "common_mistake": "Assuming heat capacity is constant (Dulong-Petit law), which only holds at high temperatures.",
    "concept_slugs": ["third-law-calorimetry"]
  }
];

const main = () => {
  const targetPath = path.join(__dirname, 'chemistry_thermodynamics_questions.json');
  fs.writeFileSync(targetPath, JSON.stringify(questions, null, 2), 'utf8');
  console.log('Successfully generated chemistry_thermodynamics_questions.json!');
};

main();

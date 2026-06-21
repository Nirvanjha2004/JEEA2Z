import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  // 1. Order, Degree & Formation of Differential Equations (de-order-degree-formation) - 8 questions
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The order of the differential equation $\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} + 2y = 0$ is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "2",
      "B": "1",
      "C": "3",
      "D": "0"
    },
    "notes": "The order of a DE is the order of the highest derivative present in the equation.",
    "solution_text": "Let's identify the order:\n1) The highest derivative in $\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} + 2y = 0$ is $\\frac{d^2y}{dx^2}$ (second derivative).\n2) Therefore, the order is $2$.\nOption A is correct.",
    "common_mistake": "Confusing order with degree; degree is the power of the highest derivative.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The degree of the differential equation $\\left(\\frac{dy}{dx}\\right)^3 + 2y = x$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "3",
      "B": "1",
      "C": "2",
      "D": "Not defined"
    },
    "notes": "The degree is the power of the highest-order derivative after making the equation polynomial in derivatives.",
    "solution_text": "Let's identify the degree:\n1) The highest derivative is $\\frac{dy}{dx}$ (first order).\n2) Its power in the equation is $3$.\n3) The degree is therefore $3$.\nOption A is correct.",
    "common_mistake": "Stating the degree is 1 by looking at the highest power of the variable x or y.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The differential equation formed by eliminating the constant $c$ from $y = cx + c^2$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = x\\frac{dy}{dx} + \\left(\\frac{dy}{dx}\\right)^2$",
      "B": "$y = x\\frac{dy}{dx} - \\left(\\frac{dy}{dx}\\right)^2$",
      "C": "$y = \\left(\\frac{dy}{dx}\\right)^2$",
      "D": "$y = x\\frac{dy}{dx}$"
    },
    "notes": "Differentiate y = cx + c^2 to find c in terms of dy/dx, then substitute back to eliminate c.",
    "solution_text": "Let's eliminate $c$:\n1) $y = cx + c^2$. Differentiate: $\\frac{dy}{dx} = c$.\n2) Substitute $c = \\frac{dy}{dx}$ back into the original equation:\n   $y = x \\cdot \\frac{dy}{dx} + \\left(\\frac{dy}{dx}\\right)^2$.\nOption A is correct.",
    "common_mistake": "Not differentiating and trying to eliminate c by algebraic manipulation alone.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The differential equation representing the family of circles $x^2 + y^2 = r^2$ (all circles centered at origin) is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x + y\\frac{dy}{dx} = 0$",
      "B": "$x - y\\frac{dy}{dx} = 0$",
      "C": "\\frac{dy}{dx} = \\frac{x}{y}",
      "D": "$x^2 + y^2 = 0$"
    },
    "notes": "Differentiate implicitly to eliminate the parameter r.",
    "solution_text": "Let's differentiate $x^2 + y^2 = r^2$:\n1) Differentiating implicitly: $2x + 2y\\frac{dy}{dx} = 0$.\n2) Dividing by 2: $x + y\\frac{dy}{dx} = 0$.\n3) The constant $r$ has been eliminated.\nOption A is correct.",
    "common_mistake": "Leaving r in the equation; the DE must not contain any arbitrary constants.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The order and degree of $\\sqrt{1 + \\left(\\frac{dy}{dx}\\right)^2} = \\frac{d^2y}{dx^2}$ after rationalization is, respectively:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Advanced 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "Order 2, Degree 2",
      "B": "Order 2, Degree 1",
      "C": "Order 1, Degree 2",
      "D": "Order 2, Degree not defined"
    },
    "notes": "Square both sides to remove the square root, making the equation polynomial in derivatives. Then identify order and degree.",
    "solution_text": "Let's rationalize:\n1) Square both sides: $1 + \\left(\\frac{dy}{dx}\\right)^2 = \\left(\\frac{d^2y}{dx^2}\\right)^2$.\n2) Highest derivative: $\\frac{d^2y}{dx^2}$ -> Order $= 2$.\n3) Power of this highest-order derivative: $2$ -> Degree $= 2$.\nOption A is correct.",
    "common_mistake": "Stating degree is not defined before squaring, not recognizing the equation can be made polynomial.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The number of arbitrary constants in the general solution of a 3rd-order differential equation is ________.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "3",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "The number of arbitrary constants equals the order of the differential equation.",
    "solution_text": "Key theorem:\n1) The general solution of an $n$th-order differential equation contains exactly $n$ arbitrary constants.\n2) For a 3rd-order ODE, the general solution has $3$ arbitrary constants.\nThe answer is 3.",
    "common_mistake": "Confusing with the degree (power) of the highest-order derivative.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The differential equation formed by eliminating $A$ and $B$ from $y = A\\sin x + B\\cos x$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{d^2y}{dx^2} + y = 0$",
      "B": "$\\frac{d^2y}{dx^2} - y = 0$",
      "C": "$\\frac{dy}{dx} + y = 0$",
      "D": "$\\frac{d^2y}{dx^2} + \\frac{dy}{dx} = 0$"
    },
    "notes": "Differentiate twice and observe the pattern: each differentiation cycles between sin and cos.",
    "solution_text": "Let's eliminate A and B:\n1) $y = A\\sin x + B\\cos x$.\n2) $y' = A\\cos x - B\\sin x$.\n3) $y'' = -A\\sin x - B\\cos x = -y$.\n4) So $y'' + y = 0$.\n5) Both constants A and B are eliminated (2nd order DE for 2 constants).\nOption A is correct.",
    "common_mistake": "Differentiating only once and getting a 1st-order DE with one constant still present.",
    "concept_slugs": ["de-order-degree-formation"]
  },
  {
    "pattern_group": "de-order-degree-formation",
    "title": "The differential equation of all parabolas with axis parallel to the $y$-axis is of order ________.",
    "difficulty": "hard",
    "type": "practice",
    "correct_answer": "3",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "A parabola with axis parallel to y-axis has the form (x-h)^2 = 4a(y-k), with 3 parameters (a, h, k). Differentiating 3 times eliminates all.",
    "solution_text": "Let's count parameters:\n1) General form: $(x-h)^2 = 4a(y-k)$, with parameters $a$, $h$, $k$ -> 3 arbitrary constants.\n2) Differentiating 3 times eliminates all 3 constants.\n3) The resulting DE has order $3$.\nThe answer is 3.",
    "common_mistake": "Using the simpler x^2 = 4ay form (only 1 parameter), which gives order 1.",
    "concept_slugs": ["de-order-degree-formation"]
  },

  // 2. Variable Separable Method (de-variable-separable) - 8 questions
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $\\frac{dy}{dx} = \\frac{x}{y}$ is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x^2 - y^2 = C$",
      "B": "$x^2 + y^2 = C$",
      "C": "$y = x + C$",
      "D": "$xy = C$"
    },
    "notes": "Separate variables: y dy = x dx, then integrate both sides.",
    "solution_text": "Let's separate variables:\n1) $\\frac{dy}{dx} = \\frac{x}{y} \\Rightarrow y \\, dy = x \\, dx$.\n2) Integrate: $\\int y \\, dy = \\int x \\, dx$.\n3) $\\frac{y^2}{2} = \\frac{x^2}{2} + C_1 \\Rightarrow y^2 - x^2 = C$ (where $C = 2C_1$).\n   Equivalently: $x^2 - y^2 = -C = C$ (absorbing sign into constant).\nOption A is correct.",
    "common_mistake": "Forgetting to include the arbitrary constant, or writing x^2 + y^2 = C instead.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $\\frac{dy}{dx} = e^{x-y}$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$e^y = e^x + C$",
      "B": "$e^y = e^{-x} + C$",
      "C": "$e^x = e^y + C$",
      "D": "$e^{x+y} = C$"
    },
    "notes": "Write e^(x-y) = e^x / e^y, then separate variables and integrate.",
    "solution_text": "Let's separate variables:\n1) $\\frac{dy}{dx} = e^{x-y} = \\frac{e^x}{e^y}$.\n2) $e^y \\, dy = e^x \\, dx$.\n3) $\\int e^y \\, dy = \\int e^x \\, dx$.\n4) $e^y = e^x + C$.\nOption A is correct.",
    "common_mistake": "Integrating e^(x-y) as if both variables are together, without separating.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $\\frac{dy}{dx} = \\frac{\\sqrt{1-y^2}}{\\sqrt{1-x^2}}$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\sin^{-1} y = \\sin^{-1} x + C$",
      "B": "$\\cos^{-1} y = \\sin^{-1} x + C$",
      "C": "$\\tan^{-1} y = \\tan^{-1} x + C$",
      "D": "$y = x + C$"
    },
    "notes": "Separate: dy/sqrt(1-y^2) = dx/sqrt(1-x^2). Integrate using standard inverse trig integration formulas.",
    "solution_text": "Let's separate variables:\n1) $\\frac{dy}{\\sqrt{1-y^2}} = \\frac{dx}{\\sqrt{1-x^2}}$.\n2) Integrate: $\\int \\frac{dy}{\\sqrt{1-y^2}} = \\int \\frac{dx}{\\sqrt{1-x^2}}$.\n3) This yields $\\sin^{-1} y = \\sin^{-1} x + C$.\nOption A is correct.",
    "common_mistake": "Applying the wrong integration formula and getting arctan instead of arcsin.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $\\frac{dy}{dx} = \\frac{1+y^2}{1+x^2}$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\tan^{-1} y = \\tan^{-1} x + C$",
      "B": "$y = x + C$",
      "C": "$\\tan y = \\tan x + C$",
      "D": "$y^2 = x^2 + C$"
    },
    "notes": "Separate: dy/(1+y^2) = dx/(1+x^2), then integrate both sides.",
    "solution_text": "Separating variables:\n1) $\\frac{dy}{1+y^2} = \\frac{dx}{1+x^2}$.\n2) $\\int \\frac{dy}{1+y^2} = \\int \\frac{dx}{1+x^2}$.\n3) $\\tan^{-1} y = \\tan^{-1} x + C$.\nOption A is correct.",
    "common_mistake": "Integrating 1/(1+y^2) as ln(1+y^2) or y/(1+y^2).",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The general solution of $y \\, dx - x \\, dy = 0$ is:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Advanced 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = cx$",
      "B": "$xy = c$",
      "C": "$x + y = c$",
      "D": "$x^2 + y^2 = c$"
    },
    "notes": "Rewrite as dy/y = dx/x, integrate both sides.",
    "solution_text": "Let's rearrange:\n1) $y \\, dx = x \\, dy \\Rightarrow \\frac{dy}{y} = \\frac{dx}{x}$.\n2) $\\int \\frac{dy}{y} = \\int \\frac{dx}{x}$.\n3) $\\ln|y| = \\ln|x| + \\ln c = \\ln|cx|$.\n4) $y = cx$ (a family of lines through the origin).\nOption A is correct.",
    "common_mistake": "Integrating incorrectly and writing y = x/c or y/x = c (same thing) vs y = cx.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $\\frac{dy}{dx} + y = 1$ with $y(0) = 0$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = 1 - e^{-x}$",
      "B": "$y = 1 + e^{-x}$",
      "C": "$y = e^{-x}$",
      "D": "$y = e^x - 1$"
    },
    "notes": "Separate: dy/(1-y) = dx. Integrate. Apply initial condition y(0) = 0.",
    "solution_text": "Let's solve with initial condition:\n1) $\\frac{dy}{dx} = 1 - y \\Rightarrow \\frac{dy}{1-y} = dx$.\n2) $-\\ln|1-y| = x + C \\Rightarrow 1-y = Ae^{-x}$.\n3) Apply $y(0) = 0$: $1 - 0 = Ae^0 = A \\Rightarrow A = 1$.\n4) $y = 1 - e^{-x}$.\nOption A is correct.",
    "common_mistake": "Applying initial condition after integrating but before solving for the constant A.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "The solution of $x \\frac{dy}{dx} = y \\ln y$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\ln(\\ln y) = \\ln x + C$",
      "B": "$\\ln y = Cx$",
      "C": "$y \\ln y = Cx$",
      "D": "$\\ln y = x + C$"
    },
    "notes": "Separate: dy/(y ln y) = dx/x. Integrate using u = ln y for the left side.",
    "solution_text": "Separating variables:\n1) $\\frac{dy}{y \\ln y} = \\frac{dx}{x}$.\n2) Left side: Let $u = \\ln y \\Rightarrow du = \\frac{1}{y}dy$:\n   $\\int \\frac{dy}{y \\ln y} = \\int \\frac{du}{u} = \\ln|u| = \\ln|\\ln y|$.\n3) Right side: $\\int \\frac{dx}{x} = \\ln|x|$.\n4) $\\ln(\\ln y) = \\ln x + C$.\nOption A is correct.",
    "common_mistake": "Integrating 1/(y ln y) as ln(y)/y instead of using the substitution u = ln y.",
    "concept_slugs": ["de-variable-separable"]
  },
  {
    "pattern_group": "de-variable-separable",
    "title": "For the differential equation $\\frac{dy}{dx} = \\frac{x^2}{1+x^3}$, if $y(0) = 1$, the value of $y(1)$ is ________.",
    "difficulty": "hard",
    "type": "practice",
    "correct_answer": "1.23",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Integrate directly. Use substitution u = 1 + x^3. Apply initial condition to find C.",
    "solution_text": "Let's integrate:\n1) $dy = \\frac{x^2}{1+x^3} dx$. Let $u = 1+x^3 \\Rightarrow du = 3x^2 dx$.\n2) $y = \\frac{1}{3}\\ln|1+x^3| + C$.\n3) At $x = 0$: $1 = \\frac{1}{3}\\ln 1 + C = 0 + C \\Rightarrow C = 1$.\n4) $y = \\frac{1}{3}\\ln(1+x^3) + 1$.\n5) At $x = 1$: $y = \\frac{1}{3}\\ln 2 + 1 = \\frac{\\ln 2}{3} + 1 \\approx \\frac{0.693}{3} + 1 = 0.231 + 1 = 1.231$.\nRounding to two decimal places: 1.23.",
    "common_mistake": "Forgetting the factor 1/3 from the substitution.",
    "concept_slugs": ["de-variable-separable"]
  },

  // 3. Homogeneous Differential Equations (de-homogeneous) - 8 questions
  {
    "pattern_group": "de-homogeneous",
    "title": "A differential equation is homogeneous if it can be written as $\\frac{dy}{dx} = F(y/x)$. Which of the following is homogeneous?",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{dy}{dx} = \\frac{x^2 + y^2}{xy}$",
      "B": "$\\frac{dy}{dx} = x + y$",
      "C": "$\\frac{dy}{dx} = x^2 + 1$",
      "D": "$\\frac{dy}{dx} = \\frac{x + y + 1}{x - y}$"
    },
    "notes": "A DE f(x,y)/g(x,y) is homogeneous if f and g are both homogeneous functions of the same degree.",
    "solution_text": "Let's check each option:\n1) Option A: $\\frac{x^2+y^2}{xy}$. Dividing by $x^2$: $\\frac{1 + (y/x)^2}{y/x} = F(y/x)$. Homogeneous.\n2) Option B: $x + y$ is not of the form $F(y/x)$ since $x + y \\neq x \\cdot F(y/x)$.\n3) Option C: $x^2 + 1$ has different degrees ($x^2$ vs constant).\n4) Option D: Has $+1$ in numerator which breaks homogeneity.\nOption A is correct.",
    "common_mistake": "Choosing D because it 'looks' like a ratio of linear terms, ignoring the +1 constant.",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "The substitution used to solve a homogeneous DE $\\frac{dy}{dx} = F(y/x)$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = vx$, so $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$",
      "B": "$y = vx$, so $\\frac{dy}{dx} = v$",
      "C": "$x = vy$, so $\\frac{dy}{dx} = \\frac{1}{v}$",
      "D": "$y = e^{vx}$"
    },
    "notes": "The substitution y = vx with dy/dx = v + x(dv/dx) reduces a homogeneous DE to a separable one.",
    "solution_text": "The standard substitution is $y = vx$:\n1) $v = y/x$, so $y = vx$.\n2) Differentiating: $\\frac{dy}{dx} = v + x\\frac{dv}{dx}$ (by product rule).\n3) This transforms the homogeneous DE into a separable DE in $v$ and $x$.\nOption A is correct.",
    "common_mistake": "Forgetting the chain rule and writing dy/dx = v instead of v + x(dv/dx).",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "The solution of $(x^2 + y^2)dx = 2xy \\, dy$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x^2 - y^2 = cx$",
      "B": "$x^2 + y^2 = cx$",
      "C": "$x^2 - y^2 = c$",
      "D": "$y^2 = cx$"
    },
    "notes": "Rewrite as dy/dx = (x^2+y^2)/(2xy). Substitute y = vx and solve the separable equation in v.",
    "solution_text": "Let's use substitution $y = vx$:\n1) $\\frac{dy}{dx} = \\frac{x^2+y^2}{2xy} = \\frac{1+v^2}{2v}$.\n2) $v + x\\frac{dv}{dx} = \\frac{1+v^2}{2v}$.\n3) $x\\frac{dv}{dx} = \\frac{1+v^2}{2v} - v = \\frac{1+v^2-2v^2}{2v} = \\frac{1-v^2}{2v}$.\n4) $\\frac{2v}{1-v^2}dv = \\frac{dx}{x}$.\n5) $-\\ln|1-v^2| = \\ln|x| + \\ln c \\Rightarrow \\frac{1}{1-v^2} = cx$.\n6) $1 - v^2 = \\frac{1}{cx}$; substituting $v = y/x$: $1 - \\frac{y^2}{x^2} = \\frac{1}{cx} \\Rightarrow x^2 - y^2 = \\frac{x}{c} = Cx$.\nOption A is correct.",
    "common_mistake": "Getting the sign wrong in step 3 or mishandling the integration of 2v/(1-v^2).",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "The solution of $x\\frac{dy}{dx} - y = \\sqrt{x^2 + y^2}$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y + \\sqrt{x^2+y^2} = cx^2$",
      "B": "$y - \\sqrt{x^2+y^2} = cx$",
      "C": "$\\sqrt{x^2+y^2} = cx$",
      "D": "$y = cx + \\sqrt{x^2+y^2}$"
    },
    "notes": "Rewrite as dy/dx = (y + sqrt(x^2+y^2))/x. Substitute y = vx and solve the resulting separable DE.",
    "solution_text": "Substitute $y = vx$ (so $v = y/x$):\n1) $\\frac{dy}{dx} = \\frac{y + \\sqrt{x^2+y^2}}{x} = v + \\sqrt{1+v^2}$.\n2) $v + x\\frac{dv}{dx} = v + \\sqrt{1+v^2}$.\n3) $x\\frac{dv}{dx} = \\sqrt{1+v^2}$.\n4) $\\frac{dv}{\\sqrt{1+v^2}} = \\frac{dx}{x}$.\n5) $\\ln(v + \\sqrt{1+v^2}) = \\ln(cx)$.\n6) $v + \\sqrt{1+v^2} = cx \\Rightarrow \\frac{y}{x} + \\frac{\\sqrt{x^2+y^2}}{x} = cx$.\n7) $y + \\sqrt{x^2+y^2} = cx^2$.\nOption A is correct.",
    "common_mistake": "Not recognizing the integral of 1/sqrt(1+v^2) as ln(v + sqrt(1+v^2)).",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "The solution of $\\frac{dy}{dx} = \\frac{y}{x} + \\tan\\frac{y}{x}$ is:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Advanced 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\sin(y/x) = cx$",
      "B": "$\\cos(y/x) = cx$",
      "C": "$\\tan(y/x) = cx$",
      "D": "$\\sin(y/x) = c/x$"
    },
    "notes": "Substitute y = vx. The DE becomes v + x(dv/dx) = v + tan(v), simplifying to x(dv/dx) = tan(v).",
    "solution_text": "Substitute $y = vx \\Rightarrow v + x\\frac{dv}{dx} = v + \\tan v$:\n1) $x\\frac{dv}{dx} = \\tan v$.\n2) $\\frac{dv}{\\tan v} = \\frac{dx}{x} \\Rightarrow \\cot v \\, dv = \\frac{dx}{x}$.\n3) $\\ln|\\sin v| = \\ln|x| + \\ln c$.\n4) $\\sin v = cx \\Rightarrow \\sin(y/x) = cx$.\nOption A is correct.",
    "common_mistake": "Integrating cot v as tan v or 1/sin v instead of ln|sin v|.",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "For the homogeneous DE $\\frac{dy}{dx} = \\frac{y^2-x^2}{2xy}$, the substitution $y = vx$ converts it to a separable DE in $v$ and $x$. After separation, the integrand on the left side (in $v$) is ________.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{2v}{v^2+1}$",
      "B": "$\\frac{2v}{v^2-1}$",
      "C": "$\\frac{v}{v^2+1}$",
      "D": "$\\frac{1}{v}$"
    },
    "notes": "Substitute y = vx, simplify the right side in terms of v, find dv/dx expression, then separate.",
    "solution_text": "Substitute $y = vx$:\n1) $\\frac{dy}{dx} = \\frac{v^2x^2 - x^2}{2x \\cdot vx} = \\frac{v^2 - 1}{2v}$.\n2) $v + x\\frac{dv}{dx} = \\frac{v^2-1}{2v}$.\n3) $x\\frac{dv}{dx} = \\frac{v^2-1}{2v} - v = \\frac{v^2-1-2v^2}{2v} = \\frac{-v^2-1}{2v} = -\\frac{v^2+1}{2v}$.\n4) Separating: $\\frac{2v}{v^2+1}dv = -\\frac{dx}{x}$.\nOption A is correct.",
    "common_mistake": "Sign errors in computing the RHS after substitution.",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "The solution of the IVP $y\\frac{dy}{dx} = x - 1$ with $y(1) = 0$ is:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y^2 = (x-1)^2$",
      "B": "$y^2 = x^2 - 1$",
      "C": "$y = x - 1$",
      "D": "$y = -(x-1)$"
    },
    "notes": "This is actually separable: y dy = (x-1) dx. Integrate and apply y(1) = 0.",
    "solution_text": "Separating variables:\n1) $y \\, dy = (x-1) \\, dx$.\n2) $\\frac{y^2}{2} = \\frac{(x-1)^2}{2} + C$.\n3) Apply $y(1) = 0$: $0 = 0 + C \\Rightarrow C = 0$.\n4) $y^2 = (x-1)^2$.\nOption A is correct.",
    "common_mistake": "Forgetting the +1 pattern and writing y^2 = x^2 - 2x without completing the square.",
    "concept_slugs": ["de-homogeneous"]
  },
  {
    "pattern_group": "de-homogeneous",
    "title": "For the homogeneous differential equation $\\frac{dy}{dx} = \\frac{x^2+y^2}{xy}$, if $y(1) = 1$, the value of $y^2(e)/e^2$ is ________.",
    "difficulty": "hard",
    "type": "practice",
    "correct_answer": "3",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Substitute y = vx, convert to separable form, solve and substitute values.",
    "solution_text": "Let $y = vx \\Rightarrow v + x\\frac{dv}{dx} = \\frac{1+v^2}{v} \\Rightarrow x\\frac{dv}{dx} = \\frac{1}{v}$.\n1) Separating variables: $v \\, dv = \\frac{dx}{x}$.\n2) Integrating: $\\frac{v^2}{2} = \\ln|x| + C \\Rightarrow \\frac{y^2}{2x^2} = \\ln|x| + C$.\n3) Given $y(1) = 1 \\Rightarrow \\frac{1}{2} = 0 + C \\Rightarrow C = 1/2$.\n4) The equation is: $\\frac{y^2}{2x^2} = \\ln|x| + 1/2 \\Rightarrow \\frac{y^2}{x^2} = 2\\ln|x| + 1$.\n5) At $x = e$: $\\frac{y^2(e)}{e^2} = 2\\ln(e) + 1 = 2(1) + 1 = 3$.\nThe answer is 3.",
    "common_mistake": "Mishandling integration of v dv or writing C = 0.",
    "concept_slugs": ["de-homogeneous"]
  },

  // 4. Linear First-Order Differential Equations (de-linear-first-order) - 8 questions
  {
    "pattern_group": "de-linear-first-order",
    "title": "The standard form of a linear first-order DE is $\\frac{dy}{dx} + P(x)y = Q(x)$. The integrating factor is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$e^{\\int P \\, dx}$",
      "B": "$e^{-\\int P \\, dx}$",
      "C": "$e^{\\int Q \\, dx}$",
      "D": "$P(x)$"
    },
    "notes": "The integrating factor (IF) for dy/dx + Py = Q is IF = e^(integral of P dx).",
    "solution_text": "The integrating factor for $\\frac{dy}{dx} + P(x)y = Q(x)$:\n1) Multiply both sides by IF = $e^{\\int P \\, dx}$.\n2) The left side becomes $\\frac{d}{dx}\\left(y \\cdot e^{\\int P \\, dx}\\right)$.\n3) Integrating: $y \\cdot e^{\\int P \\, dx} = \\int Q \\cdot e^{\\int P \\, dx} \\, dx + C$.\nIF = $e^{\\int P \\, dx}$.\nOption A is correct.",
    "common_mistake": "Using e^(-integral of P) — this is wrong.",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The solution of $\\frac{dy}{dx} + y = e^x$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$ye^x = \\frac{e^{2x}}{2} + C$",
      "B": "$y = e^x + C$",
      "C": "$ye^x = e^{2x} + C$",
      "D": "$y = \\frac{e^x}{2} + Ce^{-x}$"
    },
    "notes": "IF = e^(integral of 1 dx) = e^x. Multiply both sides by e^x and integrate.",
    "solution_text": "Using the integrating factor method:\n1) $P = 1$, so IF $= e^{\\int 1 \\, dx} = e^x$.\n2) Multiply: $\\frac{d}{dx}(ye^x) = e^x \\cdot e^x = e^{2x}$.\n3) Integrate: $ye^x = \\frac{e^{2x}}{2} + C$.\nOption A is correct.",
    "common_mistake": "Forgetting to multiply Q(x) = e^x by the integrating factor e^x before integrating.",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The solution of $\\frac{dy}{dx} - \\frac{y}{x} = x^2$ is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = \\frac{x^3}{2} + Cx$",
      "B": "$y = x^3 - Cx$",
      "C": "$y = x^2 + C/x$",
      "D": "$y = x^2 + Cx$"
    },
    "notes": "P = -1/x, so IF = e^(integral of -1/x dx) = e^(-ln x) = 1/x. Multiply and integrate.",
    "solution_text": "Using the integrating factor method:\n1) $P = -\\frac{1}{x}$, so IF $= e^{\\int -\\frac{1}{x} \\, dx} = e^{-\\ln x} = \\frac{1}{x}$.\n2) Multiply by $\\frac{1}{x}$: $\\frac{d}{dx}\\left(\\frac{y}{x}\\right) = \\frac{x^2}{x} = x$.\n3) Integrate: $\\frac{y}{x} = \\frac{x^2}{2} + C \\Rightarrow y = \\frac{x^3}{2} + Cx$.\nOption A is correct.",
    "common_mistake": "Computing IF as x (integrating 1/x) instead of 1/x (integrating -1/x).",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The solution of $\\frac{dy}{dx} + 2y\\tan x = \\sin x$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y \\sec^2 x = \\sec x + C$",
      "B": "$y \\cos^2 x = \\cos x + C$",
      "C": "$y = \\cos x + C\\cos^2 x$",
      "D": "$y = \\sec x + C\\cos^2 x$"
    },
    "notes": "P = 2 tan x, IF = e^(integral of 2 tan x dx) = e^(2 ln|sec x|) = sec^2 x.",
    "solution_text": "Using IF method:\n1) IF $= e^{\\int 2\\tan x \\, dx} = e^{2\\ln|\\sec x|} = \\sec^2 x$.\n2) $\\frac{d}{dx}(y\\sec^2 x) = \\sin x \\sec^2 x = \\sec x \\tan x$.\n3) Integrate: $y\\sec^2 x = \\sec x + C$.\nOption A is correct.",
    "common_mistake": "Computing the IF as sec x (integrating tan x once) instead of sec^2 x (integrating 2 tan x).",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The solution of $x \\frac{dy}{dx} + y = x \\ln x$ with $y(1) = \\frac{1}{4}$ is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$y = \\frac{x \\ln x}{2} - \\frac{x}{4} + \\frac{1}{2x}$",
      "B": "$y = x \\ln x - \\frac{x}{4}$",
      "C": "$y = \\frac{\\ln x}{2} + \\frac{1}{4x}$",
      "D": "$y = x \\ln x + \\frac{1}{4}$"
    },
    "notes": "Rewrite as dy/dx + y/x = ln x. IF = x. Integrate x*ln x using IBP.",
    "solution_text": "Using IF method:\n1) $\\frac{dy}{dx} + \\frac{y}{x} = \\ln x$. $P = 1/x$, IF $= x$.\n2) $\\frac{d}{dx}(xy) = x \\ln x$.\n3) $xy = \\int x \\ln x \\, dx = \\frac{x^2 \\ln x}{2} - \\frac{x^2}{4} + C$.\n4) $y = \\frac{x \\ln x}{2} - \\frac{x}{4} + \\frac{C}{x}$.\n5) At $x=1$: $\\frac{1}{4} = 0 - \\frac{1}{4} + C \\Rightarrow C = \\frac{1}{2}$.\n6) $y = \\frac{x\\ln x}{2} - \\frac{x}{4} + \\frac{1}{2x}$.\nOption A is correct.",
    "common_mistake": "Forgetting to divide by x (the IF) at the end, leaving xy instead of y.",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The integrating factor of the differential equation $\\cos x \\frac{dy}{dx} + y \\sin x = 1$ is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\sec x$",
      "B": "$\\cos x$",
      "C": "$\\tan x$",
      "D": "$\\sin x$"
    },
    "notes": "Convert to standard form dy/dx + Py = Q by dividing through by cos x.",
    "solution_text": "Divide the DE by $\\cos x$:\n1) $\\frac{dy}{dx} + y \\tan x = \\sec x$.\n2) $P(x) = \\tan x$.\n3) Integrating factor: IF $= e^{\\int \\tan x \\, dx} = e^{\\ln|\\sec x|} = \\sec x$.\nOption A is correct.",
    "common_mistake": "Using sin x as P(x) without dividing by the coefficient of dy/dx.",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "Solve $\\frac{dy}{dx} + \\frac{2}{x}y = 3x^2$ with $y(1) = 1$. The value of $y(2)$ is ________.",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "4.9",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "IF = x^2. Multiply by x^2, integrate the right hand side, and solve for y.",
    "solution_text": "Using the integrating factor method:\n1) $P = 2/x \\Rightarrow$ IF $= e^{\\int 2/x \\, dx} = x^2$.\n2) Multiply by $x^2$: $\\frac{d}{dx}(x^2 y) = 3x^4$.\n3) Integrate: $x^2 y = \\frac{3x^5}{5} + C$.\n4) Apply $y(1) = 1 \\Rightarrow 1 = \\frac{3}{5} + C \\Rightarrow C = 2/5$.\n5) So $x^2 y = \\frac{3x^5 + 2}{5} \\Rightarrow y = \\frac{3x^3}{5} + \\frac{2}{5x^2}$.\n6) At $x = 2$: $y(2) = \\frac{3(8)}{5} + \\frac{2}{5(4)} = \\frac{24}{5} + \\frac{1}{10} = 4.8 + 0.1 = 4.9$.\nThe answer is 4.9.",
    "common_mistake": "Leaving out the integrating factor inside the integral of Q.",
    "concept_slugs": ["de-linear-first-order"]
  },
  {
    "pattern_group": "de-linear-first-order",
    "title": "The integrating factor of the differential equation $(x \\ln x)\\frac{dy}{dx} + y = 2 \\ln x$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\ln x$",
      "B": "$x \\ln x$",
      "C": "$e^x$",
      "D": "$\\ln(\\ln x)$"
    },
    "notes": "Divide by x ln x to get the standard form dy/dx + P(x)y = Q(x).",
    "solution_text": "Divide by $x \\ln x$:\n1) $\\frac{dy}{dx} + \\frac{1}{x \\ln x} y = \\frac{2}{x}$.\n2) $P(x) = \\frac{1}{x \\ln x}$.\n3) $\\int P(x) \\, dx = \\int \\frac{1}{x \\ln x} \\, dx = \\ln|\\ln x|$ (using substitution $u = \\ln x$).\n4) IF $= e^{\\ln|\\ln x|} = \\ln x$.\nOption A is correct.",
    "common_mistake": "Taking P(x) = 1/(x ln x) and integrating to get x ln x.",
    "concept_slugs": ["de-linear-first-order"]
  },

  // 5. Bernoulli's & Reducible Equations (de-bernoulli-reducible) - 8 questions
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "A Bernoulli differential equation has the form $\\frac{dy}{dx} + P(x)y = Q(x)y^n$. For $n = 0$, it reduces to:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "A standard linear first-order ODE",
      "B": "A separable ODE",
      "C": "A homogeneous ODE",
      "D": "A second-order ODE"
    },
    "notes": "For n = 0, y^n = 1, so the equation becomes dy/dx + Py = Q, which is a linear first-order ODE.",
    "solution_text": "Setting $n = 0$ in $\\frac{dy}{dx} + P(x)y = Q(x)y^n$:\n1) $y^0 = 1$.\n2) The equation becomes $\\frac{dy}{dx} + P(x)y = Q(x)$, a standard linear first-order ODE.\nOption A is correct.",
    "common_mistake": "Saying n = 0 gives a separable equation (that's n = 1).",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "To solve the Bernoulli equation $\\frac{dy}{dx} + Py = Qy^n$ ($n \\neq 0, 1$), the substitution is:",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$v = y^{1-n}$",
      "B": "$v = y^n$",
      "C": "$v = y^{n-1}$",
      "D": "$v = \\ln y$"
    },
    "notes": "Dividing by y^n and substituting v = y^(1-n) converts the Bernoulli equation to a linear ODE.",
    "solution_text": "The standard reduction for Bernoulli equations:\n1) Divide by $y^n$: $y^{-n}\\frac{dy}{dx} + Py^{1-n} = Q$.\n2) Let $v = y^{1-n} \\Rightarrow \\frac{dv}{dx} = (1-n)y^{-n}\\frac{dy}{dx}$.\n3) The equation becomes $\\frac{1}{1-n}\\frac{dv}{dx} + Pv = Q$, a linear ODE in $v$.\nOption A is correct.",
    "common_mistake": "Substituting v = y^n instead of v = y^(1-n), which does not linearize the equation.",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "The solution of $\\frac{dy}{dx} + y = y^2$ using Bernoulli substitution is:",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2022",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{1}{y} = 1 + Ce^x$",
      "B": "$\\frac{1}{y} = 1 - Ce^x$",
      "C": "$y = 1 + Ce^{-x}$",
      "D": "$y = 1 - Ce^{-x}$"
    },
    "notes": "n = 2. Substitute v = y^(1-2) = y^(-1) = 1/y. The equation becomes dv/dx - v = -1.",
    "solution_text": "Using Bernoulli substitution with $n = 2$:\n1) Let $v = y^{-1} = 1/y$. Then $\\frac{dv}{dx} = -y^{-2}\\frac{dy}{dx}$.\n2) Divide the original by $y^2$: $y^{-2}\\frac{dy}{dx} + y^{-1} = 1$.\n3) $-\\frac{dv}{dx} + v = 1 \\Rightarrow \\frac{dv}{dx} - v = -1$.\n4) IF $= e^{-x}$. $\\frac{d}{dx}(ve^{-x}) = -e^{-x}$.\n5) $ve^{-x} = e^{-x} + C \\Rightarrow v = 1 + Ce^x$.\n6) $\\frac{1}{y} = 1 + Ce^x$.\nOption A is correct.",
    "common_mistake": "Forgetting the negative sign when converting dv/dx from -y^{-2}(dy/dx).",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "The solution of $x\\frac{dy}{dx} + y = x^3 y^3$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{1}{y^2} = x^2(C - 2x)$",
      "B": "$y^2 = x^2 + C$",
      "C": "$y^2 x^2 = C - x^4$",
      "D": "$y^{-2} + x^2 = C$"
    },
    "notes": "This is Bernoulli with n = 3. Rewrite in standard form, substitute v = y^(1-3) = y^(-2).",
    "solution_text": "Bernoulli with $n = 3$: divide by $y^3$:\n1) $xy^{-3}\\frac{dy}{dx} + y^{-2} = x^3$.\n2) Let $v = y^{-2} \\Rightarrow \\frac{dv}{dx} = -2y^{-3}\\frac{dy}{dx}$.\n3) Rewrite: $-\\frac{x}{2}\\frac{dv}{dx} + v = x^3 \\Rightarrow \\frac{dv}{dx} - \\frac{2v}{x} = -2x^2$.\n4) IF $= x^{-2}$: $\\frac{d}{dx}(vx^{-2}) = -2$.\n5) $vx^{-2} = -2x + C \\Rightarrow \\frac{1}{y^2 x^2} = C - 2x \\Rightarrow \\frac{1}{y^2} = x^2(C - 2x)$.\nOption A is correct.",
    "common_mistake": "Not correctly deriving dv/dx from v = y^(-2).",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "For the differential equation $\\frac{dy}{dx} = y(1 - y)$ with $y(0) = \\frac{1}{2}$, the value of $y(\\ln 2)$ is ________.",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "0.67",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Separate variables: dy/(y(1-y)) = dx. Use partial fractions. Apply initial condition y(0) = 1/2.",
    "solution_text": "Separating variables: $\\frac{dy}{y(1-y)} = dx$.\n1) Partial fractions: $\\frac{1}{y(1-y)} = \\frac{1}{y} + \\frac{1}{1-y}$.\n2) $\\ln y - \\ln(1-y) = x + C \\Rightarrow \\ln\\frac{y}{1-y} = x + C$.\n3) $\\frac{y}{1-y} = Ae^x$.\n4) At $y(0) = \\frac{1}{2}$: $\\frac{1/2}{1/2} = 1 = A$.\n5) $\\frac{y}{1-y} = e^x \\Rightarrow y = \\frac{e^x}{1+e^x}$.\n6) At $x = \\ln 2$: $y = \\frac{2}{1+2} = \\frac{2}{3} \\approx 0.67$.\nThe answer is 0.67.",
    "common_mistake": "Forgetting to include both partial fractions or sign error in integrating 1/(1-y).",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "The integrating factor for the Bernoulli equation $\\frac{dy}{dx} + \\frac{y}{x} = x^2 y^4$, after substituting $v = y^{-3}$, is:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x^{-3}$",
      "B": "$x^3$",
      "C": "$e^{-3\\ln x}$",
      "D": "$x^{-9}$"
    },
    "notes": "After Bernoulli substitution v = y^(-3), the linearized DE has P(x) = -3/x. IF = e^(-3 ln x) = x^(-3).",
    "solution_text": "After Bernoulli substitution $v = y^{-3}$:\n1) The linearized DE is $\\frac{dv}{dx} - \\frac{3v}{x} = -3x^2$.\n2) $P(x) = -3/x$.\n3) IF $= e^{\\int -3/x \\, dx} = e^{-3\\ln x} = x^{-3}$.\nOption A is correct.",
    "common_mistake": "Using n = 4 directly in the IF formula instead of after substituting v = y^(1-n).",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "The solution of $\\frac{dy}{dx} + \\frac{y}{x} = y^2 \\ln x$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{1}{xy} = C - \\frac{(\\ln x)^2}{2}$",
      "B": "$\\frac{1}{y} = C - \\ln x$",
      "C": "$xy = C - \\frac{(\\ln x)^2}{2}$",
      "D": "$y = x\\ln x + C$"
    },
    "notes": "Divide by y^2 and use Bernoulli substitution v = 1/y.",
    "solution_text": "Divide by $y^2$: $y^{-2}\\frac{dy}{dx} + \\frac{1}{x} y^{-1} = \\ln x$.\n1) Let $v = y^{-1} \\Rightarrow \\frac{dv}{dx} = -y^{-2}\\frac{dy}{dx}$.\n2) $-\\frac{dv}{dx} + \\frac{v}{x} = \\ln x \\Rightarrow \\frac{dv}{dx} - \\frac{v}{x} = -\\ln x$.\n3) IF $= e^{\\int -1/x \\, dx} = 1/x$.\n4) $\\frac{d}{dx}(\\frac{v}{x}) = -\\frac{\\ln x}{x}$.\n5) Integrate: $\\frac{v}{x} = -\\frac{(\\ln x)^2}{2} + C \\Rightarrow \n   \\frac{1}{xy} = C - \\frac{(\\ln x)^2}{2}$.\nOption A is correct.",
    "common_mistake": "Getting the wrong sign in the linearized equation or integrating ln(x)/x incorrectly.",
    "concept_slugs": ["de-bernoulli-reducible"]
  },
  {
    "pattern_group": "de-bernoulli-reducible",
    "title": "The solution of the differential equation $\\frac{dy}{dx} = (x + y + 1)^2$ is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\tan^{-1}(x+y+1) = x + C$",
      "B": "$\\sin^{-1}(x+y+1) = x + C$",
      "C": "$x+y+1 = \\tan(x^2 + C)$",
      "D": "$y = \\tan x - x - 1 + C$"
    },
    "notes": "Substitute u = x + y + 1, find du/dx, and reduce the equation to variable separable form.",
    "solution_text": "Let $u = x + y + 1 \\Rightarrow \\frac{du}{dx} = 1 + \\frac{dy}{dx}$.\n1) Substituting this into the DE: $\\frac{du}{dx} - 1 = u^2 \\Rightarrow \\frac{du}{dx} = u^2 + 1$.\n2) Separating variables: $\\frac{du}{u^2+1} = dx$.\n3) Integrating: $\\tan^{-1}(u) = x + C \\Rightarrow \\tan^{-1}(x+y+1) = x + C$.\nOption A is correct.",
    "common_mistake": "Integrating 1/(u^2+1) as ln(u^2+1) or forgetting the +1 term when finding du/dx.",
    "concept_slugs": ["de-bernoulli-reducible"]
  },

  // 6. Orthogonal Trajectories & Applied Problems (de-orthogonal-applications) - 8 questions
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "A body cools from $80^\\circ\\text{C}$ to $50^\\circ\\text{C}$ in $10$ minutes in a room of temperature $20^\\circ\\text{C}$. The temperature of the body after another $10$ minutes will be ________ $^\\circ\\text{C}$.",
    "difficulty": "medium",
    "type": "pyq",
    "source": "JEE Main 2023",
    "correct_answer": "35",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Solve Newton's Law of Cooling DE: T - T_env = C * e^(-kt).",
    "solution_text": "Using Newton's cooling law: $\\theta - 20 = (\\theta_0 - 20)e^{-kt} \\Rightarrow \\theta - 20 = 60e^{-kt}$.\n1) At $t = 10$, $\\theta = 50 \\Rightarrow 50 - 20 = 30 = 60e^{-10k} \\Rightarrow e^{-10k} = 1/2$.\n2) At $t = 20$ (after another 10 min): $\\theta - 20 = 60e^{-20k} = 60(e^{-10k})^2 = 60(1/4) = 15$.\n3) Therefore, $\\theta = 15 + 20 = 35^\\circ\\text{C}$.\nThe answer is 35.",
    "common_mistake": "Treating the cooling rate as linear and calculating 50 - 30 = 20°C.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "A population grows at a rate proportional to the current population $P$. If $P(0) = 1000$ and $P(2) = 2000$, then $P(6)$ is ________.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "8000",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Solve dP/dt = kP. P = P0*e^(kt). Find k from P(2) = 2000, then compute P(6).",
    "solution_text": "Solving the exponential growth model:\n1) $P = 1000 e^{kt}$.\n2) $P(2) = 1000 e^{2k} = 2000 \\Rightarrow e^{2k} = 2 \\Rightarrow k = \\frac{\\ln 2}{2}$.\n3) $P(6) = 1000 e^{6k} = 1000 e^{3\\ln 2} = 1000 \\times 2^3 = 1000 \\times 8 = 8000$.\nThe answer is 8000.",
    "common_mistake": "Computing P(6) as 2000 * 2 = 4000 instead of 1000 * 2^3.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "The orthogonal trajectory of the family of curves $y^2 = 4ax$ (where $a$ is a variable parameter) is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$2x^2 + y^2 = C$",
      "B": "$x^2 - y^2 = C$",
      "C": "$x^2 + 2y^2 = C$",
      "D": "$y^2 - 2x^2 = C$"
    },
    "notes": "Find the differential equation of the family, replace dy/dx with -dx/dy, and solve.",
    "solution_text": "For $y^2 = 4ax$:\n1) Differentiating: $2y\\frac{dy}{dx} = 4a$.\n2) Substitute $4a = y^2/x$: $2y\\frac{dy}{dx} = \\frac{y^2}{x} \\Rightarrow \\frac{dy}{dx} = \\frac{y}{2x}$.\n3) Orthogonal trajectories: replace $\\frac{dy}{dx}$ with $-\\frac{dx}{dy}$:\n   $-\\frac{dx}{dy} = \\frac{y}{2x} \\Rightarrow 2x\\,dx = -y\\,dy$.\n4) Integrate: $x^2 = -\\frac{y^2}{2} + C_1 \\Rightarrow 2x^2 + y^2 = C$.\nOption A is correct.",
    "common_mistake": "Not eliminating the parameter a before substituting -dx/dy.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "The orthogonal trajectories of the family of straight lines $y = cx$ passing through the origin is:",
    "difficulty": "easy",
    "type": "concept",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x^2 + y^2 = C$",
      "B": "$x^2 - y^2 = C$",
      "C": "$xy = C$",
      "D": "$x+y = C$"
    },
    "notes": "The DE of y = cx is dy/dx = y/x. For orthogonal trajectories, solve -dx/dy = y/x.",
    "solution_text": "The family is $y = cx$:\n1) Differentiating: $\\frac{dy}{dx} = c = \\frac{y}{x}$.\n2) Replace $\\frac{dy}{dx}$ with $-\\frac{dx}{dy}$:\n   $-\\frac{dx}{dy} = \\frac{y}{x} \\Rightarrow x\\,dx + y\\,dy = 0$.\n3) Integrating gives $\\frac{x^2}{2} + \\frac{y^2}{2} = C_1 \\Rightarrow x^2 + y^2 = C$.\nOption A is correct.",
    "common_mistake": "Forgetting the minus sign when replacing dy/dx, leading to x^2 - y^2 = C.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "A tank contains $100\\text{ liters}$ of pure water. Brine containing $2\\text{ grams}$ of dissolved salt per liter flows into the tank at a rate of $3\\text{ L/min}$. The mixture is kept uniform and flows out at the same rate. The differential equation governing the salt content $S(t)$ in the tank is:",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$\\frac{dS}{dt} = 6 - 0.03S$",
      "B": "$\\frac{dS}{dt} = 6 - 3S$",
      "C": "$\\frac{dS}{dt} = 2 - 0.03S$",
      "D": "$\\frac{dS}{dt} = 6 + 0.03S$"
    },
    "notes": "Use the rate equation: dS/dt = (Rate of salt in) - (Rate of salt out).",
    "solution_text": "Let's set up the differential equation:\n1) Rate of salt entering $= 2\\text{ g/L} \\times 3\\text{ L/min} = 6\\text{ g/min}$.\n2) Rate of salt leaving $= \\frac{S(t)}{100}\\text{ g/L} \\times 3\\text{ L/min} = 0.03S(t)\\text{ g/min}$.\n3) Therefore, $\\frac{dS}{dt} = 6 - 0.03S$.\nOption A is correct.",
    "common_mistake": "Using the volume flow rate directly without converting it to mass of salt per unit time.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "The rate of decay of a radioactive substance is proportional to the amount $N(t)$ present at any time $t$. If the half-life of the substance is $100$ years, the percentage of the substance remaining after $200$ years is ________ $\%$.",
    "difficulty": "easy",
    "type": "practice",
    "correct_answer": "25",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Calculate the amount remaining using N(t) = N0 * (1/2)^(t/T_half).",
    "solution_text": "Using radioactive decay formula:\n1) $N(t) = N_0 \\left(\\frac{1}{2}\\right)^{t/T_{1/2}}$.\n2) Here $T_{1/2} = 100$ years, and $t = 200$ years.\n3) $N(200) = N_0 \\left(\\frac{1}{2}\\right)^2 = 0.25 N_0$.\n4) The percentage remaining is $25\\%$.\nThe answer is 25.",
    "common_mistake": "Thinking the decay is linear and saying 0% remains after 200 years.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "The orthogonal trajectories of the family of circles $x^2 + y^2 - cx = 0$ is:",
    "difficulty": "hard",
    "type": "pyq",
    "source": "JEE Advanced 2021",
    "correct_answer": "A",
    "is_numerical": false,
    "question_format": "mcq",
    "options": {
      "A": "$x^2 + y^2 - ky = 0$",
      "B": "$x^2 + y^2 - kx = 0$",
      "C": "$x^2 - y^2 - ky = 0$",
      "D": "$x^2 + y^2 = k$"
    },
    "notes": "Differentiate to eliminate c. Substitute dy/dx with -dx/dy and solve the homogeneous equation.",
    "solution_text": "For $x^2 + y^2 - cx = 0$:\n1) $c = \\frac{x^2+y^2}{x}$. Differentiate: $2x + 2yy' - c = 0 \\Rightarrow 2x + 2yy' - \\frac{x^2+y^2}{x} = 0$.\n2) This simplifies to: $y' = \\frac{y^2-x^2}{2xy}$.\n3) For orthogonal trajectories, replace $y'$ with $-1/y'$:\n   $-\\frac{1}{y'} = \\frac{y^2-x^2}{2xy} \\Rightarrow y' = \\frac{2xy}{x^2-y^2}$.\n4) This homogeneous DE has the solution $x^2 + y^2 - ky = 0$ (a family of circles centered on the y-axis).\nOption A is correct.",
    "common_mistake": "Mishandling the substitution of -1/y' or failing to correctly integrate the resulting homogeneous DE.",
    "concept_slugs": ["de-orthogonal-applications"]
  },
  {
    "pattern_group": "de-orthogonal-applications",
    "title": "In a certain culture, the bacteria count grows at a rate proportional to the count at that instant. If the count doubles in $3$ hours, the bacteria count after $9$ hours will be ________ times the initial count.",
    "difficulty": "medium",
    "type": "practice",
    "correct_answer": "8",
    "is_numerical": true,
    "question_format": "numerical",
    "notes": "Solve dB/dt = kB. Use B(3) = 2*B0 to find the factor for a 9-hour period.",
    "solution_text": "Using bacterial growth formula:\n1) $B(t) = B_0 e^{kt}$.\n2) Count doubles in 3 hours: $B(3) = B_0 e^{3k} = 2 B_0 \\Rightarrow e^{3k} = 2$.\n3) Count after 9 hours: $B(9) = B_0 e^{9k} = B_0 (e^{3k})^3 = B_0 (2)^3 = 8 B_0$.\n4) The count will be 8 times the initial count.\nThe answer is 8.",
    "common_mistake": "Assuming linear growth and multiplying by 3 to get 6 times instead of 2^3 = 8 times.",
    "concept_slugs": ["de-orthogonal-applications"]
  }
];

// Write questions list to JSON
const questionsPath = path.join(__dirname, 'differential_equations_questions.json');
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`Successfully generated ${questions.length} questions in differential_equations_questions.json`);

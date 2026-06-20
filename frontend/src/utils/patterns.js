export const KINEMATICS_PATTERNS = [
  {
    key: 'basic-kinematics',
    name: 'Basic Kinematics — Direct Formula Application',
    description: 'Applying the equations of motion (v=u+at, s=ut+½at², v²=u²+2as) under constant acceleration.',
  },
  {
    key: 'gravity-free-fall',
    name: 'Motion Under Gravity — Free Fall',
    description: 'Analysis of bodies dropped or released from rest moving solely under gravity.',
  },
  {
    key: 'gravity-vertical-throw',
    name: 'Motion Under Gravity — Vertical Throw',
    description: 'Kinematics of bodies projected vertically upwards or downwards with initial velocity.',
  },
  {
    key: 'graphs',
    name: 'Graphical Analysis — v-t, x-t, a-t',
    description: 'Interpreting motion, displacement, velocity, and acceleration from graphical representations.',
  },
  {
    key: 'relative-1d',
    name: 'Relative Velocity — 1D',
    description: 'Relative motion of bodies in one dimension, including chasing and train crossing scenarios.',
  },
  {
    key: 'relative-2d',
    name: 'Relative Velocity — Rain-Man / River-Boat',
    description: 'Two-dimensional relative velocity problems involving rain-man umbrellas and river-crossing boat drift.',
  },
  {
    key: 'projectile-basic',
    name: 'Projectile Motion — Basic Range/Height/Time',
    description: 'Computing range, max height, time of flight, and velocity vectors for standard projectile motion.',
  },
  {
    key: 'projectile-collision',
    name: 'Two Projectiles / Collision',
    description: 'Collision conditions, minimum separation, and relative motion between two projectiles in flight.',
  },
  {
    key: 'projectile-incline',
    name: 'Projectile on Inclined Plane',
    description: 'Projectiles launched up or down inclined surfaces with coordinate transformations.',
  },
  {
    key: 'circular',
    name: 'Uniform Circular Motion',
    description: 'Angular velocity, centripetal and tangential acceleration, and motion in circles.',
  },
  {
    key: 'variable-acceleration',
    name: 'Variable Acceleration / Non-Uniform Motion',
    description: 'Problems where acceleration depends on time, velocity, or position, requiring integration.',
  },
  {
    key: 'multi-concept',
    name: 'Multi-Concept / Disguised Kinematics',
    description: 'Complex scenarios combining multiple kinematic frameworks, constraint equations, or bouncing kinematics.',
  }
];

export const PATTERN_SHORT_NAMES = {
  'basic-kinematics': 'Basic Kinematics',
  'gravity-free-fall': 'Free Fall',
  'gravity-vertical-throw': 'Vertical Throw',
  'graphs': 'Graphical Analysis',
  'relative-1d': 'Relative 1D',
  'relative-2d': 'Rain/River',
  'projectile-basic': 'Projectile Basic',
  'projectile-collision': 'Collision',
  'projectile-incline': 'Incline Projectile',
  'circular': 'Circular Motion',
  'variable-acceleration': 'Variable Accel',
  'multi-concept': 'Multi-Concept',
};

export const classifyQuestion = (q) => {
  // Only classify Kinematics (chapter_id = 2) questions
  if (q.chapter_id !== 2 && q.chapterId !== 2 && q.chapter_name !== 'Kinematics') {
    return q.pattern_group || null;
  }
  
  const idx = q.order_index;
  if (idx >= 1 && idx <= 12) return 'basic-kinematics';
  if (idx >= 13 && idx <= 22) return 'gravity-free-fall';
  if (idx >= 23 && idx <= 32) return 'gravity-vertical-throw';
  if (idx >= 33 && idx <= 44) return 'graphs';
  if (idx >= 45 && idx <= 53) return 'relative-1d';
  if (idx >= 54 && idx <= 63) return 'relative-2d';
  if (idx >= 64 && idx <= 75) return 'projectile-basic';
  if (idx >= 76 && idx <= 84) return 'projectile-collision';
  if (idx >= 85 && idx <= 92) return 'projectile-incline';
  if (idx >= 93 && idx <= 100) return 'circular';
  if (idx >= 101 && idx <= 108) return 'variable-acceleration';
  if (idx >= 109 && idx <= 116) return 'multi-concept';
  
  return q.pattern_group || null;
};

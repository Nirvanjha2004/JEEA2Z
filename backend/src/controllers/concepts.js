import { query } from '../db/index.js';

/**
 * Recalculates concept mastery for a user and a modified question
 */
export const recalculateConceptMastery = async (userId, questionId) => {
  try {
    // Find all concepts associated with this question
    const conceptRes = await query(
      'SELECT concept_id FROM question_concepts WHERE question_id = $1',
      [questionId]
    );
    const conceptIds = conceptRes.rows.map(r => r.concept_id);

    for (const conceptId of conceptIds) {
      // Calculate attempted, correct, and last_attempted for this concept
      const statsRes = await query(
        `SELECT 
           COUNT(CASE WHEN up.status IN ('done', 'revisit') THEN 1 END)::int as attempted,
           COUNT(CASE WHEN up.status = 'done' THEN 1 END)::int as correct,
           MAX(up.updated_at) as last_attempted
         FROM question_concepts qc
         JOIN user_progress up ON up.question_id = qc.question_id
         WHERE qc.concept_id = $1 AND up.user_id = $2`,
        [conceptId, userId]
      );

      const { attempted, correct, last_attempted } = statsRes.rows[0];
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

      // Upsert into concept_mastery
      await query(
        `INSERT INTO concept_mastery (user_id, concept_id, questions_attempted, questions_correct, accuracy_percent, last_attempted)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, concept_id)
         DO UPDATE SET 
           questions_attempted = EXCLUDED.questions_attempted,
           questions_correct = EXCLUDED.questions_correct,
           accuracy_percent = EXCLUDED.accuracy_percent,
           last_attempted = EXCLUDED.last_attempted`,
        [userId, conceptId, attempted, correct, accuracy, last_attempted]
      );
    }
  } catch (err) {
    console.error('Error recalculating concept mastery:', err);
  }
};

/**
 * GET /api/chapters/:chapterId/concepts
 */
export const getChapterConcepts = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user ? req.user.id : null;

    const result = await query(
      `SELECT c.*, 
         COALESCE(cm.questions_attempted, 0) as questions_attempted,
         COALESCE(cm.questions_correct, 0) as questions_correct,
         COALESCE(cm.accuracy_percent, 0) as accuracy_percent
       FROM concepts c
       LEFT JOIN concept_mastery cm ON cm.concept_id = c.id AND cm.user_id = $1
       WHERE c.chapter_id = $2
       ORDER BY c.id`,
      [userId, chapterId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/concepts/:conceptId/questions
 */
export const getConceptQuestions = async (req, res, next) => {
  try {
    const { conceptId } = req.params;
    const userId = req.user ? req.user.id : null;

    // Fetch concept details
    const conceptRes = await query('SELECT * FROM concepts WHERE id = $1', [conceptId]);
    if (conceptRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Concept not found' });
    }

    // Fetch questions linked to the concept
    const questionsRes = await query(
      `SELECT q.*, COALESCE(up.status, 'todo') as status,
         (
           SELECT COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)), '[]'::json)
           FROM question_concepts qc_inner
           JOIN concepts c ON c.id = qc_inner.concept_id
           WHERE qc_inner.question_id = q.id
         ) as concepts,
         COALESCE(
           (SELECT jsonb_object_agg(option_key, option_text) 
            FROM question_options 
            WHERE question_id = q.id), 
           '{}'::jsonb
         ) as options
       FROM questions q
       JOIN question_concepts qc ON qc.question_id = q.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $2
       WHERE qc.concept_id = $1
       ORDER BY q.order_index`,
      [conceptId, userId]
    );

    return res.json({
      success: true,
      data: {
        concept: conceptRes.rows[0],
        questions: questionsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/concepts/mastery
 * Returns all concepts with user's mastery stats (ordered weakest-first)
 */
export const getConceptMastery = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT 
         c.id as concept_id,
         c.name as name,
         c.slug as slug,
         c.chapter_id,
         ch.name as chapter_name,
         s.name as subject_name,
         COALESCE(cm.questions_attempted, 0) as questions_attempted,
         COALESCE(cm.questions_correct, 0) as questions_correct,
         COALESCE(cm.accuracy_percent, 0) as accuracy_percent,
         cm.last_attempted
       FROM concepts c
       JOIN chapters ch ON ch.id = c.chapter_id
       JOIN subjects s ON s.id = ch.subject_id
       LEFT JOIN concept_mastery cm ON cm.concept_id = c.id AND cm.user_id = $1
       ORDER BY COALESCE(cm.accuracy_percent, 0) ASC, c.id ASC`,
      [userId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/concepts/:conceptId/practice
 * Generates a 5-question focused practice set prioritized as: unsolved > revisit > done.
 */
export const getConceptPracticeSet = async (req, res, next) => {
  try {
    const { conceptId } = req.params;
    const userId = req.user.id;

    // Fetch concept details
    const conceptRes = await query('SELECT * FROM concepts WHERE id = $1', [conceptId]);
    if (conceptRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Concept not found' });
    }

    const questionsRes = await query(
      `SELECT q.*, COALESCE(up.status, 'todo') as status,
         CASE 
           WHEN up.status IS NULL OR up.status = 'todo' THEN 1
           WHEN up.status = 'revisit' THEN 2
           WHEN up.status = 'done' THEN 3
           ELSE 4
         END as priority,
         (
           SELECT COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)), '[]'::json)
           FROM question_concepts qc_inner
           JOIN concepts c ON c.id = qc_inner.concept_id
           WHERE qc_inner.question_id = q.id
         ) as concepts,
         COALESCE(
           (SELECT jsonb_object_agg(option_key, option_text) 
            FROM question_options 
            WHERE question_id = q.id), 
           '{}'::jsonb
         ) as options
       FROM questions q
       JOIN question_concepts qc ON qc.question_id = q.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $2
       WHERE qc.concept_id = $1
       ORDER BY priority ASC, q.order_index ASC
       LIMIT 5`,
      [conceptId, userId]
    );

    return res.json({
      success: true,
      data: {
        concept: conceptRes.rows[0],
        questions: questionsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/concepts/patterns/:chapterId/:patternKey/practice
 * Generates a 5-question focused practice set for a specific pattern group, prioritized: unsolved > revisit > done.
 */
export const getPatternPracticeSet = async (req, res, next) => {
  try {
    const { chapterId, patternKey } = req.params;
    const userId = req.user.id;

    // Define SQL filter condition based on order_index partitions for the 12 groups
    let patternFilter = '';
    const params = [parseInt(chapterId, 10), userId];

    if (patternKey === 'basic-kinematics') {
      patternFilter = "q.pattern_group = 'basic-kinematics'";
    } else if (patternKey === 'gravity-free-fall') {
      patternFilter = "q.pattern_group = 'gravity' AND q.order_index BETWEEN 13 AND 22";
    } else if (patternKey === 'gravity-vertical-throw') {
      patternFilter = "q.pattern_group = 'gravity' AND q.order_index BETWEEN 23 AND 32";
    } else if (patternKey === 'graphs') {
      patternFilter = "q.pattern_group = 'graphs'";
    } else if (patternKey === 'relative-1d') {
      patternFilter = "q.pattern_group = 'relative' AND q.order_index BETWEEN 45 AND 53";
    } else if (patternKey === 'relative-2d') {
      patternFilter = "q.pattern_group = 'relative' AND q.order_index BETWEEN 54 AND 63";
    } else if (patternKey === 'projectile-basic') {
      patternFilter = "q.pattern_group = 'projectile' AND q.order_index BETWEEN 64 AND 75";
    } else if (patternKey === 'projectile-collision') {
      patternFilter = "q.pattern_group = 'projectile' AND q.order_index BETWEEN 76 AND 84";
    } else if (patternKey === 'projectile-incline') {
      patternFilter = "q.pattern_group = 'projectile-incline'";
    } else if (patternKey === 'circular') {
      patternFilter = "q.pattern_group = 'circular'";
    } else if (patternKey === 'variable-acceleration') {
      patternFilter = "q.pattern_group = 'advanced' AND q.order_index BETWEEN 101 AND 108";
    } else if (patternKey === 'multi-concept') {
      patternFilter = "q.pattern_group = 'advanced' AND q.order_index BETWEEN 109 AND 116";
    } else {
      patternFilter = "q.pattern_group = $3";
      params.push(patternKey);
    }

    const questionsRes = await query(
      `SELECT q.*, COALESCE(up.status, 'todo') as status,
         CASE 
           WHEN up.status IS NULL OR up.status = 'todo' THEN 1
           WHEN up.status = 'revisit' THEN 2
           WHEN up.status = 'done' THEN 3
           ELSE 4
         END as priority,
         (
           SELECT COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)), '[]'::json)
           FROM question_concepts qc_inner
           JOIN concepts c ON c.id = qc_inner.concept_id
           WHERE qc_inner.question_id = q.id
         ) as concepts,
         COALESCE(
           (SELECT jsonb_object_agg(option_key, option_text) 
            FROM question_options 
            WHERE question_id = q.id), 
           '{}'::jsonb
         ) as options
       FROM questions q
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $2
       WHERE q.chapter_id = $1 AND ${patternFilter}
       ORDER BY priority ASC, q.order_index ASC
       LIMIT 5`,
      params
    );

    // Friendly display name for the pattern group
    const patternNames = {
      'basic-kinematics': 'Basic Kinematics — Direct Formula Application',
      'gravity-free-fall': 'Motion Under Gravity — Free Fall',
      'gravity-vertical-throw': 'Motion Under Gravity — Vertical Throw',
      'graphs': 'Graphical Analysis — v-t, x-t, a-t',
      'relative-1d': 'Relative Velocity — 1D',
      'relative-2d': 'Relative Velocity — Rain-Man / River-Boat',
      'projectile-basic': 'Projectile Motion — Basic Range/Height/Time',
      'projectile-collision': 'Two Projectiles / Collision',
      'projectile-incline': 'Projectile on Inclined Plane',
      'circular': 'Uniform Circular Motion',
      'variable-acceleration': 'Variable Acceleration / Non-Uniform Motion',
      'multi-concept': 'Multi-Concept / Disguised Kinematics',
    };

    return res.json({
      success: true,
      data: {
        concept: {
          id: `pattern:${chapterId}:${patternKey}`,
          name: patternNames[patternKey] || patternKey,
        },
        questions: questionsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};


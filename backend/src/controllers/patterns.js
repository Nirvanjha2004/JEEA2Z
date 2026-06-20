import { query } from '../db/index.js';

// GET /api/chapters/:chapterId/patterns
// Returns all pattern groups for a chapter with question counts and user's mastery
export const getChapterPatterns = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user?.id;

    // Get all pattern groups and their question counts
    const patternsQuery = await query(
      `SELECT 
        q.pattern_group,
        COUNT(*) as total_questions,
        COUNT(CASE WHEN q.type = 'pyq' THEN 1 END) as pyq_count,
        COUNT(CASE WHEN q.type = 'concept' THEN 1 END) as concept_count,
        COUNT(CASE WHEN q.type = 'practice' THEN 1 END) as practice_count,
        COUNT(CASE WHEN q.type = 'advanced' THEN 1 END) as advanced_count,
        MIN(q.order_index) as sort_order
       FROM questions q
       WHERE q.chapter_id = $1 AND q.pattern_group IS NOT NULL
       GROUP BY q.pattern_group
       ORDER BY sort_order`,
      [chapterId]
    );

    let patterns = patternsQuery.rows;

    // If user is authenticated, fetch their mastery data
    if (userId) {
      const masteryQuery = await query(
        `SELECT pattern_group, questions_done, questions_revisit, accuracy_percent
         FROM pattern_mastery
         WHERE user_id = $1 AND chapter_id = $2`,
        [userId, chapterId]
      );
      
      const masteryMap = new Map(masteryQuery.rows.map(m => [m.pattern_group, m]));
      
      patterns = patterns.map(p => ({
        ...p,
        user_done: masteryMap.get(p.pattern_group)?.questions_done || 0,
        user_revisit: masteryMap.get(p.pattern_group)?.questions_revisit || 0,
        accuracy: masteryMap.get(p.pattern_group)?.accuracy_percent || 0
      }));
    }

    res.json({ success: true, data: patterns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/patterns/:patternGroup/questions?chapterId=X
// Returns all questions in a pattern group
export const getPatternQuestions = async (req, res) => {
  try {
    const { patternGroup } = req.params;
    const { chapterId } = req.query;
    const userId = req.user?.id;

    let sqlQuery = `
      SELECT q.*, c.name as chapter_name, s.name as subject_name, s.slug as subject_slug
      FROM questions q
      JOIN chapters c ON q.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE q.pattern_group = $1
    `;
    let params = [patternGroup];

    if (chapterId) {
      sqlQuery += ` AND q.chapter_id = $2`;
      params.push(chapterId);
    }
    sqlQuery += ` ORDER BY q.order_index`;

    if (userId) {
      sqlQuery = `
        SELECT q.*, c.name as chapter_name, s.name as subject_name, s.slug as subject_slug,
               up.status as user_status
        FROM questions q
        JOIN chapters c ON q.chapter_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        LEFT JOIN user_progress up ON q.id = up.question_id AND up.user_id = $${params.length + 1}
        WHERE q.pattern_group = $1
        ${chapterId ? ` AND q.chapter_id = $2` : ''}
        ORDER BY q.order_index
      `;
      params.push(userId);
    }

    const questions = await query(sqlQuery, params);

    // Fetch options for MCQ questions
    const questionIds = questions.rows.map(q => q.id);
    let optionsMap = {};
    if (questionIds.length > 0) {
      const options = await query(
        `SELECT * FROM question_options WHERE question_id = ANY($1)`,
        [questionIds]
      );
      optionsMap = options.rows.reduce((acc, opt) => {
        if (!acc[opt.question_id]) acc[opt.question_id] = {};
        acc[opt.question_id][opt.option_key] = opt.option_text;
        return acc;
      }, {});
    }

    const questionsWithOptions = questions.rows.map(q => ({
      ...q,
      options: optionsMap[q.id] || {}
    }));

    res.json({ success: true, data: questionsWithOptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/patterns/:patternGroup/practice
// Returns a curated practice set for a pattern group
export const getPatternPractice = async (req, res) => {
  try {
    const { patternGroup } = req.params;
    const { chapterId } = req.body;
    const userId = req.user.id;

    const questions = await query(
      `WITH ranked AS (
        SELECT q.*,
          COALESCE(up.status, 'todo') as user_status,
          CASE up.status
            WHEN 'todo' THEN 1
            WHEN 'revisit' THEN 2
            WHEN 'done' THEN 3
            ELSE 1
          END as priority
        FROM questions q
        LEFT JOIN user_progress up ON q.id = up.question_id AND up.user_id = $1
        WHERE q.pattern_group = $2 AND q.chapter_id = $3
      )
      SELECT * FROM ranked
      ORDER BY priority, RANDOM()
      LIMIT 5`,
      [userId, patternGroup, chapterId]
    );

    // Fetch options for these questions
    const questionIds = questions.rows.map(q => q.id);
    let optionsMap = {};
    if (questionIds.length > 0) {
      const options = await query(
        `SELECT * FROM question_options WHERE question_id = ANY($1)`,
        [questionIds]
      );
      optionsMap = options.rows.reduce((acc, opt) => {
        if (!acc[opt.question_id]) acc[opt.question_id] = {};
        acc[opt.question_id][opt.option_key] = opt.option_text;
        return acc;
      }, {});
    }

    const questionsWithOptions = questions.rows.map(q => ({
      ...q,
      options: optionsMap[q.id] || {}
    }));

    res.json({ success: true, data: questionsWithOptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Hook: Update pattern mastery when progress changes
// Call this inside your existing POST /api/progress controller
export const updatePatternMastery = async (userId, questionId, status) => {
  try {
    const question = await query(
      `SELECT chapter_id, pattern_group FROM questions WHERE id = $1`,
      [questionId]
    );
    
    if (!question.rows[0]?.pattern_group) return;
    
    const { chapter_id, pattern_group } = question.rows[0];
    
    await query(
      `INSERT INTO pattern_mastery (user_id, chapter_id, pattern_group, questions_total, questions_done, questions_revisit, accuracy_percent, last_updated)
       SELECT 
         $1, $2, $3,
         COUNT(*) as total,
         COUNT(CASE WHEN up.status = 'done' THEN 1 END) as done,
         COUNT(CASE WHEN up.status = 'revisit' THEN 1 END) as revisit,
         COALESCE(ROUND(COUNT(CASE WHEN up.status = 'done' THEN 1 END) * 100.0 / NULLIF(COUNT(CASE WHEN up.status IN ('done','revisit') THEN 1 END), 0), 1), 0) as accuracy,
         NOW()
       FROM questions q
       LEFT JOIN user_progress up ON q.id = up.question_id AND up.user_id = $1
       WHERE q.chapter_id = $2 AND q.pattern_group = $3
       ON CONFLICT (user_id, chapter_id, pattern_group)
       DO UPDATE SET
         questions_total = EXCLUDED.questions_total,
         questions_done = EXCLUDED.questions_done,
         questions_revisit = EXCLUDED.questions_revisit,
         accuracy_percent = EXCLUDED.accuracy_percent,
         last_updated = EXCLUDED.last_updated`,
      [userId, chapter_id, pattern_group]
    );
  } catch (err) {
    console.error('Failed to update pattern mastery:', err);
  }
};

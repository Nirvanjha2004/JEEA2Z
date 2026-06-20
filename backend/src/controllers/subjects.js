import { query } from '../db/index.js';

export const getSubjects = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM subjects ORDER BY id');

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getChapters = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    let result;
    if (userId) {
      result = await query(
        `SELECT c.id, c.name, c.order_index, 
                COUNT(q.id)::int as question_count,
                COUNT(CASE WHEN up.status = 'done' THEN 1 END)::int as done_count
         FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         LEFT JOIN questions q ON q.chapter_id = c.id
         LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $2
         WHERE s.slug = $1
         GROUP BY c.id, c.name, c.order_index
         ORDER BY c.order_index`,
        [slug, userId]
      );
    } else {
      result = await query(
        `SELECT c.id, c.name, c.order_index, 
                COUNT(q.id)::int as question_count,
                0::int as done_count
         FROM chapters c
         JOIN subjects s ON c.subject_id = s.id
         LEFT JOIN questions q ON q.chapter_id = c.id
         WHERE s.slug = $1
         GROUP BY c.id, c.name, c.order_index
         ORDER BY c.order_index`,
        [slug]
      );
    }

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestions = async (req, res, next) => {
  try {
    const { chapterId } = req.params;

    let result;

    if (req.user) {
      result = await query(
        `SELECT q.*, COALESCE(up.status, 'todo') as status
         FROM questions q
         LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $2
         WHERE q.chapter_id = $1
         ORDER BY q.order_index`,
        [chapterId, req.user.id]
      );
    } else {
      result = await query(
        `SELECT q.*, 'todo' as status
         FROM questions q
         WHERE q.chapter_id = $1
         ORDER BY q.order_index`,
        [chapterId]
      );
    }

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

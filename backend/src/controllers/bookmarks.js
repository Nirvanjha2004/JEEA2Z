import { query } from '../db/index.js';

export const getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Join questions, chapters, subjects, and bookmarks
    const result = await query(
      `SELECT q.*, c.name as chapter_name, s.name as subject_name, s.slug as subject_slug,
              COALESCE(up.status, 'todo') as status
       FROM bookmarks b
       JOIN questions q ON b.question_id = q.id
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $1
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    const userId = req.user.id;

    if (!questionId) {
      return res.status(400).json({ success: false, message: 'questionId is required' });
    }

    // Check if bookmark exists
    const checkRes = await query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );

    if (checkRes.rows.length > 0) {
      // Remove it
      await query(
        'DELETE FROM bookmarks WHERE user_id = $1 AND question_id = $2',
        [userId, questionId]
      );
      return res.json({ success: true, data: { bookmarked: false } });
    } else {
      // Add it
      await query(
        'INSERT INTO bookmarks (user_id, question_id) VALUES ($1, $2)',
        [userId, questionId]
      );
      return res.json({ success: true, data: { bookmarked: true } });
    }
  } catch (error) {
    next(error);
  }
};

import { query } from '../db/index.js';

export const getNote = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    const result = await query(
      'SELECT * FROM question_notes WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const upsertNote = async (req, res, next) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user.id;

    if (!questionId || content === undefined) {
      return res.status(400).json({ success: false, message: 'questionId and content are required' });
    }

    const result = await query(
      `INSERT INTO question_notes (user_id, question_id, content, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, question_id)
       DO UPDATE SET content = $3, updated_at = NOW()
       RETURNING *`,
      [userId, questionId, content]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    await query(
      'DELETE FROM question_notes WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );

    return res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

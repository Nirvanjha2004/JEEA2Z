import { query } from '../db/index.js';
import { feedbackSchema } from '../validators/feedback.js';

export const createFeedback = async (req, res, next) => {
  try {
    const validated = feedbackSchema.parse(req.body);
    const userId = req.user.id;

    const result = await query(
      `INSERT INTO feedback (user_id, category, message, rating, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [userId, validated.category, validated.message, validated.rating || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

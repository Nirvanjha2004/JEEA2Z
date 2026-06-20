import { query } from '../db/index.js';

// Timezone-safe local date YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - offset * 60 * 1000);
  return localD.toISOString().split('T')[0];
};

export const getQueue = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = getLocalDateString();

    const result = await query(
      `SELECT sr.id as sr_id, sr.next_review, sr.interval_days, sr.ease_factor, sr.repetitions,
              q.*, c.name as chapter_name, s.name as subject_name, s.slug as subject_slug,
              COALESCE(up.status, 'todo') as status
       FROM spaced_repetition sr
       JOIN questions q ON sr.question_id = q.id
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $1
       WHERE sr.user_id = $1 AND sr.next_review <= $2::date
       ORDER BY sr.next_review ASC
       LIMIT 20`,
      [userId, today]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const reviewQuestion = async (req, res, next) => {
  try {
    const { questionId, quality } = req.body;
    const userId = req.user.id;

    if (questionId === undefined || quality === undefined) {
      return res.status(400).json({ success: false, message: 'questionId and quality are required' });
    }

    const qRating = parseInt(quality, 10);
    if (isNaN(qRating) || qRating < 0 || qRating > 5) {
      return res.status(400).json({ success: false, message: 'quality must be between 0 and 5' });
    }

    // Fetch existing repetition record
    const existRes = await query(
      'SELECT * FROM spaced_repetition WHERE user_id = $1 AND question_id = $2',
      [userId, questionId]
    );

    let repetitions = 0;
    let interval = 1;
    let easeFactor = 2.5;

    if (existRes.rows.length > 0) {
      const row = existRes.rows[0];
      repetitions = row.repetitions;
      interval = row.interval_days;
      easeFactor = row.ease_factor;
    }

    // Apply SM-2 Algorithm
    if (qRating < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - qRating) * (0.08 + (5 - qRating) * 0.02));
    easeFactor = Math.max(1.3, easeFactor);

    // Calculate next review date
    const today = new Date();
    // Add interval days
    const nextReviewDate = new Date(today.getTime() + interval * 24 * 60 * 60 * 1000);
    const nextReviewString = nextReviewDate.toISOString().split('T')[0];

    const upsertRes = await query(
      `INSERT INTO spaced_repetition (user_id, question_id, next_review, interval_days, ease_factor, repetitions)
       VALUES ($1, $2, $3::date, $4, $5, $6)
       ON CONFLICT (user_id, question_id)
       DO UPDATE SET next_review = $3::date, interval_days = $4, ease_factor = $5, repetitions = $6
       RETURNING *`,
      [userId, questionId, nextReviewString, interval, easeFactor, repetitions]
    );

    return res.json({
      success: true,
      data: {
        nextReview: nextReviewString,
        intervalDays: interval,
        newEaseFactor: easeFactor,
      },
    });
  } catch (error) {
    next(error);
  }
};

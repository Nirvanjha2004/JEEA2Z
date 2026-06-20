import { query } from '../db/index.js';
import { updateProgressSchema } from '../validators/progress.js';

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get total question count
    const totalResult = await query('SELECT COUNT(*)::int as total FROM questions');
    const total = totalResult.rows[0].total;

    // Get done and revisit counts
    const progressResult = await query(
      `SELECT
         COUNT(CASE WHEN status = 'done' THEN 1 END)::int as done,
         COUNT(CASE WHEN status = 'revisit' THEN 1 END)::int as revisit
       FROM user_progress
       WHERE user_id = $1`,
      [userId]
    );
    const { done, revisit } = progressResult.rows[0];

    // Get per-subject breakdown
    const subjectResult = await query(
      `SELECT s.id, s.name, s.slug,
         COUNT(q.id)::int as total,
         COUNT(CASE WHEN up.status = 'done' THEN 1 END)::int as done,
         COUNT(CASE WHEN up.status = 'revisit' THEN 1 END)::int as revisit
       FROM subjects s
       JOIN chapters c ON c.subject_id = s.id
       JOIN questions q ON q.chapter_id = c.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $1
       GROUP BY s.id, s.name, s.slug
       ORDER BY s.id`,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        total,
        done,
        revisit,
        bySubject: subjectResult.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - offset * 60 * 1000);
  return localD.toISOString().split('T')[0];
};

export const updateProgress = async (req, res, next) => {
  try {
    const validated = updateProgressSchema.parse(req.body);
    const userId = req.user.id;

    const result = await query(
      `INSERT INTO user_progress (user_id, question_id, status, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, question_id)
       DO UPDATE SET status = $3, updated_at = NOW()
       RETURNING *`,
      [userId, validated.questionId, validated.status]
    );

    const todayStr = getLocalDateString();

    // V2 Hooks
    if (validated.status === 'done') {
      // 1. Update streak_activity for today
      await query(
        `INSERT INTO streak_activity (user_id, date, solved)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, date)
         DO UPDATE SET solved = streak_activity.solved + 1`,
        [userId, todayStr]
      );

      // 2. Recalculate streaks table
      const streakRes = await query('SELECT * FROM streaks WHERE user_id = $1', [userId]);

      const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
      const offset = yesterday.getTimezoneOffset();
      const localYesterday = new Date(yesterday.getTime() - offset * 60 * 1000);
      const yesterdayStr = localYesterday.toISOString().split('T')[0];

      if (streakRes.rows.length === 0) {
        await query(
          `INSERT INTO streaks (user_id, current_streak, longest_streak, last_active_date, daily_goal)
           VALUES ($1, 1, 1, $2, 10)`,
          [userId, todayStr]
        );
      } else {
        const streak = streakRes.rows[0];
        let currentStreak = streak.current_streak;
        let longestStreak = streak.longest_streak;
        
        let lastActiveStr = null;
        if (streak.last_active_date) {
          const lD = new Date(streak.last_active_date);
          const lOffset = lD.getTimezoneOffset();
          const localLD = new Date(lD.getTime() - lOffset * 60 * 1000);
          lastActiveStr = localLD.toISOString().split('T')[0];
        }

        if (lastActiveStr === yesterdayStr) {
          currentStreak += 1;
        } else if (lastActiveStr === todayStr) {
          // no change
        } else {
          currentStreak = 1;
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }

        await query(
          `UPDATE streaks
           SET current_streak = $1, longest_streak = $2, last_active_date = $3
           WHERE user_id = $4`,
          [currentStreak, longestStreak, todayStr, userId]
        );
      }

      // 4. Spaced Repetition Done Hook
      const srCheck = await query('SELECT * FROM spaced_repetition WHERE user_id = $1 AND question_id = $2', [userId, validated.questionId]);
      if (srCheck.rows.length > 0) {
        let { repetitions, interval_days: interval, ease_factor: easeFactor } = srCheck.rows[0];
        const qRating = 5; // quality = 5
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
        easeFactor = easeFactor + (0.1 - (5 - qRating) * (0.08 + (5 - qRating) * 0.02));
        easeFactor = Math.max(1.3, easeFactor);

        const nextReviewDate = new Date(new Date().getTime() + interval * 24 * 60 * 60 * 1000);
        const nextReviewString = nextReviewDate.toISOString().split('T')[0];

        await query(
          `UPDATE spaced_repetition
           SET next_review = $1::date, interval_days = $2, ease_factor = $3, repetitions = $4
           WHERE user_id = $5 AND question_id = $6`,
          [nextReviewString, interval, easeFactor, repetitions, userId, validated.questionId]
        );
      }
    } else if (validated.status === 'revisit') {
      // 3. Spaced Repetition Revisit Hook
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const offsetTom = tomorrow.getTimezoneOffset();
      const localTom = new Date(tomorrow.getTime() - offsetTom * 60 * 1000);
      const tomorrowStr = localTom.toISOString().split('T')[0];

      await query(
        `INSERT INTO spaced_repetition (user_id, question_id, next_review, interval_days, ease_factor, repetitions)
         VALUES ($1, $2, $3::date, 1, 2.5, 0)
         ON CONFLICT (user_id, question_id)
         DO UPDATE SET next_review = $3::date, interval_days = 1, ease_factor = 2.5, repetitions = 0`,
        [userId, validated.questionId, tomorrowStr]
      );
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getChapterProgress = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `SELECT q.id as question_id, COALESCE(up.status, 'todo') as status
       FROM questions q
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $1
       WHERE q.chapter_id = $2`,
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

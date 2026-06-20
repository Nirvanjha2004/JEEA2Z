import { query } from '../db/index.js';

// Timezone-safe local date YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localD = new Date(d.getTime() - offset * 60 * 1000);
  return localD.toISOString().split('T')[0];
};

export const getStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = getLocalDateString();

    // 1. Get or initialize streak record
    let streakRes = await query(
      'SELECT current_streak, longest_streak, daily_goal, last_active_date FROM streaks WHERE user_id = $1',
      [userId]
    );

    let streakInfo;
    if (streakRes.rows.length === 0) {
      const initRes = await query(
        `INSERT INTO streaks (user_id, current_streak, longest_streak, daily_goal, last_active_date)
         VALUES ($1, 0, 0, 10, null)
         ON CONFLICT (user_id) DO NOTHING
         RETURNING current_streak, longest_streak, daily_goal, last_active_date`,
        [userId]
      );
      streakInfo = initRes.rows[0] || { current_streak: 0, longest_streak: 0, daily_goal: 10, last_active_date: null };
    } else {
      streakInfo = streakRes.rows[0];
    }

    // 2. Fetch solved count for today
    const solvedTodayRes = await query(
      'SELECT solved FROM streak_activity WHERE user_id = $1 AND date = $2',
      [userId, today]
    );
    const solvedToday = solvedTodayRes.rows.length > 0 ? solvedTodayRes.rows[0].solved : 0;

    // 3. Fetch 30-day calendar activity
    const calendarRes = await query(
      `SELECT g.date::text as date, COALESCE(sa.solved, 0)::int as solved
       FROM (
         SELECT (generate_series($2::date - INTERVAL '29 days', $2::date, '1 day'::interval))::date as date
       ) g
       LEFT JOIN streak_activity sa ON sa.date = g.date AND sa.user_id = $1
       ORDER BY date ASC`,
      [userId, today]
    );

    return res.json({
      success: true,
      data: {
        currentStreak: streakInfo.current_streak,
        longestStreak: streakInfo.longest_streak,
        dailyGoal: streakInfo.daily_goal,
        solvedToday,
        lastActiveDate: streakInfo.last_active_date,
        calendar: calendarRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStreakGoal = async (req, res, next) => {
  try {
    const { dailyGoal } = req.body;
    const userId = req.user.id;

    if (dailyGoal === undefined || dailyGoal <= 0) {
      return res.status(400).json({ success: false, message: 'dailyGoal must be a positive integer' });
    }

    const result = await query(
      `INSERT INTO streaks (user_id, daily_goal)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET daily_goal = $2
       RETURNING *`,
      [userId, dailyGoal]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

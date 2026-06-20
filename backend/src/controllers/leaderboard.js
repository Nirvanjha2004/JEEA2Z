import { query } from '../db/index.js';

const getWeeklyRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 1 is Monday...
  const diffToMon = day === 0 ? -6 : 1 - day; // Adjust to Monday
  const monday = new Date(today.getTime() + diffToMon * 24 * 60 * 60 * 1000);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Timezone-safe local date ISO strings
  const offset = today.getTimezoneOffset();
  
  const localMon = new Date(monday.getTime() - offset * 60 * 1000);
  const localSun = new Date(sunday.getTime() - offset * 60 * 1000);

  return {
    start: localMon.toISOString().split('T')[0],
    end: localSun.toISOString().split('T')[0],
  };
};

export const getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const { start, end } = getWeeklyRange();

    const result = await query(
      `SELECT u.id, u.name, u.avatar_url, 
              COALESCE(SUM(sa.solved), 0)::int as solved, 
              COALESCE(s.current_streak, 0) as streak
       FROM users u
       LEFT JOIN streak_activity sa ON sa.user_id = u.id AND sa.date >= $1::date AND sa.date <= $2::date
       LEFT JOIN streaks s ON s.user_id = u.id
       GROUP BY u.id, u.name, u.avatar_url, s.current_streak
       ORDER BY solved DESC, streak DESC, u.name ASC
       LIMIT 50`,
      [start, end]
    );

    // Map ranks
    const ranked = result.rows.map((row, idx) => ({
      rank: idx + 1,
      ...row,
    }));

    return res.json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

export const getAllTimeLeaderboard = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.avatar_url, 
              COUNT(up.id)::int as solved, 
              COALESCE(s.current_streak, 0) as streak
       FROM users u
       LEFT JOIN user_progress up ON up.user_id = u.id AND up.status = 'done'
       LEFT JOIN streaks s ON s.user_id = u.id
       GROUP BY u.id, u.name, u.avatar_url, s.current_streak
       ORDER BY solved DESC, streak DESC, u.name ASC
       LIMIT 50`
    );

    const ranked = result.rows.map((row, idx) => ({
      rank: idx + 1,
      ...row,
    }));

    return res.json({ success: true, data: ranked });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    // Fetch user details
    const userRes = await query(
      'SELECT id, name, avatar_url, created_at, is_public FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profileUser = userRes.rows[0];

    // Access check: only public or own profile
    if (!profileUser.is_public && profileUser.id !== currentUserId) {
      return res.status(403).json({ success: false, message: 'This profile is private' });
    }

    // Fetch streak details
    const streakRes = await query(
      'SELECT current_streak, longest_streak FROM streaks WHERE user_id = $1',
      [userId]
    );
    const streak = streakRes.rows[0] || { current_streak: 0, longest_streak: 0 };

    // Fetch total solved
    const solvedRes = await query(
      "SELECT COUNT(*)::int as solved FROM user_progress WHERE user_id = $1 AND status = 'done'",
      [userId]
    );
    const totalSolved = solvedRes.rows[0]?.solved || 0;

    // Fetch subject breakdown
    const subjectRes = await query(
      `SELECT s.id, s.name, s.slug, COUNT(q.id)::int as total,
              COUNT(CASE WHEN up.status = 'done' THEN 1 END)::int as solved
       FROM subjects s
       JOIN chapters c ON c.subject_id = s.id
       JOIN questions q ON q.chapter_id = c.id
       LEFT JOIN user_progress up ON up.question_id = q.id AND up.user_id = $1
       GROUP BY s.id, s.name, s.slug
       ORDER BY s.id`,
      [userId]
    );

    // Fetch recent activities (last 10 done)
    const activityRes = await query(
      `SELECT q.id as question_id, q.title, c.name as chapter_name, sub.name as subject_name, up.updated_at
       FROM user_progress up
       JOIN questions q ON up.question_id = q.id
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       WHERE up.user_id = $1 AND up.status = 'done'
       ORDER BY up.updated_at DESC
       LIMIT 10`,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        name: profileUser.name,
        avatarUrl: profileUser.avatar_url,
        joinedAt: profileUser.created_at,
        totalSolved,
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
        subjectBreakdown: subjectRes.rows,
        recentActivity: activityRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

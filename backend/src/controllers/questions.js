import { query } from '../db/index.js';

// GET /api/questions/:id/solve
// Returns question with all data needed for solving
export const getQuestionForSolving = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const sqlQuery = `
      SELECT q.*, c.name as chapter_name, s.name as subject_name, s.slug as subject_slug
      FROM questions q
      JOIN chapters c ON q.chapter_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE q.id = $1
    `;
    const params = [id];

    const question = await query(sqlQuery, params);
    if (!question.rows[0]) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const q = question.rows[0];

    // Fetch options for MCQ
    let options = [];
    if (q.question_format === 'mcq') {
      const opts = await query(
        `SELECT option_key, option_text FROM question_options WHERE question_id = $1 ORDER BY option_key`,
        [id]
      );
      options = opts.rows;
    }

    // Fetch user progress if authenticated
    let userStatus = 'todo';
    if (userId) {
      const progress = await query(
        `SELECT status FROM user_progress WHERE user_id = $1 AND question_id = $2`,
        [userId, id]
      );
      if (progress.rows[0]) userStatus = progress.rows[0].status;
    }

    res.json({
      success: true,
      data: {
        ...q,
        options,
        user_status: userStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/questions/:id/verify
// Validates answer without storing progress
export const verifyAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, blanks, numerical } = req.body;

    const question = await query(
      `SELECT correct_answer, question_format, blank_positions, tolerance, unit, solution_text, common_mistake, explanation
       FROM questions WHERE id = $1`,
      [id]
    );

    if (!question.rows[0]) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const q = question.rows[0];
    let isCorrect = false;
    let correctAnswer = q.correct_answer;

    if (q.question_format === 'mcq') {
      isCorrect = answer === q.correct_answer;
    } else if (q.question_format === 'fill_blank' && blanks) {
      const expected = typeof q.blank_positions === 'string' ? JSON.parse(q.blank_positions) : q.blank_positions;
      isCorrect = expected.every((blank, idx) => {
        const userAns = blanks[idx]?.trim().toLowerCase();
        const correct = blank.answer.toLowerCase();
        const alts = (blank.alternatives || []).map(a => a.toLowerCase());
        return userAns === correct || alts.includes(userAns);
      });
    } else if (q.question_format === 'numerical' && numerical) {
      const userNum = parseFloat(numerical);
      const correctNum = parseFloat(q.correct_answer);
      const tol = q.tolerance || 0.05;
      isCorrect = Math.abs(userNum - correctNum) <= tol * Math.abs(correctNum);
    }

    res.json({
      success: true,
      data: {
        is_correct: isCorrect,
        correct_answer: correctAnswer,
        explanation: q.explanation,
        common_mistake: q.common_mistake,
        solution_text: q.solution_text
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

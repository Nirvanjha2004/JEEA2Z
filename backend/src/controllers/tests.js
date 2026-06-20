import { query } from '../db/index.js';

export const createTest = async (req, res, next) => {
  try {
    const { title, scope, scopeId, durationMin, questionCount, questionIds } = req.body;
    const userId = req.user.id;

    if (!title || !scope || !durationMin || (!questionCount && !questionIds)) {
      return res.status(400).json({ success: false, message: 'Missing required parameters' });
    }

    let questions = [];

    if (scope === 'custom') {
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ success: false, message: 'questionIds array is required for custom scope' });
      }
      const qRes = await query(
        `SELECT id, title, difficulty, type, source, solution_url, notes, chapter_id
         FROM questions WHERE id = ANY($1::int[])`,
        [questionIds]
      );
      questions = qRes.rows;
    } else if (scope === 'chapter') {
      const qRes = await query(
        `SELECT id, title, difficulty, type, source, solution_url, notes, chapter_id
         FROM questions WHERE chapter_id = $1 ORDER BY RANDOM() LIMIT $2`,
        [scopeId, questionCount]
      );
      questions = qRes.rows;
    } else if (scope === 'subject') {
      const qRes = await query(
        `SELECT q.id, q.title, q.difficulty, q.type, q.source, q.solution_url, q.notes, q.chapter_id
         FROM questions q
         JOIN chapters c ON q.chapter_id = c.id
         WHERE c.subject_id = $1 ORDER BY RANDOM() LIMIT $2`,
        [scopeId, questionCount]
      );
      questions = qRes.rows;
    } else if (scope === 'full') {
      const qRes = await query(
        `SELECT id, title, difficulty, type, source, solution_url, notes, chapter_id
         FROM questions ORDER BY RANDOM() LIMIT $1`,
        [questionCount]
      );
      questions = qRes.rows;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid test scope' });
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'No questions found for the given criteria' });
    }

    // Shuffle questions in JavaScript
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    const totalQ = shuffledQuestions.length;
    const maxScore = totalQ * 4;

    // Create mock test row
    const testResult = await query(
      `INSERT INTO mock_tests (user_id, title, scope, scope_id, duration_min, total_q, status, max_score)
       VALUES ($1, $2, $3, $4, $5, $6, 'ongoing', $7) RETURNING id`,
      [userId, title, scope, scopeId || null, durationMin, totalQ, maxScore]
    );
    const testId = testResult.rows[0].id;

    // Create mock test questions slots
    for (const q of shuffledQuestions) {
      await query(
        'INSERT INTO mock_test_questions (test_id, question_id) VALUES ($1, $2)',
        [testId, q.id]
      );
    }

    return res.status(201).json({
      success: true,
      data: {
        testId,
        questions: shuffledQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    const testRes = await query(
      'SELECT * FROM mock_tests WHERE id = $1 AND user_id = $2',
      [testId, userId]
    );

    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    const test = testRes.rows[0];

    // Fetch questions without correct answers
    const qRes = await query(
      `SELECT q.id, q.title, q.difficulty, q.type, q.source, q.solution_url, q.notes, q.chapter_id,
              mtq.user_answer, mtq.time_spent
       FROM mock_test_questions mtq
       JOIN questions q ON mtq.question_id = q.id
       WHERE mtq.test_id = $1`,
      [testId]
    );

    return res.json({
      success: true,
      data: {
        ...test,
        questions: qRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT mt.*, 
              (SELECT COUNT(*)::int FROM mock_test_questions mtq WHERE mtq.test_id = mt.id AND mtq.is_correct = true) as correct_count
       FROM mock_tests mt
       WHERE mt.user_id = $1
       ORDER BY mt.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const submitTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken } = req.body; // answers: [{ questionId, userAnswer }]
    const userId = req.user.id;

    // Check test exists and is ongoing
    const testRes = await query(
      'SELECT * FROM mock_tests WHERE id = $1 AND user_id = $2',
      [testId, userId]
    );

    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    const test = testRes.rows[0];
    if (test.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Test has already been submitted' });
    }

    // Fetch correct answers for questions in this test
    const qRes = await query(
      `SELECT mtq.question_id, q.correct_answer
       FROM mock_test_questions mtq
       JOIN questions q ON mtq.question_id = q.id
       WHERE mtq.test_id = $1`,
      [testId]
    );

    const questionsMap = {};
    qRes.rows.forEach((row) => {
      questionsMap[row.question_id] = row.correct_answer;
    });

    let score = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const breakdown = [];

    // Evaluate answers
    const answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        answersMap[ans.questionId] = ans.userAnswer;
      });
    }

    for (const qId of Object.keys(questionsMap)) {
      const questionId = parseInt(qId, 10);
      const correctAnswer = questionsMap[questionId];
      const userAnswerRaw = answersMap[questionId];
      const userAnswer = userAnswerRaw !== undefined && userAnswerRaw !== null && userAnswerRaw !== '' ? String(userAnswerRaw).trim() : null;

      let isCorrect = null;
      let points = 0;

      if (userAnswer === null) {
        skipped++;
        points = 0;
      } else {
        const matches = correctAnswer && String(correctAnswer).trim().toLowerCase() === String(userAnswer).trim().toLowerCase();
        if (matches) {
          isCorrect = true;
          correct++;
          points = 4;
        } else {
          isCorrect = false;
          wrong++;
          points = -1;
        }
      }

      score += points;

      breakdown.push({
        questionId,
        correct: isCorrect,
        userAnswer,
        correctAnswer: test.status === 'completed' || true ? correctAnswer : null, // expose correctness now that they submit
      });

      // Update mock_test_questions row
      await query(
        `UPDATE mock_test_questions
         SET user_answer = $1, is_correct = $2, time_spent = $3
         WHERE test_id = $4 AND question_id = $5`,
        [userAnswer, isCorrect, null, testId, questionId] // we will store time_spent as null or calculate if provided
      );
    }

    const totalQ = qRes.rows.length;
    const maxScore = totalQ * 4;
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    // Update mock_tests row
    await query(
      `UPDATE mock_tests
       SET status = 'completed', score = $1, max_score = $2, completed_at = NOW(), duration_min = LEAST(duration_min, CEIL($3 / 60.0))
       WHERE id = $4`,
      [score, maxScore, timeTaken || 0, testId]
    );

    return res.json({
      success: true,
      data: {
        score,
        maxScore,
        correct,
        wrong,
        skipped,
        accuracy,
        timeTaken: timeTaken || 0,
        breakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getResult = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    const testRes = await query(
      'SELECT * FROM mock_tests WHERE id = $1 AND user_id = $2',
      [testId, userId]
    );

    if (testRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }

    const test = testRes.rows[0];

    // Fetch questions WITH correct answers and user options
    const qRes = await query(
      `SELECT q.id, q.title, q.difficulty, q.type, q.source, q.solution_url, q.notes, q.correct_answer,
              c.name as chapter_name, s.name as subject_name,
              mtq.user_answer, mtq.is_correct, mtq.time_spent
       FROM mock_test_questions mtq
       JOIN questions q ON mtq.question_id = q.id
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE mtq.test_id = $1`,
      [testId]
    );

    return res.json({
      success: true,
      data: {
        ...test,
        questions: qRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

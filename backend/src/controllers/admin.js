import { query } from '../db/index.js';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

const csvRowSchema = z.object({
  chapter_id: z.coerce.number().int().positive('chapter_id must be a positive integer'),
  title: z.string().min(1, 'title cannot be empty'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.enum(['pyq', 'concept', 'practice']),
  source: z.string().optional().nullable(),
  solution_url: z.string().optional().nullable(),
  correct_answer: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  order_index: z.coerce.number().int().nonnegative('order_index must be non-negative'),
});

// Questions Admin CRUD
export const getAdminQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const { subjectId, chapterId, difficulty, type, search } = req.query;
    const conditions = [];
    const params = [];

    if (subjectId) {
      params.push(subjectId);
      conditions.push(`c.subject_id = $${params.length}`);
    }
    if (chapterId) {
      params.push(chapterId);
      conditions.push(`q.chapter_id = $${params.length}`);
    }
    if (difficulty) {
      params.push(difficulty);
      conditions.push(`q.difficulty = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`q.type = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(q.title ILIKE $${params.length} OR q.source ILIKE $${params.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRes = await query(
      `SELECT COUNT(*)::int as count 
       FROM questions q
       JOIN chapters c ON q.chapter_id = c.id
       ${whereClause}`,
      params
    );
    const total = countRes.rows[0].count;

    const questionsRes = await query(
      `SELECT q.*, c.name as chapter_name, s.name as subject_name
       FROM questions q
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       ${whereClause}
       ORDER BY q.id DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    return res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        questions: questionsRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT q.*, c.subject_id
       FROM questions q
       JOIN chapters c ON q.chapter_id = c.id
       WHERE q.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  try {
    const { chapter_id, title, difficulty, type, source, solution_url, notes, correct_answer, order_index } = req.body;

    const result = await query(
      `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, correct_answer, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [chapter_id, title, difficulty, type, source || null, solution_url || null, notes || null, correct_answer || null, order_index || 0]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const editQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { chapter_id, title, difficulty, type, source, solution_url, notes, correct_answer, order_index } = req.body;

    const result = await query(
      `UPDATE questions
       SET chapter_id = $1, title = $2, difficulty = $3, type = $4, source = $5, solution_url = $6, notes = $7, correct_answer = $8, order_index = $9
       WHERE id = $10 RETURNING *`,
      [chapter_id, title, difficulty, type, source || null, solution_url || null, notes || null, correct_answer || null, order_index || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM questions WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    return res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const bulkImportQuestions = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      try {
        const cleaned = {
          chapter_id: row.chapter_id,
          title: row.title,
          difficulty: row.difficulty?.toLowerCase(),
          type: row.type?.toLowerCase(),
          source: row.source || null,
          solution_url: row.solution_url || null,
          correct_answer: row.correct_answer || null,
          notes: row.notes || null,
          order_index: row.order_index,
        };
        const validated = csvRowSchema.parse(cleaned);

        await query(
          `INSERT INTO questions (chapter_id, title, difficulty, type, source, solution_url, notes, correct_answer, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            validated.chapter_id,
            validated.title,
            validated.difficulty,
            validated.type,
            validated.source,
            validated.solution_url,
            validated.notes,
            validated.correct_answer,
            validated.order_index,
          ]
        );
        inserted++;
      } catch (err) {
        skipped++;
        errors.push({ row: i + 1, message: err.message || String(err) });
      }
    }

    return res.json({
      success: true,
      data: {
        inserted,
        skipped,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Chapters Admin CRUD
export const getAdminChapters = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, s.name as subject_name,
              (SELECT COUNT(*)::int FROM questions q WHERE q.chapter_id = c.id) as question_count
       FROM chapters c
       JOIN subjects s ON c.subject_id = s.id
       ORDER BY c.subject_id, c.order_index`
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const createChapter = async (req, res, next) => {
  try {
    const { subject_id, name, order_index } = req.body;

    const result = await query(
      'INSERT INTO chapters (subject_id, name, order_index) VALUES ($1, $2, $3) RETURNING *',
      [subject_id, name, order_index || 0]
    );

    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const editChapter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject_id, name, order_index } = req.body;

    const result = await query(
      `UPDATE chapters
       SET subject_id = $1, name = $2, order_index = $3
       WHERE id = $4 RETURNING *`,
      [subject_id, name, order_index || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteChapter = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if questions exist
    const checkRes = await query('SELECT COUNT(*)::int as count FROM questions WHERE chapter_id = $1', [id]);
    if (checkRes.rows[0].count > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete chapter containing questions' });
    }

    const result = await query('DELETE FROM chapters WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    return res.json({ success: true, message: 'Chapter deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Users Admin CRUD
export const getAdminUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = (page - 1) * limit;

    const countRes = await query('SELECT COUNT(*)::int as count FROM users');
    const total = countRes.rows[0].count;

    const usersRes = await query(
      `SELECT u.id, u.name, u.email, u.is_admin as "isAdmin", u.created_at as "createdAt",
              COUNT(up.id)::int as "totalSolved"
       FROM users u
       LEFT JOIN user_progress up ON up.user_id = u.id AND up.status = 'done'
       GROUP BY u.id, u.name, u.email, u.is_admin, u.created_at
       ORDER BY u.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`
    );

    return res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        users: usersRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Toggle current status
    const result = await query(
      `UPDATE users
       SET is_admin = NOT is_admin
       WHERE id = $1 RETURNING id, name, email, is_admin as "isAdmin"`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

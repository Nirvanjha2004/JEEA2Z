import { query } from '../db/index.js';

// GET /api/formulas/chapter/:chapterId
export const getFormulaSheet = async (req, res, next) => {
  const chapterId = parseInt(req.params.chapterId, 10);
  if (isNaN(chapterId)) {
    return res.status(400).json({ success: false, message: 'Invalid chapter ID.' });
  }

  try {
    const result = await query(
      `SELECT fs.id, fs.intro, fs.updated_at,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', f.id,
                    'title', f.title,
                    'latex', f.latex,
                    'description', f.description,
                    'variables', f.variables,
                    'tags', f.tags,
                    'orderIndex', f.order_index
                  ) ORDER BY f.order_index
                ) FILTER (WHERE f.id IS NOT NULL),
                '[]'::json
              ) as formulas
       FROM formula_sheets fs
       LEFT JOIN formulas f ON f.sheet_id = fs.id
       WHERE fs.chapter_id = $1
       GROUP BY fs.id`,
      [chapterId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, formulas: [], intro: null });
    }

    res.json({
      success: true,
      id: result.rows[0].id,
      intro: result.rows[0].intro,
      updated_at: result.rows[0].updated_at,
      formulas: result.rows[0].formulas
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/formulas/sheet
export const upsertFormulaSheet = async (req, res, next) => {
  const { chapterId, intro } = req.body;
  const parsedChapterId = parseInt(chapterId, 10);

  if (isNaN(parsedChapterId)) {
    return res.status(400).json({ success: false, message: 'Invalid chapter ID.' });
  }

  try {
    const result = await query(
      `INSERT INTO formula_sheets (chapter_id, intro, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (chapter_id)
       DO UPDATE SET intro = EXCLUDED.intro, updated_at = NOW()
       RETURNING *`,
      [parsedChapterId, intro]
    );

    res.json({
      success: true,
      message: 'Formula sheet updated successfully.',
      sheet: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/formulas
export const createFormula = async (req, res, next) => {
  const { sheetId, title, latex, description, variables, tags, orderIndex } = req.body;
  const parsedSheetId = parseInt(sheetId, 10);
  const parsedOrderIndex = parseInt(orderIndex, 10) || 0;

  if (isNaN(parsedSheetId)) {
    return res.status(400).json({ success: false, message: 'Invalid sheet ID.' });
  }

  if (!latex || typeof latex !== 'string' || latex.trim() === '') {
    return res.status(400).json({ success: false, message: 'LaTeX equation is required and must be non-empty.' });
  }

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Title is required.' });
  }

  try {
    const result = await query(
      `INSERT INTO formulas (sheet_id, title, latex, description, variables, tags, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        parsedSheetId,
        title,
        latex,
        description || '',
        JSON.stringify(variables || {}),
        tags || [],
        parsedOrderIndex
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Formula created successfully.',
      formula: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/formulas/:id
export const updateFormula = async (req, res, next) => {
  const formulaId = parseInt(req.params.id, 10);
  if (isNaN(formulaId)) {
    return res.status(400).json({ success: false, message: 'Invalid formula ID.' });
  }

  const fields = req.body;
  const allowedFields = ['title', 'latex', 'description', 'variables', 'tags', 'orderIndex'];
  const updateKeys = [];
  const updateValues = [];
  let index = 1;

  for (const field of allowedFields) {
    if (fields[field] !== undefined) {
      // Map frontend camelCase orderIndex to db snake_case order_index
      const dbField = field === 'orderIndex' ? 'order_index' : field;
      updateKeys.push(`${dbField} = $${index}`);
      
      let val = fields[field];
      if (field === 'variables') {
        val = JSON.stringify(val);
      }
      updateValues.push(val);
      index++;
    }
  }

  if (updateKeys.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update.' });
  }

  // Check LaTeX if provided
  if (fields.latex !== undefined && (typeof fields.latex !== 'string' || fields.latex.trim() === '')) {
    return res.status(400).json({ success: false, message: 'LaTeX equation cannot be empty.' });
  }

  updateValues.push(formulaId);
  const queryText = `
    UPDATE formulas
    SET ${updateKeys.join(', ')}
    WHERE id = $${index}
    RETURNING *
  `;

  try {
    const result = await query(queryText, updateValues);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Formula not found.' });
    }

    res.json({
      success: true,
      message: 'Formula updated successfully.',
      formula: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/formulas/:id
export const deleteFormula = async (req, res, next) => {
  const formulaId = parseInt(req.params.id, 10);
  if (isNaN(formulaId)) {
    return res.status(400).json({ success: false, message: 'Invalid formula ID.' });
  }

  try {
    // 1. Get sheet_id and order_index of the formula
    const checkRes = await query('SELECT sheet_id, order_index FROM formulas WHERE id = $1', [formulaId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Formula not found.' });
    }

    const { sheet_id, order_index } = checkRes.rows[0];

    // 2. Delete the formula
    await query('DELETE FROM formulas WHERE id = $1', [formulaId]);

    // 3. Reorder remaining formulas
    await query(
      `UPDATE formulas
       SET order_index = order_index - 1
       WHERE sheet_id = $1 AND order_index > $2`,
      [sheet_id, order_index]
    );

    res.json({
      success: true,
      message: 'Formula deleted and remaining formulas reordered successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/formulas/reorder
export const reorderFormulas = async (req, res, next) => {
  const { formulaIds } = req.body;

  if (!Array.isArray(formulaIds)) {
    return res.status(400).json({ success: false, message: 'formulaIds must be an array of formula IDs.' });
  }

  try {
    // Perform updates sequentially or in a simple loop within a transaction block if pool client is checked out,
    // or just execute queries using query().
    // For simplicity, we can do it inside a BEGIN/COMMIT block:
    await query('BEGIN');
    for (let i = 0; i < formulaIds.length; i++) {
      const id = parseInt(formulaIds[i], 10);
      if (!isNaN(id)) {
        await query('UPDATE formulas SET order_index = $1 WHERE id = $2', [i, id]);
      }
    }
    await query('COMMIT');

    res.json({
      success: true,
      message: 'Formulas reordered successfully.'
    });
  } catch (error) {
    await query('ROLLBACK');
    next(error);
  }
};

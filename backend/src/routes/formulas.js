import { Router } from 'express';
import {
  getFormulaSheet,
  upsertFormulaSheet,
  createFormula,
  updateFormula,
  deleteFormula,
  reorderFormulas
} from '../controllers/formulas.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Public route
router.get('/chapter/:chapterId', getFormulaSheet);

// Admin-only routes (protected by authMiddleware and adminMiddleware)
router.post('/sheet', authMiddleware, adminMiddleware, upsertFormulaSheet);
router.post('/', authMiddleware, adminMiddleware, createFormula);
router.patch('/:id', authMiddleware, adminMiddleware, updateFormula);
router.delete('/:id', authMiddleware, adminMiddleware, deleteFormula);
router.post('/reorder', authMiddleware, adminMiddleware, reorderFormulas);

export default router;

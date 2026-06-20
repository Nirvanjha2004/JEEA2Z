import { Router } from 'express';
import { getSummary, updateProgress, getChapterProgress } from '../controllers/progress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authMiddleware, getSummary);
router.post('/', authMiddleware, updateProgress);
router.get('/chapter/:chapterId', authMiddleware, getChapterProgress);

export default router;

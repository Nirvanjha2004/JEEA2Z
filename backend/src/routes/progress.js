import { Router } from 'express';
import { getSummary, updateProgress, getChapterProgress, getWeakPatterns } from '../controllers/progress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authMiddleware, getSummary);
router.get('/weak-patterns', authMiddleware, getWeakPatterns);
router.post('/', authMiddleware, updateProgress);
router.get('/chapter/:chapterId', authMiddleware, getChapterProgress);

export default router;

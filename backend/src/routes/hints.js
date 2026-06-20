import { Router } from 'express';
import { getHint, deleteHintCache } from '../controllers/hints.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/:questionId', authMiddleware, getHint);
router.delete('/:questionId/cache', authMiddleware, adminMiddleware, deleteHintCache);

export default router;

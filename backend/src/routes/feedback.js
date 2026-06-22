import { Router } from 'express';
import { createFeedback } from '../controllers/feedback.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createFeedback);

export default router;

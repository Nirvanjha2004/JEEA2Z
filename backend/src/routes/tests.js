import { Router } from 'express';
import { createTest, getTest, getHistory, submitTest, getResult } from '../controllers/tests.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/create', createTest);
router.get('/history', getHistory);
router.get('/:testId', getTest);
router.post('/:testId/submit', submitTest);
router.get('/:testId/result', getResult);

export default router;

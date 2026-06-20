import { Router } from 'express';
import { getStreak, updateStreakGoal } from '../controllers/streak.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getStreak);
router.patch('/goal', updateStreakGoal);

export default router;

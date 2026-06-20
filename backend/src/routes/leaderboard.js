import { Router } from 'express';
import { getWeeklyLeaderboard, getAllTimeLeaderboard } from '../controllers/leaderboard.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/weekly', getWeeklyLeaderboard);
router.get('/alltime', getAllTimeLeaderboard);

export default router;

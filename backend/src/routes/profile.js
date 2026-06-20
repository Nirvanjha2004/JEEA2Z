import { Router } from 'express';
import { getProfile } from '../controllers/leaderboard.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:userId', optionalAuth, getProfile);

export default router;

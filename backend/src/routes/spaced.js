import { Router } from 'express';
import { getQueue, reviewQuestion } from '../controllers/spaced.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/queue', getQueue);
router.post('/review', reviewQuestion);

export default router;

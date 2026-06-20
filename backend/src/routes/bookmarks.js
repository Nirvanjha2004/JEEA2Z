import { Router } from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarks.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getBookmarks);
router.post('/', toggleBookmark);

export default router;

import { Router } from 'express';
import { getComments, createComment, editComment, deleteComment, upvoteComment } from '../controllers/discussion.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/:questionId', authMiddleware, getComments);
router.post('/', authMiddleware, createComment);
router.patch('/:commentId', authMiddleware, editComment);
router.delete('/:commentId', authMiddleware, deleteComment);
router.post('/:commentId/upvote', authMiddleware, upvoteComment);

export default router;

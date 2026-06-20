import { Router } from 'express';
import { getNote, upsertNote, deleteNote } from '../controllers/notes.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/:questionId', getNote);
router.post('/', upsertNote);
router.delete('/:questionId', deleteNote);

export default router;

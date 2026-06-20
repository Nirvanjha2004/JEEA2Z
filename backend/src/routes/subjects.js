import { Router } from 'express';
import { getSubjects, getChapters, getQuestions } from '../controllers/subjects.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', getSubjects);
router.get('/:slug/chapters', optionalAuth, getChapters);
router.get('/chapters/:chapterId/questions', optionalAuth, getQuestions);

export default router;

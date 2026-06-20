import express from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import {
  getChapterPatterns,
  getPatternQuestions,
  getPatternPractice
} from '../controllers/patterns.js';

const router = express.Router();

router.get('/chapters/:chapterId/patterns', optionalAuth, getChapterPatterns);
router.get('/patterns/:patternGroup/questions', optionalAuth, getPatternQuestions);
router.post('/patterns/:patternGroup/practice', authMiddleware, getPatternPractice);

export default router;

import { Router } from 'express';
import { 
  getChapterConcepts, 
  getConceptQuestions, 
  getConceptMastery, 
  getConceptPracticeSet,
  getPatternPracticeSet
} from '../controllers/concepts.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Retrieve user mastery across all concepts (for Weak Areas widget)
router.get('/mastery', authMiddleware, getConceptMastery);

// Retrieve concepts for a chapter
router.get('/chapters/:chapterId', optionalAuth, getChapterConcepts);

// Retrieve questions for a specific concept
router.get('/:conceptId/questions', optionalAuth, getConceptQuestions);

// Generate 5-question practice set for a specific concept
router.post('/:conceptId/practice', authMiddleware, getConceptPracticeSet);

// Generate 5-question practice set for a specific pattern group
router.post('/patterns/:chapterId/:patternKey/practice', authMiddleware, getPatternPracticeSet);

export default router;

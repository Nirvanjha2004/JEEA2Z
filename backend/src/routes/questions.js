import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { getQuestionForSolving, verifyAnswer } from '../controllers/questions.js';

const router = express.Router();

router.get('/questions/:id/solve', optionalAuth, getQuestionForSolving);
router.post('/questions/:id/verify', optionalAuth, verifyAnswer);

export default router;

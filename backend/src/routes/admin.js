import { Router } from 'express';
import {
  getAdminQuestions,
  getQuestionById,
  createQuestion,
  editQuestion,
  deleteQuestion,
  bulkImportQuestions,
  getAdminChapters,
  createChapter,
  editChapter,
  deleteChapter,
  getAdminUsers,
  toggleAdmin,
} from '../controllers/admin.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import multer from 'multer';

const router = Router();
const upload = multer();

router.use(authMiddleware, adminMiddleware);

// Questions
router.get('/questions', getAdminQuestions);
router.get('/questions/:id', getQuestionById);
router.post('/questions', createQuestion);
router.patch('/questions/:id', editQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/questions/bulk', upload.single('file'), bulkImportQuestions);

// Chapters
router.get('/chapters', getAdminChapters);
router.post('/chapters', createChapter);
router.patch('/chapters/:id', editChapter);
router.delete('/chapters/:id', deleteChapter);

// Users
router.get('/users', getAdminUsers);
router.patch('/users/:id/admin', toggleAdmin);

export default router;

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.js';
import subjectRoutes from './src/routes/subjects.js';
import progressRoutes from './src/routes/progress.js';
import notesRoutes from './src/routes/notes.js';
import bookmarksRoutes from './src/routes/bookmarks.js';
import streakRoutes from './src/routes/streak.js';
import testsRoutes from './src/routes/tests.js';
import spacedRoutes from './src/routes/spaced.js';
import discussionRoutes from './src/routes/discussion.js';
import adminRoutes from './src/routes/admin.js';
import leaderboardRoutes from './src/routes/leaderboard.js';
import profileRoutes from './src/routes/profile.js';
import hintRoutes from './src/routes/hints.js';
import formulaRoutes from './src/routes/formulas.js';
import conceptRoutes from './src/routes/concepts.js';
import patternRoutes from './src/routes/patterns.js';
import questionRoutes from './src/routes/questions.js';
import feedbackRoutes from './src/routes/feedback.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/spaced', spacedRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/hints', hintRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/concepts', conceptRoutes);
app.use('/api', patternRoutes);
app.use('/api', questionRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'JEE Sheet API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

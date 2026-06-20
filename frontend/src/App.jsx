import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import useAuthStore from './store/authStore';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';
import { ToastContainer } from './components/Toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubjectPage from './pages/SubjectPage';
import ChapterPage from './pages/ChapterPage';

// V2 Pages
import BookmarksPage from './pages/BookmarksPage';
import MockTestSetupPage from './pages/MockTestSetupPage';
import MockTestPage from './pages/MockTestPage';
import MockTestResultPage from './pages/MockTestResultPage';
import SpacedRevisionPage from './pages/SpacedRevisionPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PublicProfilePage from './pages/PublicProfilePage';

// V2 Admin Pages
import AdminLayout from './pages/AdminLayout';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
import AdminQuestionFormPage from './pages/AdminQuestionFormPage';
import AdminChaptersPage from './pages/AdminChaptersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCSVImportPage from './pages/AdminCSVImportPage';
import AdminFormulasPage from './pages/AdminFormulasPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-app">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-xs font-semibold">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const { user } = useAuthStore();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const isTakingTest = location.pathname.startsWith('/mock-test/') && !location.pathname.includes('/result');
  const showSidebar = user && !isPublicPage && !isTakingTest;

  return (
    <div className="min-h-screen bg-bg-app flex flex-col md:flex-row font-sans antialiased text-text-primary">
      {showSidebar && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {!showSidebar && !isTakingTest && <Navbar />}
        <main className={`flex-grow ${showSidebar ? 'max-w-[1100px] w-full mx-auto px-4 md:px-8 py-6' : ''}`}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Authenticated User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sheet/:subject"
              element={
                <ProtectedRoute>
                  <SubjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sheet/:subject/:chapterId"
              element={
                <ProtectedRoute>
                  <ChapterPage />
                </ProtectedRoute>
              }
            />
            
            {/* V2 Added Routes */}
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test"
              element={
                <ProtectedRoute>
                  <MockTestSetupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test/:testId"
              element={
                <ProtectedRoute>
                  <MockTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-test/:testId/result"
              element={
                <ProtectedRoute>
                  <MockTestResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/revision"
              element={
                <ProtectedRoute>
                  <SpacedRevisionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <PublicProfilePage />
                </ProtectedRoute>
              }
            />

            {/* V2 Admin Panel Nested Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="questions" replace />} />
              <Route path="questions" element={<AdminQuestionsPage />} />
              <Route path="questions/new" element={<AdminQuestionFormPage />} />
              <Route path="questions/:id" element={<AdminQuestionFormPage />} />
              <Route path="chapters" element={<AdminChaptersPage />} />
              <Route path="formulas/:chapterId" element={<AdminFormulasPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="import" element={<AdminCSVImportPage />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AppContent />
        <CommandPalette />
        <ToastContainer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

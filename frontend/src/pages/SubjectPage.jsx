import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ChapterCard from '../components/ChapterCard';
import ProgressBar from '../components/ProgressBar';

export default function SubjectPage() {
  const { subject: subjectSlug } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active filter to pass down or use
  const [activeDifficulty, setActiveDifficulty] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const currentSubject = SUBJECTS.find((sub) => sub.slug === subjectSlug);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/subjects/${subjectSlug}/chapters`);
        setChapters(res.data.data);
      } catch (err) {
        setError('Failed to load chapters. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [subjectSlug]);

  if (!currentSubject) {
    return (
      <div className="min-h-screen pt-20 bg-navy-900 text-center text-white">
        <p className="text-lg font-bold">Subject not found.</p>
        <Link to="/dashboard" className="text-brand-red underline mt-4 inline-block">
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Loading chapters...</p>
        </div>
      </div>
    );
  }

  // Calculate subject overall progress
  const totalQuestions = chapters.reduce((acc, curr) => acc + curr.question_count, 0);
  const totalDone = chapters.reduce((acc, curr) => acc + curr.done_count, 0);

  const handleScrollToChapter = (id) => {
    const element = document.getElementById(`chapter-${id}`);
    if (element) {
      const navbarHeight = 64; // height of fixed navbar (h-16)
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight - 20, // 20px padding
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-navy-900 text-white">
      {/* Subject Header Banner */}
      <div className="border-b border-navy-800 bg-navy-950/40 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to="/dashboard" className="text-xs text-navy-400 hover:text-brand-red font-medium transition">
                Dashboard
              </Link>
              <span className="text-xs text-navy-600">/</span>
              <span className="text-xs text-white font-medium">{currentSubject.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
              <span
                className="w-2 h-6 rounded-sm inline-block"
                style={{ backgroundColor: currentSubject.color }}
              ></span>
              {currentSubject.name} Chapters
            </h1>
          </div>

          {/* Subject Overall Progress */}
          <div className="bg-navy-800 border border-navy-700 p-4 rounded-xl md:min-w-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Overall Progress</span>
              <span className="text-xs font-mono text-white font-semibold">
                {totalDone}/{totalQuestions}
              </span>
            </div>
            <ProgressBar current={totalDone} total={totalQuestions} color={currentSubject.color} height="h-2" />
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar: Chapter navigation list (Desktop only) */}
        <aside className="hidden lg:block w-64 bg-navy-800 border border-navy-700 rounded-xl p-4 sticky top-24 shrink-0 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-4 px-2">Chapters</h3>
          <div className="space-y-1">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleScrollToChapter(ch.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-navy-900 text-xs font-medium text-navy-300 hover:text-white flex items-center gap-2 group transition"
              >
                <span className="w-5 h-5 rounded-md bg-navy-950 flex items-center justify-center font-bold text-[10px] text-navy-500 group-hover:text-navy-300">
                  {ch.order_index}
                </span>
                <span className="truncate flex-1">{ch.name}</span>
                <span className="text-[10px] text-navy-500 font-mono">
                  {ch.done_count}/{ch.question_count}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Dropdown for Chapter Navigation */}
        <div className="w-full lg:hidden">
          <label className="block text-xs font-bold text-navy-400 uppercase tracking-wider mb-2">Jump to Chapter</label>
          <select
            onChange={(e) => handleScrollToChapter(e.target.value)}
            className="w-full px-4 py-3 bg-navy-800 border border-navy-700 rounded-lg text-white text-sm focus:border-brand-red focus:outline-none transition-colors"
          >
            <option value="">Select a chapter...</option>
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.order_index}. {ch.name} ({ch.done_count}/{ch.question_count})
              </option>
            ))}
          </select>
        </div>

        {/* Chapters Cards List */}
        <div className="flex-1 w-full space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {chapters.length === 0 && !error ? (
            <div className="text-center py-12 text-navy-400">
              No chapters found for this subject.
            </div>
          ) : (
            chapters.map((ch) => (
              <div key={ch.id} id={`chapter-${ch.id}`}>
                <ChapterCard chapter={ch} subjectSlug={subjectSlug} color={currentSubject.color} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

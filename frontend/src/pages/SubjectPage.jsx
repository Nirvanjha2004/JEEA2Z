import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { SUBJECTS } from '../utils/constants';
import ChapterCard from '../components/ChapterCard';
import ProgressBar from '../components/ProgressBar';
import { SkeletonCard } from '../components/SkeletonRow';
import EmptyState from '../components/EmptyState';
import { Search, Trophy, Layers } from 'lucide-react';

export default function SubjectPage() {
  const { subject: subjectSlug } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const currentSubject = SUBJECTS.find((sub) => sub.slug === subjectSlug);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/api/subjects/${subjectSlug}/chapters`);
        setChapters(res.data.data || []);
      } catch (err) {
        setError('Failed to load chapters. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [subjectSlug]);

  // Calculate subject overall progress
  const totalQuestions = useMemo(() => chapters.reduce((acc, curr) => acc + curr.question_count, 0), [chapters]);
  const totalDone = useMemo(() => chapters.reduce((acc, curr) => acc + curr.done_count, 0), [chapters]);

  // Filter chapters list based on search and status filters
  const filteredChapters = useMemo(() => {
    return chapters.filter((ch) => {
      const matchQuery = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchStatus = true;
      if (filterStatus === 'not-started') {
        matchStatus = ch.done_count === 0;
      } else if (filterStatus === 'in-progress') {
        matchStatus = ch.done_count > 0 && ch.done_count < ch.question_count;
      } else if (filterStatus === 'completed') {
        matchStatus = ch.done_count === ch.question_count && ch.question_count > 0;
      }
      return matchQuery && matchStatus;
    });
  }, [chapters, searchQuery, filterStatus]);

  if (!currentSubject) {
    return (
      <div className="min-h-screen py-16 text-center select-none text-text-primary">
        <p className="text-[15px] font-semibold text-danger">Subject not found.</p>
        <Link to="/dashboard" className="text-accent underline mt-4 inline-block text-[13px]">
          Go back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-text-primary select-none animate-slide-in">
      {/* Subject Header Banner */}
      <div className="border-b border-border-default/60 pb-6 mb-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
          <Link to="/dashboard" className="hover:text-text-primary transition-colors">
            JEE Sheet
          </Link>
          <span>›</span>
          <span className="text-text-secondary">{currentSubject.name}</span>
        </div>

        {/* Title and Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[20px] md:text-[22px] font-semibold flex items-center gap-2.5">
              <span
                className="w-2.5 h-5 rounded-[3px] inline-block"
                style={{ backgroundColor: currentSubject.color }}
              ></span>
              {currentSubject.name} Chapters
            </h1>
            <p className="text-[12px] text-text-muted mt-1">
              {chapters.length} chapters · {totalQuestions} questions total
            </p>
          </div>
          
          <Link
            to={`/mock-test?scope=subject&scopeId=${currentSubject.id || ''}`}
            className="flex items-center justify-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-default hover:bg-bg-subtle hover:border-border-focus rounded-md text-[12.5px] font-medium transition cursor-pointer self-start"
          >
            <Trophy className="w-3.5 h-3.5" />
            Start Subject Test
          </Link>
        </div>

        {/* Overall Progress Section */}
        <div className="mt-5 max-w-md bg-bg-surface border border-border-default p-4 rounded-lg">
          <div className="flex items-center justify-between text-[11.5px] font-medium text-text-secondary mb-1.5">
            <span>Overall Progress</span>
            <span>{totalDone} / {totalQuestions} completed</span>
          </div>
          <ProgressBar current={totalDone} total={totalQuestions} color={currentSubject.color} height="h-1" />
        </div>
      </div>

      {/* Sticky Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border-default rounded-lg bg-bg-surface mb-6 text-[12px]">
        {/* Search */}
        <div className="relative w-full max-w-xs shrink-0">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md pl-9 pr-3 py-2 text-[12px] placeholder-text-muted h-8"
          />
        </div>

        {/* Status pills filter */}
        <div className="flex items-center gap-1 border border-border-default rounded-[4px] p-0.5 bg-bg-subtle/50">
          {['all', 'not-started', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-0.5 font-medium rounded-[3px] capitalize cursor-pointer transition ${
                filterStatus === status
                  ? 'bg-bg-elevated text-text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {status.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 border border-danger/20 bg-danger-bg text-danger text-[12.5px] rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Chapters Cards List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredChapters.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No Chapters Found"
            description={
              chapters.length === 0
                ? 'No chapters are configured for this subject yet.'
                : 'No chapters matched your search query or filters.'
            }
          />
        ) : (
          filteredChapters.map((ch) => (
            <ChapterCard key={ch.id} chapter={ch} subjectSlug={subjectSlug} color={currentSubject.color} />
          ))
        )}
      </div>
    </div>
  );
}

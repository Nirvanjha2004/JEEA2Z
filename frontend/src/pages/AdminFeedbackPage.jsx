import React, { useEffect, useState } from 'react';
import api from '../api';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Star, MessageSquare, AlertCircle, Calendar, User, Mail, Tag } from 'lucide-react';

export default function AdminFeedbackPage() {
  const toast = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/admin/feedback', {
        params: {
          page,
          limit: 20,
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      setFeedbacks(res.data.data.feedback);
      setTotal(res.data.data.total);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch feedback submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchFeedback();
  }, [category, rating]);

  useEffect(() => {
    fetchFeedback();
  }, [page]);

  const totalPages = Math.ceil(total / 20) || 1;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryEmojiAndLabel = (cat) => {
    switch (cat) {
      case 'bug':
        return { emoji: '🐛', label: 'Bug Report', style: 'bg-danger/10 border-danger/25 text-danger' };
      case 'feature':
        return { emoji: '✨', label: 'Feature Request', style: 'bg-accent/10 border-accent/25 text-accent' };
      case 'questions':
        return { emoji: '📚', label: 'Question Bank', style: 'bg-amber-500/10 border-amber-500/25 text-amber-500' };
      default:
        return { emoji: '💬', label: 'General', style: 'bg-text-secondary/10 border-border-default text-text-secondary' };
    }
  };

  return (
    <div className="space-y-6 text-text-primary select-none animate-slide-in">
      {/* Header */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-[17px] font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" /> User Feedback Submissions
        </h1>
        <p className="text-[12px] text-text-secondary mt-1">
          Review, filter, and analyze experience reports and suggestions from students. Total Logs: {total}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-bg-surface border border-border-default p-4 rounded-xl shadow-xs">
        <div className="flex-1">
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Filter by Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2.5 py-1.5 text-xs text-text-primary h-[34px] transition cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="general">💬 General Suggestion</option>
            <option value="bug">🐛 Bug Report</option>
            <option value="feature">✨ Feature Request</option>
            <option value="questions">📚 Question Bank Feedback</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
            Filter by Experience Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-2.5 py-1.5 text-xs text-text-primary h-[34px] transition cursor-pointer"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>
      </div>

      {/* List content */}
      {loading ? (
        <div className="flex justify-center py-16 bg-bg-surface rounded-lg border border-border-default/60">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-bg-surface border border-border-default/60 p-12 text-center text-text-muted text-xs rounded-lg">
          No feedback entries match the filter requirements.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {feedbacks.map((f) => {
              const catDetails = getCategoryEmojiAndLabel(f.category);
              return (
                <div
                  key={f.id}
                  className="bg-bg-surface border border-border-default hover:border-border-focus rounded-xl p-5 transition-all duration-150 shadow-xs flex flex-col gap-4"
                >
                  {/* Top Bar inside card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-default/30">
                    {/* User Metadata */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/25 flex items-center justify-center text-accent text-xs font-semibold shrink-0">
                        {f.user_name ? f.user_name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                          {f.user_name || 'Anonymous User'}
                          {f.user_email && (
                            <span className="text-[10px] text-text-muted font-normal font-mono">
                              ({f.user_email})
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(f.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Category details */}
                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catDetails.style}`}
                      >
                        <span>{catDetails.emoji}</span>
                        <span>{catDetails.label}</span>
                      </span>

                      {/* Stars indicator */}
                      {f.rating && (
                        <div className="flex items-center gap-0.5 bg-bg-app border border-border-default/60 px-2 py-0.5 rounded-md">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= f.rating ? 'fill-amber-400 text-amber-400' : 'text-text-muted/40'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap font-sans bg-bg-app/40 p-3 rounded-lg border border-border-default/20">
                    {f.message}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border border-border-default bg-bg-surface rounded-xl flex items-center justify-between text-xs text-text-muted shadow-xs">
            <span>
              Showing Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="secondary"
                size="compact"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

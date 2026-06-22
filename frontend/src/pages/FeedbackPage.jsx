import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Star, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';

export default function FeedbackPage() {
  const toast = useToast();
  
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError('Feedback description must be at least 10 characters.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await api.post('/api/feedback', {
        category,
        message,
        rating
      });
      setSuccess(true);
      toast.success('Feedback submitted! Thank you for helping us improve.');
      setMessage('');
      setCategory('general');
      setRating(5);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Feedback</span>
      </div>

      {/* Header */}
      <div className="border-b border-border-default/60 pb-5">
        <h1 className="text-[20px] md:text-[22px] font-semibold text-text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" /> Share Feedback
        </h1>
        <p className="text-[12px] text-text-secondary mt-1">
          Help us make JEE Sheet better for everyone. Report bugs, suggest features, or rate your experience!
        </p>
      </div>

      {success ? (
        <div className="bg-bg-surface border border-border-default p-6 rounded-lg text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-success/15 border border-success/20 flex items-center justify-center mx-auto text-success">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary">Thank you for your feedback!</h3>
            <p className="text-xs text-text-secondary">
              Your suggestion has been logged. We read every submission and appreciate your support.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="compact"
              onClick={() => setSuccess(false)}
              className="px-4 py-1.5 text-xs"
            >
              Submit More Feedback
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-bg-surface border border-border-default rounded-lg p-5 space-y-5 shadow-xs">
          {error && (
            <div className="p-3 bg-danger-bg border border-danger/25 text-danger text-[12.5px] rounded-md flex items-start gap-2 animate-slide-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              Feedback Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-1.5 text-xs text-text-primary h-[34px] transition cursor-pointer"
            >
              <option value="general">💬 General Suggestion</option>
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">✨ Feature Request</option>
              <option value="questions">📚 Question Bank Feedback</option>
            </select>
          </div>

          {/* Rating (Stars Selection) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              How would you rate your experience?
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const isHighlighted = hoverRating ? starValue <= hoverRating : starValue <= rating;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-md hover:bg-bg-subtle/50 transition cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        isHighlighted
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-text-muted hover:text-text-secondary'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs text-text-secondary font-medium ml-2 select-none">
                {rating === 5 && 'Excellent! 😍'}
                {rating === 4 && 'Good! 🙂'}
                {rating === 3 && 'Average. 😐'}
                {rating === 2 && 'Poor. 🙁'}
                {rating === 1 && 'Terrible. 😡'}
              </span>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Feedback Description
              </label>
              <span className={`text-[10px] font-mono ${message.length < 10 ? 'text-text-muted' : 'text-text-secondary'}`}>
                {message.length} / 1000
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind... Minimum 10 characters."
              maxLength={1000}
              className="w-full bg-bg-app border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md px-3 py-2 text-xs text-text-primary min-h-[120px] resize-y transition placeholder-text-muted"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || message.trim().length < 10}
              className="w-full text-xs py-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {submitting ? 'Submitting Feedback...' : 'Send Feedback'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

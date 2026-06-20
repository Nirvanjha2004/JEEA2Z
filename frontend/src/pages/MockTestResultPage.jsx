import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api';
import { Trophy, ArrowLeft, RotateCcw, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function MockTestResultPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/tests/${testId}/result`);
        setResult(res.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load test results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary text-sm font-medium">Evaluating answers...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-md mx-auto text-center py-12 text-text-primary animate-slide-in">
        <div className="p-4 bg-danger-bg border border-danger/20 text-danger text-xs rounded-md mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error || 'Test results not found.'}</span>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-text-primary text-bg-app hover:opacity-90 text-xs font-semibold rounded-md transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const questions = result.questions || [];
  const correct = questions.filter((q) => q.is_correct === true).length;
  const wrong = questions.filter((q) => q.is_correct === false).length;
  const skipped = questions.filter((q) => q.user_answer === null || q.user_answer === undefined || q.user_answer === '').length;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  // Colors mapping from Tailwind design system
  const colors = {
    correct: '#22c55e', // success
    wrong: '#ef4444', // danger
    skipped: '#71717a' // secondary / muted
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Correct', value: correct, color: colors.correct },
    { name: 'Wrong', value: wrong, color: colors.wrong },
    { name: 'Skipped', value: skipped, color: colors.skipped },
  ].filter((item) => item.value > 0);

  const handleRetake = async () => {
    try {
      const res = await api.post('/api/tests/create', {
        title: result.title,
        scope: result.scope,
        scopeId: result.scope_id,
        durationMin: result.duration_min,
        questionCount: result.total_q,
      });
      if (res.data.success) {
        navigate(`/mock-test/${res.data.data.testId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to retake test.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-text-primary select-none animate-slide-in">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-muted font-medium mb-3">
        <Link to="/dashboard" className="hover:text-text-primary transition-colors">
          JEE Sheet
        </Link>
        <span>›</span>
        <span className="text-text-secondary">Mock Tests</span>
        <span>›</span>
        <span className="text-text-secondary">Results</span>
      </div>

      {/* Header */}
      <div className="border-b border-border-default/60 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[20px] md:text-[22px] font-semibold tracking-tight text-text-primary">
            {result.title} — Results
          </h1>
          <p className="text-[12px] text-text-muted mt-1">
            Submitted on {new Date(result.completed_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleRetake}
            className="px-3.5 py-1.5 bg-text-primary text-bg-app hover:opacity-90 text-xs font-semibold rounded-md transition shadow-xs flex items-center gap-1.5 cursor-pointer border border-border-default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Test
          </button>
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 bg-bg-surface border border-border-default hover:bg-bg-subtle text-text-primary text-xs font-semibold rounded-md transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go to Sheet
          </Link>
        </div>
      </div>

      {/* Main Score Layout: Cards Grid + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Stats Grid */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Score */}
            <div className="bg-bg-surface border border-border-default rounded-lg p-5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Score Obtained
              </span>
              <span className="text-[28px] font-semibold text-accent block leading-none">
                {result.score} <span className="text-text-muted text-xs font-normal">/ {result.max_score}</span>
              </span>
              <span className="text-[10px] text-text-muted mt-1 block font-mono">
                +4 for correct, -1 for wrong
              </span>
            </div>

            {/* Card 2: Accuracy */}
            <div className="bg-bg-surface border border-border-default rounded-lg p-5">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1">
                Accuracy
              </span>
              <span className="text-[28px] font-semibold text-text-primary block leading-none">
                {accuracy}%
              </span>
              <span className="text-[10px] text-text-muted mt-1 block">
                across solved questions
              </span>
            </div>
          </div>

          {/* Response summary breakdown card */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col gap-3">
            <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              Response Summary
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-success/5 border border-success/15 py-3 rounded-md">
                <span className="block text-lg font-semibold text-success font-mono leading-none mb-1">
                  {correct}
                </span>
                <span className="text-[9px] font-semibold text-success uppercase tracking-wider">
                  Correct
                </span>
              </div>

              <div className="bg-danger/5 border border-danger/15 py-3 rounded-md">
                <span className="block text-lg font-semibold text-danger font-mono leading-none mb-1">
                  {wrong}
                </span>
                <span className="text-[9px] font-semibold text-danger uppercase tracking-wider">
                  Wrong
                </span>
              </div>

              <div className="bg-bg-subtle border border-border-default py-3 rounded-md">
                <span className="block text-lg font-semibold text-text-secondary font-mono leading-none mb-1">
                  {skipped}
                </span>
                <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">
                  Skipped
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Donut Chart */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-default rounded-lg p-5 flex flex-col items-center justify-center min-h-[220px]">
          <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 self-start">
            Score Distribution
          </h4>
          
          <div className="w-full h-36 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={54}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: '500',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute flex flex-col items-center select-none pointer-events-none">
                  <span className="text-xl font-semibold text-text-primary leading-none">
                    {accuracy}%
                  </span>
                  <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
                    Accuracy
                  </span>
                </div>
              </>
            ) : (
              <p className="text-text-muted text-xs">No chart data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Question Table Review */}
      <div className="bg-bg-surface border border-border-default rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border-default bg-bg-subtle/20">
          <h3 className="text-[11.5px] font-semibold text-text-primary uppercase tracking-wider">
            Detailed Question Review
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-bg-subtle/30 border-b border-border-default text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                <th className="px-4 py-3 w-12 text-center">#</th>
                <th className="px-4 py-3">Question Title</th>
                <th className="px-4 py-3 text-center w-28">Your Answer</th>
                <th className="px-4 py-3 text-center w-28">Correct Answer</th>
                <th className="px-4 py-3 text-center w-24">Verdict</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-border-default/40 text-xs">
              {questions.map((q, idx) => {
                let rowBg = 'hover:bg-bg-subtle/30';
                let verdictText = 'Skipped';
                let verdictColor = 'text-text-secondary';
                let VerdictIcon = AlertCircle;

                if (q.is_correct === true) {
                  rowBg = 'bg-success/5 hover:bg-success/10';
                  verdictText = 'Correct';
                  verdictColor = 'text-success font-semibold';
                  VerdictIcon = CheckCircle2;
                } else if (q.is_correct === false) {
                  rowBg = 'bg-danger/5 hover:bg-danger/10';
                  verdictText = 'Incorrect';
                  verdictColor = 'text-danger font-semibold';
                  VerdictIcon = XCircle;
                }

                return (
                  <tr key={q.id} className={`${rowBg} transition-colors`}>
                    <td className="px-4 py-3.5 text-center font-mono text-[11px] text-text-muted">
                      {idx + 1}
                    </td>
                    
                    <td className="px-4 py-3.5 min-w-[200px]">
                      <div className="text-[12.5px] font-medium text-text-primary break-words mb-1">
                        {q.title}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium">
                        <span>{q.subject_name}</span>
                        <span>·</span>
                        <span>{q.chapter_name}</span>
                        {q.source && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-[9px]">{q.source}</span>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-text-primary">
                      {q.user_answer !== null && q.user_answer !== undefined && q.user_answer !== '' ? q.user_answer : '-'}
                    </td>
                    
                    <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-success">
                      {q.correct_answer || '-'}
                    </td>
                    
                    <td className="px-4 py-3.5 text-center align-middle">
                      <div className={`inline-flex items-center gap-1 text-[11px] ${verdictColor}`}>
                        <VerdictIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{verdictText}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../api';

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
      <div className="min-h-screen pt-24 bg-navy-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-navy-400 text-sm">Evaluating answers...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen pt-24 bg-navy-900 text-white px-4 max-w-md mx-auto text-center">
        <div className="p-4 bg-red-950/30 border border-red-500/50 text-red-400 text-sm rounded-xl mb-6">
          {error || 'Test results not found.'}
        </div>
        <Link to="/dashboard" className="px-6 py-2 bg-brand-red text-xs font-bold rounded-lg text-white">
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

  // Recharts Chart Data
  const chartData = [
    { name: 'Correct', value: correct, color: '#22c55e' },
    { name: 'Wrong', value: wrong, color: '#ef4444' },
    { name: 'Skipped', value: skipped, color: '#64748b' },
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
      alert('Failed to retake test.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-12 bg-navy-900 text-white px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold">{result.title} — Results</h1>
        <p className="text-xs text-navy-400 mt-1">Submitted on {new Date(result.completed_at).toLocaleString()}</p>
      </div>

      {/* Main Score Layout: Cards Grid + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Stats Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="bg-navy-850 border border-navy-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1">Score Obtained</span>
            <span className="text-3xl font-black text-brand-red">
              {result.score} <span className="text-navy-500 text-sm font-semibold">/ {result.max_score}</span>
            </span>
          </div>

          <div className="bg-navy-850 border border-navy-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider block mb-1">Accuracy</span>
            <span className="text-3xl font-black text-white">{accuracy}%</span>
          </div>

          <div className="bg-navy-850 border border-navy-800 p-5 rounded-2xl col-span-2">
            <h4 className="text-[10px] font-bold text-navy-500 uppercase tracking-wider mb-3">Response Summary</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-500/10 border border-green-500/20 py-2.5 rounded-xl">
                <span className="block text-xs font-mono font-bold text-green-400">{correct}</span>
                <span className="text-[9px] font-bold text-green-500 uppercase">Correct</span>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl">
                <span className="block text-xs font-mono font-bold text-brand-red">{wrong}</span>
                <span className="text-[9px] font-bold text-red-400 uppercase">Wrong</span>
              </div>
              <div className="bg-slate-700/10 border border-slate-700/20 py-2.5 rounded-xl">
                <span className="block text-xs font-mono font-bold text-slate-400">{skipped}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Skipped</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Donut Chart */}
        <div className="lg:col-span-5 bg-navy-850 border border-navy-800 p-5 rounded-2xl flex flex-col items-center justify-center">
          <h4 className="text-[10px] font-bold text-navy-400 uppercase tracking-wider mb-2 mr-auto">Score Distribution</h4>
          <div className="w-full h-44 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-navy-500 text-xs">No chart data available</p>
            )}
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-white">{accuracy}%</span>
              <span className="text-[9px] text-navy-400 font-bold uppercase tracking-widest">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Retake / Back to Sheet */}
      <div className="flex gap-3">
        <button
          onClick={handleRetake}
          className="px-6 py-3 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Retake Test
        </button>
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-navy-850 border border-navy-800 hover:border-navy-600 text-white text-xs font-bold rounded-xl transition"
        >
          Go to Sheet
        </Link>
      </div>

      {/* Question Table Review */}
      <div className="bg-navy-850 border border-navy-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-navy-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Question Review</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-navy-900 border-b border-navy-800 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                <th className="px-5 py-3.5 w-12 text-center">#</th>
                <th className="px-5 py-3.5">Question Title</th>
                <th className="px-5 py-3.5 text-center w-28">Your Answer</th>
                <th className="px-5 py-3.5 text-center w-28">Correct Answer</th>
                <th className="px-5 py-3.5 text-center w-24">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/40 text-sm">
              {questions.map((q, idx) => {
                let rowBg = 'hover:bg-navy-800/40';
                let verdictText = '—';
                let verdictColor = 'text-slate-400';

                if (q.is_correct === true) {
                  rowBg = 'bg-green-950/10 hover:bg-green-950/20';
                  verdictText = '✓ Correct';
                  verdictColor = 'text-green-400 font-bold';
                } else if (q.is_correct === false) {
                  rowBg = 'bg-red-950/10 hover:bg-red-950/20';
                  verdictText = '✗ Wrong';
                  verdictColor = 'text-brand-red font-bold';
                } else {
                  rowBg = 'bg-slate-700/5 hover:bg-slate-700/10';
                  verdictText = 'Skipped';
                  verdictColor = 'text-slate-400';
                }

                return (
                  <tr key={q.id} className={`${rowBg} transition-colors`}>
                    <td className="px-5 py-4 text-center font-mono text-xs text-navy-500">{idx + 1}</td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-semibold text-white break-words mb-1">{q.title}</div>
                      <div className="flex gap-2">
                        <span className="text-[9px] font-bold text-navy-400">{q.subject_name}</span>
                        <span className="text-[9px] text-navy-500">•</span>
                        <span className="text-[9px] font-bold text-navy-400">{q.chapter_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-xs font-extrabold">
                      {q.user_answer !== null ? q.user_answer : '-'}
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-xs font-extrabold text-green-400">
                      {q.correct_answer || '-'}
                    </td>
                    <td className={`px-5 py-4 text-center text-xs ${verdictColor}`}>{verdictText}</td>
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

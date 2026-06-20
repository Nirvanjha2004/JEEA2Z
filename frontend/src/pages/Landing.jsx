import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Landing() {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 flex flex-col items-center justify-center bg-navy-900 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl text-center flex flex-col items-center py-16 md:py-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-navy-700 bg-navy-800 text-xs font-semibold text-brand-red mb-6 animate-pulse">
          🎯 The Ultimate JEE Problem Tracker
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
          The Striver A2Z Sheet <br />
          <span className="text-brand-red">— for JEE</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-navy-400 max-w-2xl">
          A topic-wise structured problem tracker for Physics, Chemistry, and Math to help you ace JEE Main and Advanced.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-brand-red text-white text-base font-bold rounded-lg shadow-lg hover:bg-brand-red-hover hover:scale-[1.02] transition-all text-center"
          >
            Start for Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 border border-navy-600 text-navy-200 hover:text-white hover:border-navy-400 text-base font-semibold rounded-lg hover:bg-navy-800/40 transition-all text-center"
          >
            See the Sheet
          </Link>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="w-full max-w-5xl border-t border-navy-800 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-navy-800/40 border border-navy-800/80 hover:border-navy-700 p-6 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center text-brand-red text-xl mb-4 font-bold">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white mb-2">200+ Curated Problems</h3>
            <p className="text-sm text-navy-400 leading-relaxed">
              Carefully chosen questions covering every concept from simple applications to JEE Advanced level.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-navy-800/40 border border-navy-800/80 hover:border-navy-700 p-6 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 text-xl mb-4 font-bold">
              📈
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Track Your Progress</h3>
            <p className="text-sm text-navy-400 leading-relaxed">
              Mark questions as Todo, Revisit, or Completed. Get comprehensive dashboards with completion metrics.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-navy-800/40 border border-navy-800/80 hover:border-navy-700 p-6 rounded-xl transition duration-200">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl mb-4 font-bold">
              📚
            </div>
            <h3 className="text-lg font-bold text-white mb-2">PYQs & Concepts</h3>
            <p className="text-sm text-navy-400 leading-relaxed">
              Filter questions by Type (PYQ, Core Concept, Practice) and Difficulty (Easy, Medium, Hard).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

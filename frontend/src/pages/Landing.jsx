import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Sparkles, Atom, FlaskConical, Trophy, ShieldAlert, Cpu, Calendar } from 'lucide-react';

export default function Landing() {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: 'Topic-wise structure',
      description: 'Every chapter mapped from A to Z, categorizing questions by difficulty and format.',
      icon: Atom,
    },
    {
      title: 'AI-powered hints',
      description: 'Get unstuck without seeing the final answer. Stream progressive hints powered by Groq.',
      icon: Cpu,
    },
    {
      title: 'Mock tests',
      description: 'Test your speed and accuracy in JEE-pattern mock tests with standard +4/-1 scoring schemes.',
      icon: Trophy,
    },
    {
      title: 'Formula sheets',
      description: 'Every formula beautifully rendered in KaTeX. Search formulas and copy LaTeX instantly.',
      icon: FlaskConical,
    },
    {
      title: 'Spaced repetition',
      description: 'Keep your revision automated. Schedule reviews timezone-safely based on the SM-2 algorithm.',
      icon: Calendar,
    },
    {
      title: 'Track your streak',
      description: 'Set custom daily goals and maintain consistent streaks with git-like solve calendars.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="w-full bg-bg-app text-text-primary select-none flex flex-col items-center">
      {/* Top Navbar */}
      <header className="w-full max-w-5xl h-14 border-b border-border-default/60 flex items-center justify-between px-4 sticky top-0 bg-bg-app/80 backdrop-blur-md z-30">
        <Link to="/" className="text-[14px] font-semibold text-text-primary flex items-center gap-1.5">
          <span className="w-2.5 h-5 bg-accent rounded-[3px]"></span>
          JEE Sheet
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-[12px] font-medium text-text-secondary hover:text-text-primary transition"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-3 py-1.5 bg-white text-black font-semibold text-[11.5px] rounded-md hover:bg-neutral-200 transition cursor-pointer"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Main Hero Stack */}
      <section className="max-w-3xl text-center flex flex-col items-center pt-20 pb-16 px-4">
        {/* Built for JEE Tag Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border-muted bg-bg-surface text-[11px] font-medium text-text-secondary mb-6 tracking-wide shadow-sm">
          <span className="text-accent text-[12px]">✦</span> Built for JEE Main & Advanced aspirants
        </div>

        {/* Big Heading */}
        <h1 className="text-[34px] sm:text-[44px] md:text-[50px] font-semibold leading-[1.1] tracking-tight text-text-primary mb-6 max-w-2xl">
          The structured study sheet <br className="hidden sm:inline" />
          for serious{' '}
          <span className="bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent">
            JEE aspirants.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-[14px] md:text-[15px] text-text-secondary max-w-[480px] leading-relaxed mb-8">
          2000+ curated questions, progress tracking, AI hints, formula sheets and mock tests — all in one place.
        </p>

        {/* CTA Row */}
        <div className="flex items-center gap-3.5 mb-8">
          <Link
            to="/register"
            className="px-5 py-2.5 bg-white text-black font-semibold text-[13px] rounded-md hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-bg-surface border border-border-default hover:border-border-focus text-text-primary text-[13px] font-semibold rounded-md transition-all cursor-pointer"
          >
            View the sheet
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="flex -space-x-2.5">
            {['bg-accent', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'].map((bg, idx) => (
              <div
                key={idx}
                className={`w-6.5 h-6.5 rounded-full border-2 border-bg-app ${bg} flex items-center justify-center text-[8.5px] font-bold text-white shadow-md`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
            ))}
          </div>
          <span className="text-[11.5px] text-text-secondary font-medium">
            Join 12,000+ JEE aspirants
          </span>
        </div>

        {/* Premium Dashboard HTML Mockup Preview */}
        <div className="w-full max-w-[900px] mt-16 rounded-xl border border-border-default bg-bg-surface overflow-hidden shadow-2xl relative select-none">
          {/* Mock Window Top Bar */}
          <div className="h-10 border-b border-border-default/60 bg-bg-surface/50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border-focus block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-border-focus block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-border-focus block"></span>
            </div>
            <div className="text-[10px] text-text-muted font-mono tracking-widest bg-bg-subtle/50 px-3 py-0.5 rounded border border-border-default/30">
              jeesheet.com/dashboard
            </div>
            <div className="w-12"></div>
          </div>

          {/* Mock Content Layout */}
          <div className="p-4 md:p-6 text-left flex flex-col md:flex-row gap-4 h-[240px] md:h-[280px] overflow-hidden relative">
            {/* Sidebar Mock */}
            <div className="hidden md:flex flex-col gap-3.5 w-32 border-r border-border-default/50 pr-4">
              <div className="w-16 h-3 bg-bg-subtle rounded-md"></div>
              <div className="w-20 h-4 bg-accent/15 rounded border border-accent/20"></div>
              <div className="w-12 h-3 bg-bg-subtle rounded-md"></div>
              <div className="w-18 h-3 bg-bg-subtle rounded-md"></div>
            </div>

            {/* Dashboard Cards Mock */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 border border-border-default rounded-md bg-bg-subtle/20 flex flex-col gap-1.5">
                  <div className="w-12 h-2.5 bg-text-muted/40 rounded-sm"></div>
                  <div className="w-8 h-5 bg-text-primary/70 rounded-md"></div>
                </div>
                <div className="p-3 border border-border-default rounded-md bg-bg-subtle/20 flex flex-col gap-1.5">
                  <div className="w-12 h-2.5 bg-text-muted/40 rounded-sm"></div>
                  <div className="w-6 h-5 bg-text-primary/70 rounded-md"></div>
                </div>
                <div className="p-3 border border-border-default rounded-md bg-bg-subtle/20 flex flex-col gap-1.5">
                  <div className="w-12 h-2.5 bg-text-muted/40 rounded-sm"></div>
                  <div className="w-10 h-5 bg-accent/60 rounded-md"></div>
                </div>
              </div>
              <div className="h-28 border border-border-default rounded-md bg-bg-subtle/10 p-3.5 flex flex-col gap-2">
                <div className="w-32 h-3 bg-text-primary/60 rounded-md"></div>
                <div className="w-full h-1 bg-border-default rounded-full"></div>
                <div className="w-48 h-2 bg-text-muted/40 rounded-md"></div>
              </div>
            </div>

            {/* Fade Out Overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="w-full max-w-5xl px-4 py-16 border-t border-border-default/60">
        <h2 className="text-[17px] font-semibold text-center mb-10 text-text-primary tracking-wide">
          Everything you need to master JEE concepts.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-bg-surface border border-border-default hover:border-border-focus rounded-lg p-5 transition duration-200 flex flex-col items-start gap-4.5"
              >
                <div className="p-2.5 rounded-lg bg-accent-subtle border border-accent/20 text-accent">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-text-primary mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-[12.5px] text-text-secondary leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

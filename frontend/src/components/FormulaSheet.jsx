import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api';
import FormulaCard from './FormulaCard';
import { SkeletonCard } from './SkeletonRow';
import EmptyState from './EmptyState';
import { useToast } from './Toast';
import { Search, Download, Calculator } from 'lucide-react';

const FormulaSheet = ({ chapterId, chapterName }) => {
  const [formulas, setFormulas] = useState([]);
  const [intro, setIntro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchFormulaSheet = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/formulas/chapter/${chapterId}`);
        setFormulas(res.data.formulas || []);
        setIntro(res.data.intro);
      } catch (err) {
        console.error('Failed to load formula sheet:', err);
        toast.error('Failed to load formula sheet.');
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchFormulaSheet();
    }
  }, [chapterId]);

  const handleExportPDF = () => {
    toast.info('Export PDF feature is coming soon!');
  };

  const filteredFormulas = formulas.filter((f) => {
    const titleMatch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (f.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });

  return (
    <div className="select-none text-text-primary">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border-default/60 pb-5">
        <div>
          <h2 className="text-[17px] font-semibold flex items-center gap-2">
            <span>📐</span> Formula Sheet — {chapterName}
          </h2>
          <p className="text-[11.5px] text-text-muted mt-1">
            Quick reference guide, equations, and variable details.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-default hover:bg-bg-subtle hover:border-border-focus rounded-md text-[12px] font-medium transition cursor-pointer self-start"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* Chapter introduction markdown */}
          {intro && (
            <div className="prose prose-sm max-w-none text-text-secondary text-[12.5px] leading-relaxed bg-bg-surface border border-border-default/80 rounded-lg p-4 mb-6">
              <ReactMarkdown>{intro}</ReactMarkdown>
            </div>
          )}

          {/* Search bar */}
          <div className="relative w-full max-w-sm mb-6">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search formulas by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-surface border border-border-default hover:border-border-focus focus:border-accent outline-none rounded-md pl-9 pr-3 py-2 text-[12px] placeholder-text-muted h-9"
            />
          </div>

          {filteredFormulas.length === 0 ? (
            <EmptyState
              icon={Calculator}
              title={formulas.length === 0 ? 'No Formulas Seeded' : 'No matches found'}
              description={
                formulas.length === 0
                  ? 'No formulas have been added yet for this chapter.'
                  : 'No formulas matched your search terms.'
              }
              action={
                user?.is_admin && (
                  <button
                    onClick={() => (window.location.href = `/admin/formulas/${chapterId}`)}
                    className="px-3.5 py-2 bg-white text-black rounded-md font-medium text-[12.5px] hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Add Formula
                  </button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFormulas.map((formula) => (
                <FormulaCard key={formula.id} formula={formula} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormulaSheet;

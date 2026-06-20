import React, { useState } from 'react';
import katex from 'katex';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

const FormulaCard = ({ formula }) => {
  const { title, latex, description, variables = {}, tags = [] } = formula;
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const renderedLatex = (() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-danger font-mono text-[11px]">${latex}</span>`;
    }
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    toast.success('LaTeX copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const parsedVars = typeof variables === 'string' ? JSON.parse(variables) : variables;
  const varKeys = Object.keys(parsedVars || {});

  return (
    <div className="bg-bg-surface border border-border-default rounded-lg p-5 hover:border-border-focus transition-all duration-200 select-none relative group flex flex-col justify-between min-h-[190px]">
      
      {/* Top Title & Copy Action */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-[13px] font-semibold text-text-primary leading-tight">
          {title}
        </h4>
        <button
          onClick={handleCopy}
          className="text-text-muted hover:text-text-primary p-1 bg-bg-elevated border border-border-default hover:border-border-focus rounded cursor-pointer transition-colors"
          title="Copy LaTeX formula"
        >
          {copied ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Rendered Equation */}
      <div className="py-4 my-2 overflow-x-auto select-all scrollbar-none flex items-center justify-center bg-bg-subtle/30 rounded-md border border-border-default/40 min-h-[60px]">
        <div
          className="text-[16px] md:text-[18px] text-text-primary px-3"
          dangerouslySetInnerHTML={{ __html: renderedLatex }}
        />
      </div>

      {/* Bottom Description & Vars */}
      <div className="mt-2 text-left">
        {description && (
          <p className="text-[11.5px] text-text-secondary leading-relaxed mb-3">
            {description}
          </p>
        )}

        {/* Variables details */}
        {varKeys.length > 0 && (
          <div className="mb-3.5 border-t border-border-default/50 pt-2.5">
            <h5 className="text-[9.5px] font-semibold uppercase text-text-muted mb-1.5 tracking-wider">
              Variables
            </h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px]">
              {varKeys.map((key) => (
                <div key={key} className="flex gap-1.5 truncate">
                  <span className="text-accent font-medium">{key}</span>
                  <span className="text-text-muted shrink-0">:</span>
                  <span className="text-text-secondary truncate" title={parsedVars[key]}>
                    {parsedVars[key]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              let tagStyle = 'bg-bg-subtle text-text-secondary border-border-default';
              const cleanTag = tag.trim().toLowerCase();

              if (cleanTag === 'important') {
                tagStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              } else if (cleanTag === 'frequently asked') {
                tagStyle = 'bg-danger-bg text-danger border-danger/20';
              } else if (cleanTag === 'derivation') {
                tagStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
              } else if (cleanTag === 'memorize') {
                tagStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
              }

              return (
                <span
                  key={tag}
                  className={`text-[9.5px] px-2 py-0.5 rounded-full border font-medium ${tagStyle}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaCard;

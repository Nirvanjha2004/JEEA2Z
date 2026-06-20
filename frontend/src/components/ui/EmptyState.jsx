import React from 'react';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-border-default rounded-lg bg-bg-surface/30 my-6 animate-slide-in">
      {Icon && (
        <div className="text-text-muted mb-4">
          <Icon className="w-10 h-10 stroke-[1.5]" />
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] text-text-secondary max-w-[320px] leading-relaxed mb-5">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

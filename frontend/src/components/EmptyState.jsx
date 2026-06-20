import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-default rounded-xl bg-bg-surface/30 my-6">
      {Icon && (
        <div className="p-3.5 bg-bg-elevated border border-border-default rounded-lg text-text-muted mb-4">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-[15px] font-medium text-text-primary mb-1">{title}</h3>
      <p className="text-[13px] text-text-secondary max-w-[280px] leading-relaxed mb-5">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;

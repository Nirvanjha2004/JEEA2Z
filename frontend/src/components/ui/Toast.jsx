import React from 'react';
import { useToastStore } from '../../store/toastStore';
import { X, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const ToastItem = ({ toast, onRemove }) => {
  const { id, message, type } = toast;

  const configs = {
    success: {
      border: 'border-l-[3px] border-l-success',
      icon: <CheckCircle2 className="w-4 h-4 text-success" />,
    },
    error: {
      border: 'border-l-[3px] border-l-danger',
      icon: <AlertOctagon className="w-4 h-4 text-danger" />,
    },
    warning: {
      border: 'border-l-[3px] border-l-warning',
      icon: <AlertTriangle className="w-4 h-4 text-warning" />,
    },
    info: {
      border: 'border-l-[3px] border-l-info',
      icon: <Info className="w-4 h-4 text-info" />,
    },
  };

  const config = configs[type] || configs.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-[360px] bg-bg-elevated border border-border-default ${config.border} rounded-md p-3.5 shadow-lg text-[13px] text-text-primary transition-all duration-300 animate-slide-in`}
    >
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <span className="flex-1 leading-normal pr-3">{message}</span>
      <button
        onClick={() => onRemove(id)}
        className="text-text-muted hover:text-text-primary cursor-pointer transition-colors p-0.5 leading-none shrink-0"
        title="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none select-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;

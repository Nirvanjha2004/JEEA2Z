import React from 'react';
import { useToastStore } from '../store/toastStore';

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-l-[3px] border-l-info';
        if (toast.type === 'success') borderClass = 'border-l-[3px] border-l-success';
        if (toast.type === 'error') borderClass = 'border-l-[3px] border-l-danger';
        if (toast.type === 'warning') borderClass = 'border-l-[3px] border-l-warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between min-w-[280px] max-w-[360px] bg-bg-elevated border border-border-default ${borderClass} rounded-lg p-3.5 shadow-xl text-[13px] text-text-primary transition-all duration-300 animate-slide-in`}
          >
            <span className="flex-1 mr-3 leading-normal">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text-primary cursor-pointer transition-colors text-base font-semibold leading-none self-start"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
};

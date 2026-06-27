import React from 'react';
import { ToastState } from '../hooks/useToast';

interface ToastProps {
  toast: ToastState | null;
}

export const ToastNotification: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white text-text-main text-sm font-semibold rounded-default shadow-lg border border-border-muted animate-slide-up">
      {toast.type === 'success' ? (
        <div className="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-info text-white flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
      )}
      <span>{toast.message}</span>
    </div>
  );
};

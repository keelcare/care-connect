'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const typeStyles = {
  success: {
    container: 'bg-success-50 border-success-500',
    icon: 'text-success-600',
    title: 'text-success-900',
    message: 'text-success-700',
  },
  error: {
    container: 'bg-error-50 border-error-500',
    icon: 'text-error-600',
    title: 'text-error-900',
    message: 'text-error-700',
  },
  info: {
    container: 'bg-info-50 border-info-500',
    icon: 'text-info-600',
    title: 'text-info-900',
    message: 'text-info-700',
  },
  warning: {
    container: 'bg-warning-50 border-warning-500',
    icon: 'text-warning-600',
    title: 'text-warning-900',
    message: 'text-warning-700',
  },
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  const styles = typeStyles[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg pointer-events-auto',
        'bg-white/95 backdrop-blur-sm',
        'animate-in slide-in-from-right-full fade-in duration-300',
        styles.container
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className={cn('text-sm font-semibold mb-1', styles.title)}>
            {toast.title}
          </h4>
        )}
        <p className={cn('text-sm', styles.message)}>{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="min-h-tap min-w-tap flex items-center justify-center -mr-2 -mt-1 text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-100"
        aria-label="Close notification"
        type="button"
      >
        <X size={18} />
      </button>
    </div>
  );
};

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUIStore from '../../store/useUIStore';
import { cn } from '../../lib/utils';

const TOAST_CONFIG = {
  success: {
    icon:        CheckCircle,
    borderColor: 'border-l-success',
    iconColor:   'text-success',
  },
  error: {
    icon:        XCircle,
    borderColor: 'border-l-danger',
    iconColor:   'text-danger',
  },
  info: {
    icon:        Info,
    borderColor: 'border-l-primary',
    iconColor:   'text-primary',
  },
};

/** Individual toast item — handles auto-dismiss with hover pause. */
function ToastItem({ id, type, message, duration }) {
  const removeToast = useUIStore((s) => s.removeToast);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const remainingRef = useRef(duration);
  const startTimeRef = useRef(Date.now());

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => removeToast(id), remainingRef.current);
  };

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    remainingRef.current -= Date.now() - startTimeRef.current;
    setPaused(true);
  };

  const resumeTimer = () => {
    setPaused(false);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  const config = TOAST_CONFIG[type] ?? TOAST_CONFIG.info;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 w-80 p-4 rounded-md border border-border border-l-4',
        'bg-surface shadow-md',
        config.borderColor
      )}
    >
      <Icon size={18} className={cn('flex-shrink-0 mt-0.5', config.iconColor)} />
      <p className="flex-1 text-sm text-text-primary leading-snug">{message}</p>
      <button
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}

/** Toast container — fixed bottom-right, stacked. */
export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/** Hook for convenient toast dispatch from any component. */
export function useToast() {
  const addToast = useUIStore((s) => s.addToast);
  return {
    success: (message) => addToast({ type: 'success', message }),
    error:   (message) => addToast({ type: 'error',   message }),
    info:    (message) => addToast({ type: 'info',    message }),
  };
}

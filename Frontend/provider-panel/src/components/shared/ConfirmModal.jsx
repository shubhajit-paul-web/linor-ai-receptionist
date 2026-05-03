import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ConfirmModal — used only for high-stakes destructive actions.
 * For low-stakes deletions, prefer inline confirmation + undo toast.
 *
 * Props:
 *   open          — boolean
 *   onClose       — () => void
 *   onConfirm     — () => void
 *   title         — string
 *   description   — string
 *   confirmLabel  — string (default: "Confirm")
 *   confirmDanger — boolean (renders confirm button as danger red)
 *   requireType   — string | null (if set, user must type this string to confirm)
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmDanger = false,
  requireType = null,
}) {
  const inputRef = useRef(null);
  const confirmRef = useRef(null);

  // Keyboard: Escape closes, Enter confirms (when no typing required)
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && !requireType) onConfirm();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, onConfirm, requireType]);

  // Trap focus when open
  useEffect(() => {
    if (open) setTimeout(() => (requireType ? inputRef.current?.focus() : confirmRef.current?.focus()), 50);
  }, [open, requireType]);

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[4px]"
          />

          {/* Modal card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-[480px] bg-surface border border-border rounded-lg p-6 shadow-md pointer-events-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={18} />
              </button>

              {/* Icon + Title */}
              <div className="flex items-start gap-3 mb-3">
                {confirmDanger && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-danger-light flex items-center justify-center">
                    <AlertTriangle size={18} className="text-danger" />
                  </div>
                )}
                <div>
                  <h3 id="modal-title" className="text-h4 text-text-primary font-semibold">
                    {title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Type-to-confirm input */}
              {requireType && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-text-muted uppercase tracking-widest mb-2 block">
                    Type <span className="font-bold text-danger">{requireType}</span> to confirm
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={requireType}
                    onChange={(e) => {
                      // Enable confirm button only when text matches exactly
                      if (confirmRef.current) {
                        confirmRef.current.disabled = e.target.value !== requireType;
                      }
                    }}
                    className={cn(
                      'w-full h-10 px-3 text-sm rounded-md border border-border',
                      'bg-surface text-text-primary placeholder:text-text-muted',
                      'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20',
                      'transition-colors duration-150'
                    )}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  onClick={onClose}
                  className={cn(
                    'h-9 px-4 text-sm font-medium rounded-md border border-border',
                    'bg-surface text-text-secondary',
                    'hover:bg-surface-secondary hover:text-text-primary',
                    'transition-colors duration-150'
                  )}
                >
                  Cancel
                </button>
                <button
                  ref={confirmRef}
                  onClick={onConfirm}
                  disabled={!!requireType}
                  className={cn(
                    'h-9 px-4 text-sm font-semibold rounded-md transition-colors duration-150',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    confirmDanger
                      ? 'bg-danger text-white hover:bg-danger/90'
                      : 'bg-primary text-white hover:bg-primary-hover'
                  )}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

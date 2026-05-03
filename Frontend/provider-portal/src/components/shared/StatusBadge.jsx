import { cn } from '../../lib/utils';

/**
 * Status badge component used across appointments and chat logs.
 * Uses semantic color tokens — not arbitrary Tailwind colors.
 */
const STATUS_CONFIG = {
  Pending:    { bg: 'bg-warning-light', text: 'text-warning',  dot: 'bg-warning'  },
  Confirmed:  { bg: 'bg-success-light', text: 'text-success',  dot: 'bg-success'  },
  Cancelled:  { bg: 'bg-danger-light',  text: 'text-danger',   dot: 'bg-danger'   },
  Booked:     { bg: 'bg-success-light', text: 'text-success',  dot: 'bg-success'  },
  'FAQ Only': { bg: 'bg-primary-light', text: 'text-primary',  dot: 'bg-primary'  },
  Unresolved: { bg: 'bg-warning-light', text: 'text-warning',  dot: 'bg-warning'  },
  Online:     { bg: 'bg-success-light', text: 'text-success',  dot: 'bg-success'  },
  Offline:    { bg: 'bg-surface-secondary', text: 'text-muted', dot: 'bg-neutral' },
};

export function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;

  return (
    <span
      className={cn(
        'badge transition-colors duration-200',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      {status}
    </span>
  );
}

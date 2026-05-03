import { cn } from '../../lib/utils';

/**
 * StatusBadge — colored pill with a dot, used wherever a row
 * has a state (appointments, chat logs, billing, etc.).
 *
 * Adding a new status is a single config row below; the visual
 * primitives (`.badge`) live in globals.css so the look stays consistent.
 */
const STATUS_CONFIG = {
  Pending:     { tone: 'warning' },
  Confirmed:   { tone: 'success' },
  Cancelled:   { tone: 'danger'  },
  Booked:      { tone: 'success' },
  Completed:   { tone: 'success' },
  'FAQ Only':  { tone: 'info'    },
  Unresolved:  { tone: 'warning' },
  Online:      { tone: 'success' },
  Offline:     { tone: 'neutral' },
  Active:      { tone: 'success' },
  Inactive:    { tone: 'neutral' },
  Failed:      { tone: 'danger'  },
};

const TONE_STYLES = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger:  'bg-danger-light text-danger',
  info:    'bg-info-light text-info',
  neutral: 'bg-surface-secondary text-text-muted',
};

const DOT_STYLES = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  info:    'bg-info',
  neutral: 'bg-text-muted',
};

export function StatusBadge({ status, className }) {
  const tone = STATUS_CONFIG[status]?.tone ?? 'neutral';
  return (
    <span className={cn('badge', TONE_STYLES[tone], className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', DOT_STYLES[tone])} />
      {status}
    </span>
  );
}

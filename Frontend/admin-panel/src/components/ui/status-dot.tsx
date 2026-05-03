import { cn } from '@/lib/utils';

export type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const TONE_BG: Record<StatusTone, string> = {
  neutral: 'bg-[var(--color-tertiary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  info: 'bg-[var(--color-info)]',
  accent: 'bg-[var(--color-accent)]',
};

interface StatusDotProps {
  tone: StatusTone;
  pulse?: boolean;
  className?: string;
}

export function StatusDot({ tone, pulse = false, className }: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)} aria-hidden>
      {pulse && (
        <span
          className={cn(
            'absolute inset-0 rounded-full opacity-50 animate-ping',
            TONE_BG[tone],
          )}
        />
      )}
      <span className={cn('relative inline-block h-2 w-2 rounded-full', TONE_BG[tone])} />
    </span>
  );
}

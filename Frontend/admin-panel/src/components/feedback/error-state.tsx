import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\u2019t load this view. Try again or check the connection.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-12 px-6 rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
      <div className="grid place-items-center w-9 h-9 rounded-full bg-[var(--color-danger-subtle)] mb-1">
        <AlertOctagon className="size-4 text-[var(--color-danger)]" />
      </div>
      <p className="text-sm font-medium text-[var(--color-primary)]">{title}</p>
      <p className="text-xs text-[var(--color-tertiary)] max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
          <RotateCcw className="size-3" />
          Retry
        </Button>
      )}
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center gap-2 py-10 px-6 rounded-[12px] border border-dashed border-[var(--color-border-default)]',
        className,
      )}
    >
      {Icon && (
        <div className="grid place-items-center w-9 h-9 rounded-full bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] mb-1">
          <Icon className="size-4 text-[var(--color-tertiary)]" />
        </div>
      )}
      <p className="text-sm font-medium text-[var(--color-primary)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--color-tertiary)] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

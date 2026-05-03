import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, meta, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-primary)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-[var(--color-tertiary)] max-w-2xl">{description}</p>
          )}
          {meta && <div className="mt-2 flex flex-wrap gap-2 items-center">{meta}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

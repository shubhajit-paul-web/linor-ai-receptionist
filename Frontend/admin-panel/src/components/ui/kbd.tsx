import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-medium',
        'bg-[var(--color-overlay)] border border-[var(--color-border-default)] rounded-[4px]',
        'text-[var(--color-secondary)]',
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

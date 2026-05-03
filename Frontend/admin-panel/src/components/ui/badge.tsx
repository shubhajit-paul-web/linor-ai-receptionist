import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 h-5 text-[11px] font-medium tracking-tight rounded-full border whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral:
          'bg-[var(--color-elevated)] text-[var(--color-secondary)] border-[var(--color-border-default)]',
        accent:
          'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-transparent',
        success:
          'bg-[var(--color-success-subtle)] text-[var(--color-success)] border-transparent',
        warning:
          'bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-transparent',
        danger:
          'bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border-transparent',
        info: 'bg-[var(--color-info-subtle)] text-[var(--color-info)] border-transparent',
        outline:
          'bg-transparent text-[var(--color-secondary)] border-[var(--color-border-default)]',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, tone, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props} />
));
Badge.displayName = 'Badge';

export { badgeVariants };

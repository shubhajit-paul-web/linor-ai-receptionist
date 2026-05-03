import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,border-color,box-shadow] disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-accent)] text-[var(--color-accent-on)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent-active)] shadow-[var(--shadow-sm)]',
        secondary:
          'bg-[var(--color-elevated)] text-[var(--color-primary)] border border-[var(--color-border-default)] hover:bg-[var(--color-overlay)] hover:border-[var(--color-border-strong)]',
        ghost:
          'text-[var(--color-secondary)] hover:bg-[var(--color-elevated)] hover:text-[var(--color-primary)]',
        outline:
          'border border-[var(--color-border-default)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-elevated)]',
        danger:
          'bg-[var(--color-danger)] text-[var(--color-danger-on)] hover:opacity-90 shadow-[var(--shadow-sm)]',
        link: 'text-[var(--color-accent)] underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs rounded-[6px]',
        md: 'h-8 px-3 text-sm rounded-[6px]',
        lg: 'h-9 px-4 text-sm rounded-[8px]',
        icon: 'h-8 w-8 rounded-[6px]',
        'icon-sm': 'h-7 w-7 rounded-[6px]',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { buttonVariants };

import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/auth-context';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'avery@linor.dev', password: 'demo1234' },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      toast.success('Welcome back');
      void navigate({ to: '/' });
    } catch (err) {
      toast.error('Sign in failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="surface-elevated p-7">
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="grid place-items-center w-9 h-9 rounded-[8px] bg-[var(--color-overlay)] border border-[var(--color-border-default)]">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
              d="M9 7v18h14"
              stroke="var(--color-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="23" cy="9" r="2.5" fill="var(--color-accent)" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-base font-semibold tracking-tight">Sign in to Linor</h1>
          <p className="text-xs text-[var(--color-tertiary)] mt-1">
            Super Admin · Internal access only
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {errors.email && (
            <span className="text-[11px] text-[var(--color-danger)]">{errors.email.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
          {errors.password && (
            <span className="text-[11px] text-[var(--color-danger)]">{errors.password.message}</span>
          )}
        </div>

        <Button variant="primary" size="lg" type="submit" disabled={submitting} className="mt-1">
          {submitting && <Loader2 className="size-3.5 animate-spin" />}
          Sign in
        </Button>
      </form>

      <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-tertiary)] leading-relaxed space-y-2">
        <p>
          By signing in you acknowledge that this system processes
          Protected Health Information (PHI) governed by{' '}
          <strong className="text-[var(--color-secondary)]">HIPAA</strong>,{' '}
          <strong className="text-[var(--color-secondary)]">HITECH</strong>, and
          applicable state privacy laws. Unauthorized access is prohibited and
          may result in civil and criminal penalties.
        </p>
        <p>
          All activity is logged for audit and compliance purposes.
        </p>
      </div>
      <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-tertiary)] leading-relaxed">
        <p className="font-medium text-[var(--color-secondary)] mb-1">Demo mode</p>
        Any credentials work. Email prefix selects the role:
        <span className="text-[var(--color-secondary)]"> ops@</span>,{' '}
        <span className="text-[var(--color-secondary)]">support@</span>,{' '}
        <span className="text-[var(--color-secondary)]">billing@</span>,{' '}
        <span className="text-[var(--color-secondary)]">view@</span>.
      </div>
    </div>
  );
}

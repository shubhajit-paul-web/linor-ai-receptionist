import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster, toast } from 'sonner';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/features/auth/auth-context';
import { useUiStore } from '@/stores/ui-store';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { SESSION_POLICY } from '@/lib/compliance';

function DensitySync() {
  const density = useUiStore((s) => s.density);
  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);
  return null;
}

/** HIPAA §164.312(a)(2)(iii) — automatic logoff after inactivity. */
function SessionGuard() {
  const { user, signOut } = useAuth();

  const onWarn = useCallback(() => {
    toast.warning('Session expiring soon', {
      description: 'You will be signed out in 2 minutes due to inactivity.',
      duration: 60_000,
    });
  }, []);

  const onLogout = useCallback(() => {
    signOut();
    toast.error('Session expired', {
      description: 'You were signed out due to inactivity (HIPAA policy).',
    });
  }, [signOut]);

  useSessionTimeout({
    warnAfterMs: SESSION_POLICY.warnAfterMinutes * 60 * 1000,
    logoutAfterMs: SESSION_POLICY.logoutAfterMinutes * 60 * 1000,
    onWarn,
    onLogout,
    enabled: !!user,
  });

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <QueryClientProvider client={client}>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <DensitySync />
            <SessionGuard />
            {children}
            <Toaster
              position="bottom-right"
              theme="dark"
              toastOptions={{
                style: {
                  background: 'var(--color-elevated)',
                  border: '1px solid var(--color-border-default)',
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                },
              }}
            />
          </TooltipProvider>
        </AuthProvider>
        {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

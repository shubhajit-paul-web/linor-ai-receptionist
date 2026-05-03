import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect, useState, type ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/features/auth/auth-context';
import { useUiStore } from '@/stores/ui-store';

function DensitySync() {
  const density = useUiStore((s) => s.density);
  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);
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

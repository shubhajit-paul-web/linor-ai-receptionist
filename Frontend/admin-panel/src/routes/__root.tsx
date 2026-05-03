import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { CommandPalette } from '@/components/command/command-palette';

function RootComponent() {
  useEffect(() => {
    // Apply persisted density on mount in case it differs from default.
    const stored = localStorage.getItem('linor.ui');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { state?: { density?: string } };
        if (parsed.state?.density) {
          document.documentElement.dataset.density = parsed.state.density;
        }
      } catch {
        // ignore
      }
    }
  }, []);

  return (
    <>
      <Outlet />
      <CommandPalette />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="grid place-items-center h-screen w-screen text-center px-6">
      <div className="flex flex-col items-center gap-3 max-w-sm">
        <div className="text-5xl font-semibold tracking-tight">404</div>
        <p className="text-sm text-[var(--color-tertiary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="text-sm text-[var(--color-accent)] hover:underline underline-offset-4"
        >
          Back to overview
        </a>
      </div>
    </div>
  );
}

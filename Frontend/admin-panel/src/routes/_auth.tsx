import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  beforeLoad: () => {
    // If already signed in, redirect home. Auth lives in localStorage in mock mode.
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('linor.auth.user');
    if (raw) {
      throw redirect({ to: '/' });
    }
  },
});

function AuthLayout() {
  return (
    <div className="min-h-screen w-screen grid place-items-center bg-[var(--color-canvas)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          background:
            'radial-gradient(ellipse 1200px 400px at 50% -10%, color-mix(in oklch, var(--color-accent) 20%, transparent) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 w-full max-w-sm px-6">
        <Outlet />
      </div>
    </div>
  );
}

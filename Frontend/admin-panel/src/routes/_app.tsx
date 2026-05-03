import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/layout/app-shell';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: () => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem('linor.auth.user');
    if (!raw) {
      throw redirect({ to: '/login' });
    }
  },
});

function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

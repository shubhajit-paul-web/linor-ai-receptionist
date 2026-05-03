import { redirect } from '@tanstack/react-router';
import type { Permission } from '@/app/permissions';
import { hasPermission } from '@/app/permissions';
import type { AuthUser } from '@/features/auth/auth-context';

/**
 * Route-level permission guard.
 *
 * Call inside `beforeLoad` to enforce that the current user holds
 * every required permission. Redirects to "/" with a `denied` search
 * param when the check fails, which the shell can use to show a toast.
 *
 * Usage:
 *   beforeLoad: () => requirePermissions(['conversations.read'])
 */
export function requirePermissions(required: Permission[]): void {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem('linor.auth.user');
  if (!raw) {
    throw redirect({ to: '/login' });
  }

  let user: AuthUser;
  try {
    user = JSON.parse(raw) as AuthUser;
  } catch {
    window.localStorage.removeItem('linor.auth.user');
    throw redirect({ to: '/login' });
  }

  const missing = required.filter((p) => !hasPermission(user.role, p));
  if (missing.length > 0) {
    throw redirect({
      to: '/',
      search: { denied: missing.join(',') },
    });
  }
}

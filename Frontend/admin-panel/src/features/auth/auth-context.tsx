import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { hasPermission, type Permission, type Role } from '@/app/permissions';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  switchRole: (role: Role) => void;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = 'linor.auth.user';

const DEFAULT_USER: AuthUser = {
  id: 'usr_super_001',
  name: 'Avery Chen',
  email: 'avery@linor.dev',
  role: 'SuperAdmin',
};

function loadUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(loadUser());
    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // Mock auth — accepts any credential, scopes role from email pattern for demo:
    //   ops@..., support@..., billing@..., view@... → matching role; else SuperAdmin.
    await new Promise((r) => setTimeout(r, 240));
    const role: Role = email.startsWith('ops@')
      ? 'OpsAdmin'
      : email.startsWith('support@')
        ? 'Support'
        : email.startsWith('billing@')
          ? 'Billing'
          : email.startsWith('view@')
            ? 'ReadOnly'
            : 'SuperAdmin';
    const next: AuthUser = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0]?.replace(/^./, (c) => c.toUpperCase()) ?? DEFAULT_USER.name,
      role,
    };
    persistUser(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    persistUser(null);
    setUser(null);
  }, []);

  const switchRole = useCallback((role: Role) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, role };
      persistUser(next);
      return next;
    });
  }, []);

  const can = useCallback(
    (permission: Permission) => (user ? hasPermission(user.role, permission) : false),
    [user],
  );

  const value = useMemo<AuthState>(
    () => ({ user, isLoading, signIn, signOut, switchRole, can }),
    [user, isLoading, signIn, signOut, switchRole, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

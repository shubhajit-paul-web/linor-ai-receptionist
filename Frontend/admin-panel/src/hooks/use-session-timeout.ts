import { useCallback, useEffect, useRef } from 'react';

/**
 * HIPAA §164.312(a)(2)(iii) — Automatic logoff.
 *
 * Monitors user activity (mouse, keyboard, touch, scroll) and triggers
 * a warning callback before auto-logout. Configurable timeouts let
 * deployments tune for their risk tolerance without code changes.
 */

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'pointerdown',
];

export interface SessionTimeoutOptions {
  /** Milliseconds of inactivity before the warning fires. Default: 13 min. */
  warnAfterMs?: number;
  /** Milliseconds of inactivity before forced sign-out. Default: 15 min. */
  logoutAfterMs?: number;
  /** Called when the warning threshold is reached. */
  onWarn?: () => void;
  /** Called when the logout threshold is reached. */
  onLogout: () => void;
  /** Set to `false` to disable (e.g. when user is not authenticated). */
  enabled?: boolean;
}

const DEFAULT_WARN_MS = 13 * 60 * 1000;
const DEFAULT_LOGOUT_MS = 15 * 60 * 1000;

export function useSessionTimeout({
  warnAfterMs = DEFAULT_WARN_MS,
  logoutAfterMs = DEFAULT_LOGOUT_MS,
  onWarn,
  onLogout,
  enabled = true,
}: SessionTimeoutOptions): void {
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warned = useRef(false);

  const clearTimers = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    warnTimer.current = null;
    logoutTimer.current = null;
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    warned.current = false;

    warnTimer.current = setTimeout(() => {
      warned.current = true;
      onWarn?.();
    }, warnAfterMs);

    logoutTimer.current = setTimeout(() => {
      onLogout();
    }, logoutAfterMs);
  }, [clearTimers, warnAfterMs, logoutAfterMs, onWarn, onLogout]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    resetTimers();

    const handleActivity = () => resetTimers();

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      clearTimers();
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity);
      }
    };
  }, [enabled, resetTimers, clearTimers]);
}

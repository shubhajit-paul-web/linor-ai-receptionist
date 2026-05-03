import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useUIStore from '../store/useUIStore';

/**
 * Global keyboard shortcuts.
 * Cmd/Ctrl+K — global search
 * G then D    — go to dashboard
 * G then A    — go to appointments
 * Escape      — handled per-component
 */
export function useKeyboardShortcuts() {
  const navigate   = useNavigate();
  const openSearch = useUIStore((s) => s.openSearch);
  const handlerRef = useRef(null);

  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    handlerRef.current = (e) => {
      // Don't fire shortcuts when typing in inputs
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (inInput) return;

      const isMod = e.metaKey || e.ctrlKey;
      const now = Date.now();

      // Cmd/Ctrl+K → global search
      if (isMod && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      // Sequential shortcuts: G then D, G then A
      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        if (e.key === 'd') { navigate('/dashboard');    lastKey = ''; return; }
        if (e.key === 'a') { navigate('/appointments'); lastKey = ''; return; }
      }

      lastKey = e.key;
      lastKeyTime = now;
    };

    window.addEventListener('keydown', handlerRef.current);
    return () => window.removeEventListener('keydown', handlerRef.current);
  }, [navigate, openSearch]);
}

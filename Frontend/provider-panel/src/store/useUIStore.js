import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI store — transient and persistent UI state.
 * Kept separate from data stores to avoid unnecessary re-renders.
 */
const useUIStore = create(
  persist(
    (set, get) => ({
      // ─── Theme ────────────────────────────────────────────────
      theme: 'dark', // 'light' | 'dark'

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: next });
        // Apply to DOM immediately so CSS vars update
        document.documentElement.classList.toggle('dark', next === 'dark');
      },

      initTheme: () => {
        const { theme } = get();
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      // ─── Sidebar ──────────────────────────────────────────────
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // ─── Toast Notifications ──────────────────────────────────
      toasts: [], // [{ id, type, message, duration }]

      addToast: ({ type = 'info', message, duration = 4000 }) => {
        const id = Date.now().toString();
        set((s) => ({
          // Cap at 3 toasts — oldest removed when 4th arrives
          toasts: [...s.toasts.slice(-2), { id, type, message, duration }],
        }));
        return id;
      },

      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // ─── Global Search ────────────────────────────────────────
      searchOpen: false,
      searchQuery: '',
      recentSearches: [],

      openSearch:  () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false, searchQuery: '' }),

      setSearchQuery: (q) => set({ searchQuery: q }),

      addRecentSearch: (query) => {
        if (!query.trim()) return;
        set((s) => ({
          recentSearches: [
            query,
            ...s.recentSearches.filter((r) => r !== query),
          ].slice(0, 8),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      // ─── Welcome Banner ────────────────────────────────────────
      welcomeDismissed: false,
      dismissWelcome: () => set({ welcomeDismissed: true }),
    }),
    {
      name: 'linor-ui-v2',
      // Only persist theme + sidebar state + recent searches
      partialize: (s) => ({
        theme:           s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        recentSearches:  s.recentSearches,
        welcomeDismissed: s.welcomeDismissed,
      }),
    }
  )
);

export default useUIStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Density = 'compact' | 'comfortable' | 'cozy';

interface UiState {
  sidebarCollapsed: boolean;
  density: Density;
  commandOpen: boolean;
  inspectorOpen: boolean;
  inspectorEntity: { kind: string; id: string } | null;
  /** When true, PHI fields (patient names, phones, emails) are masked in the UI. */
  phiMasked: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  setDensity: (d: Density) => void;
  setCommandOpen: (v: boolean) => void;
  toggleCommand: () => void;
  openInspector: (kind: string, id: string) => void;
  closeInspector: () => void;
  togglePhiMask: () => void;
  setPhiMasked: (v: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      density: 'comfortable',
      commandOpen: false,
      inspectorOpen: false,
      inspectorEntity: null,
      phiMasked: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      setDensity: (density) => {
        if (typeof document !== 'undefined') {
          document.documentElement.dataset.density = density;
        }
        set({ density });
      },
      setCommandOpen: (v) => set({ commandOpen: v }),
      toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
      openInspector: (kind, id) => set({ inspectorOpen: true, inspectorEntity: { kind, id } }),
      closeInspector: () => set({ inspectorOpen: false, inspectorEntity: null }),
      togglePhiMask: () => set((s) => ({ phiMasked: !s.phiMasked })),
      setPhiMasked: (v) => set({ phiMasked: v }),
    }),
    {
      name: 'linor.ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, density: s.density, phiMasked: s.phiMasked }),
    },
  ),
);

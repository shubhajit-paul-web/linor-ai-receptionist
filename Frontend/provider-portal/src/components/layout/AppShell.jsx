import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../shared/Toast';
import { GlobalSearch } from '../shared/GlobalSearch';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

/**
 * AppShell — wraps every authenticated page.
 *
 * Layout:
 *   ┌──────────┬──────────────────────────────┐
 *   │          │  Topbar (h-12, hairline)     │
 *   │ Sidebar  ├──────────────────────────────┤
 *   │ (flex)   │  Main (scroll, max-w 1440)   │
 *   └──────────┴──────────────────────────────┘
 *
 * The sidebar owns its own width animation; the main column
 * flexes to fill the remaining viewport. No fixed positioning.
 */
export function AppShell() {
  const location = useLocation();

  // Register Cmd/Ctrl+K, ?, etc. once at the shell level
  useKeyboardShortcuts();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          {/* Page transition wrapper — fades + lifts on route change */}
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="mx-auto w-full max-w-[1440px] px-6 py-6 md:px-8 md:py-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Global overlays — outside the layout flow */}
      <GlobalSearch />
      <ToastContainer />
    </div>
  );
}

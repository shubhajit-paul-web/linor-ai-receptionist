import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ToastContainer } from '../shared/Toast';
import { GlobalSearch } from '../shared/GlobalSearch';
import useUIStore from '../../store/useUIStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

/**
 * AppShell — wraps all authenticated pages.
 * Structure: sidebar (fixed left) + topbar (fixed top, spans content) + main content.
 */
export function AppShell() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  // Register global keyboard shortcuts for the whole app
  useKeyboardShortcuts();

  const contentLeft = sidebarCollapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Fixed topbar — starts after sidebar */}
      <Topbar />

      {/* Scrollable main content area */}
      <main
        style={{
          marginLeft: contentLeft,
          paddingTop: 60, // topbar height
          transition: 'margin-left 200ms ease-in-out',
        }}
        className="min-h-screen"
      >
        {/* Page transition wrapper */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="p-6"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Global overlays */}
      <GlobalSearch />
      <ToastContainer />
    </div>
  );
}

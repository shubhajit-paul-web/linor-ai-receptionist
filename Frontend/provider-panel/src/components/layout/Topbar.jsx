import { useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Search, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useClinicStore from '../../store/useClinicStore';
import { cn } from '../../lib/utils';
import Tooltip from '../shared/Tooltip';

// Maps route paths to human-readable breadcrumb segments
const BREADCRUMB_MAP = {
  '/dashboard':      ['Dashboard'],
  '/appointments':   ['Appointments'],
  '/logs':           ['Patient Interactions', 'Chat Logs'],
  '/faqs':           ['Chatbot Config', 'FAQs'],
  '/widget-settings': ['Chatbot Config', 'Widget Settings'],
  '/embed':          ['Chatbot Config', 'Embed Code'],
  '/settings':       ['Clinic', 'Clinic Settings'],
  '/working-hours':  ['Clinic', 'Working Hours'],
  '/api-security':   ['Account', 'API & Security'],
  '/billing':        ['Account', 'Billing'],
};

export function Topbar() {
  const { pathname } = useLocation();
  const { openSearch, sidebarCollapsed } = useUIStore();
  const { appointments } = useClinicStore();

  const breadcrumbs = useMemo(
    () => BREADCRUMB_MAP[pathname] ?? [pathname.replace('/', '')],
    [pathname]
  );
  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === 'Pending').length,
    [appointments]
  );

  // Determine left margin based on sidebar state
  const leftOffset = sidebarCollapsed ? 64 : 240;

  return (
    <header
      style={{ left: leftOffset }}
      className={cn(
        'fixed top-0 right-0 z-30 h-[60px]',
        'bg-surface/95 backdrop-blur-md border-b border-border',
        'flex items-center px-6 gap-4',
        'transition-[left] duration-200 ease-in-out'
      )}
    >
      {/* ─── Breadcrumb ──────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-1">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-text-muted" />}
            <span
              className={cn(
                'text-sm',
                i === breadcrumbs.length - 1
                  ? 'font-semibold text-text-primary'
                  : 'text-text-muted'
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* ─── Global Search Trigger ───────────────────────────────── */}
      <button
        onClick={openSearch}
        aria-label="Open global search (Ctrl+K)"
        className={cn(
          'flex items-center gap-2 h-9 px-3 rounded-md border border-border',
          'bg-surface-secondary text-text-muted text-sm',
          'hover:border-border-strong hover:text-text-primary',
          'transition-colors duration-150',
          'min-w-[180px]'
        )}
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="text-xs bg-surface px-1.5 py-0.5 rounded font-mono border border-border">
          ⌘K
        </kbd>
      </button>

      {/* ─── Right Actions ──────────────────────────────────────── */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <Link
          to="/appointments"
          aria-label={`${pendingCount} pending appointments`}
          className="relative w-9 h-9 flex items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors duration-100"
        >
          <Bell size={18} />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
          )}
        </Link>

        {/* Help */}
        <Tooltip content="Help & Documentation" placement="bottom">
          <a
            href="#"
            aria-label="Documentation"
            className="w-9 h-9 flex items-center justify-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors duration-100"
          >
            <HelpCircle size={18} />
          </a>
        </Tooltip>

        {/* Clinic avatar (decorative in this demo) */}
        <Link
          to="/settings"
          aria-label="Clinic settings"
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity ml-1"
        >
          HC
        </Link>
      </div>
    </header>
  );
}

import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, ChevronRight } from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useClinicStore from '../../store/useClinicStore';
import { cn, getInitials } from '../../lib/utils';
import Tooltip from '../shared/Tooltip';
import { BREADCRUMB_MAP } from './navConfig';

/**
 * Topbar — slim chrome (h-12) modeled on admin-panel:
 *   [breadcrumb] · · · [search ⌘K]  [bell] [help] [avatar]
 *
 * The breadcrumb is derived from NAV_GROUPS to keep nav and
 * topbar in lockstep. Notification dot reflects pending appts.
 */
export function Topbar() {
  const { pathname } = useLocation();
  const openSearch = useUIStore((s) => s.openSearch);
  const { appointments, clinic } = useClinicStore();

  const breadcrumbs = BREADCRUMB_MAP[pathname] ?? [pathname.replace('/', '') || 'Dashboard'];
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

  return (
    <header
      className="flex items-center h-12 px-4 gap-3 border-b border-border bg-background/95 backdrop-blur-md"
      aria-label="Top bar"
    >
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={`${crumb}-${i}`} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={12} className="text-text-muted flex-shrink-0" />}
            <span
              className={cn(
                'text-[13px] truncate',
                i === breadcrumbs.length - 1
                  ? 'font-semibold text-text-primary'
                  : 'text-text-muted',
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Search trigger — opens global command palette */}
      <button
        onClick={openSearch}
        aria-label="Open global search"
        className={cn(
          'ml-auto flex items-center gap-2 h-7 pl-2 pr-2',
          'rounded-md bg-surface-secondary border border-border',
          'text-[12px] text-text-muted',
          'hover:border-border-strong hover:text-text-secondary',
          'transition-colors min-w-[260px]',
        )}
      >
        <Search size={13} />
        <span className="flex-1 text-left truncate">
          Search appointments, FAQs, settings…
        </span>
        <span className="flex items-center gap-1">
          <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span>
          <span className="kbd">K</span>
        </span>
      </button>

      {/* Right action cluster */}
      <div className="flex items-center gap-1">
        <Tooltip content={pendingCount ? `${pendingCount} pending` : 'No new alerts'} placement="bottom">
          <Link
            to="/appointments"
            aria-label={`${pendingCount} pending appointments`}
            className="relative w-8 h-8 grid place-items-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors"
          >
            <Bell size={15} />
            {pendingCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-danger rounded-full ring-2 ring-background"
                aria-hidden
              />
            )}
          </Link>
        </Tooltip>

        <Tooltip content="Help & shortcuts" placement="bottom">
          <a
            href="#"
            aria-label="Help"
            className="w-8 h-8 grid place-items-center rounded-md text-text-muted hover:bg-surface-secondary hover:text-text-primary transition-colors"
          >
            <HelpCircle size={15} />
          </a>
        </Tooltip>

        <Link
          to="/settings"
          aria-label="Clinic settings"
          className="ml-1 w-7 h-7 rounded-full bg-primary text-primary-on grid place-items-center text-[10px] font-bold hover:opacity-90 transition-opacity"
        >
          {getInitials(clinic.name) || 'HC'}
        </Link>
      </div>
    </header>
  );
}

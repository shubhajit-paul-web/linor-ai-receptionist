import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, LogOut, ChevronsLeft, ChevronsRight, ShieldCheck,
} from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import useClinicStore from '../../store/useClinicStore';
import { cn, getInitials } from '../../lib/utils';
import Tooltip from '../shared/Tooltip';
import { NAV_GROUPS } from './navConfig';

// ──────────────────────────────────────────────────────────────
// NavItem — single sidebar entry. Tooltipped when collapsed.
// ──────────────────────────────────────────────────────────────

function NavItem({ path, label, icon: Icon, hint, collapsed }) {
  const link = (
    <NavLink
      to={path}
      className={({ isActive }) => cn('sidebar-item group', isActive && 'active')}
      end={path === '/dashboard'}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={15}
            strokeWidth={2}
            className={cn(
              'flex-shrink-0 transition-colors',
              isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary',
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
          {!collapsed && hint && (
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary-light px-1.5 py-0.5 rounded">
              {hint}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return link;
  return (
    <Tooltip content={label} placement="right">
      {link}
    </Tooltip>
  );
}

// ──────────────────────────────────────────────────────────────
// Sidebar — primary navigation rail.
// ──────────────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const { clinic } = useClinicStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 60 : 232 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn(
        'relative flex flex-col h-full flex-shrink-0',
        'bg-background border-r border-border overflow-hidden',
      )}
      aria-label="Primary navigation"
    >
      {/* ── Brand row ───────────────────────────────────── */}
      <div className="flex items-center h-12 px-3 gap-2 border-b border-border">
        <div className="grid place-items-center w-7 h-7 rounded-md bg-surface border border-border flex-shrink-0 text-[11px] font-bold text-primary tabular-nums">
          {getInitials(clinic.name) || 'L'}
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col leading-none min-w-0">
            <span className="text-[13px] font-semibold tracking-tight truncate">
              {clinic.name || 'Linor'}
            </span>
            <span className="text-[10px] text-text-muted mt-0.5 truncate">
              {clinic.isPro ? 'Pro workspace' : 'Provider portal'}
            </span>
          </div>
        )}
      </div>

      {/* ── Navigation groups ──────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {group.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavItem {...item} collapsed={sidebarCollapsed} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer: trust → theme → user → collapse ───── */}
      <div className="border-t border-border px-2 py-2 space-y-1">
        {!sidebarCollapsed && (
          <div className="px-2 py-1.5 flex items-center gap-2 text-[10px] text-text-muted">
            <ShieldCheck size={11} className="text-success" />
            <span className="truncate">HIPAA-conscious · encrypted</span>
          </div>
        )}

        {/* Theme toggle */}
        <Tooltip
          content={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          placement="right"
        >
          <button
            onClick={toggleTheme}
            className={cn('sidebar-item w-full', sidebarCollapsed && 'justify-center px-0')}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            {!sidebarCollapsed && <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>}
          </button>
        </Tooltip>

        {/* User row + logout */}
        <div
          className={cn(
            'flex items-center gap-2 mt-1 p-1.5 rounded-md group',
            'hover:bg-surface-secondary transition-colors',
            sidebarCollapsed && 'justify-center',
          )}
        >
          <div className="w-7 h-7 rounded-full bg-primary-light text-primary border border-primary/20 grid place-items-center text-[11px] font-bold flex-shrink-0">
            {getInitials(user?.name ?? 'Admin')}
          </div>
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-[12px] font-semibold text-text-primary truncate leading-tight">
                  {user?.name ?? 'Admin'}
                </div>
                <div className="text-[10px] text-text-muted truncate leading-tight">
                  {user?.email ?? '—'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <Tooltip content="Sign out" placement="top">
              <button
                onClick={handleLogout}
                aria-label="Sign out"
                className="p-1.5 rounded text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger-light transition-all"
              >
                <LogOut size={13} />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Collapse toggle — last so it's always reachable */}
        <Tooltip content={sidebarCollapsed ? 'Expand' : 'Collapse'} placement="right">
          <button
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="sidebar-item w-full justify-center"
          >
            {sidebarCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
          </button>
        </Tooltip>
      </div>
    </motion.aside>
  );
}

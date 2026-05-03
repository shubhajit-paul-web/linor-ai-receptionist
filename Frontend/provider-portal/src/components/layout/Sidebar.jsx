import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarCheck, MessageSquare, HelpCircle,
  Sliders, Code2, Building2, Clock, Shield, CreditCard,
  Sun, Moon, LogOut, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import useUIStore from '../../store/useUIStore';
import useAuthStore from '../../store/useAuthStore';
import useClinicStore from '../../store/useClinicStore';
import { cn, getInitials } from '../../lib/utils';
import Tooltip from '../shared/Tooltip';

// ─── Navigation Configuration ─────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Patient Interactions',
    items: [
      { path: '/appointments', label: 'Appointments', icon: CalendarCheck },
      { path: '/logs', label: 'Chat Logs', icon: MessageSquare },
    ],
  },
  {
    label: 'Chatbot Config',
    items: [
      { path: '/faqs', label: 'FAQs', icon: HelpCircle },
      { path: '/widget-settings', label: 'Widget Settings', icon: Sliders },
      { path: '/embed', label: 'Embed Code', icon: Code2 },
    ],
  },
  {
    label: 'Clinic',
    items: [
      { path: '/settings', label: 'Clinic Settings', icon: Building2 },
      { path: '/working-hours', label: 'Working Hours', icon: Clock },
    ],
  },
  {
    label: 'Account',
    items: [
      { path: '/api-security', label: 'API & Security', icon: Shield },
      { path: '/billing', label: 'Billing', icon: CreditCard, badge: 'Pro' },
    ],
  },
];

// ─── Individual Nav Item ──────────────────────────────────────────────────────

function NavItem({ path, label, icon: Icon, badge, collapsed }) {
  const navLink = (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn('sidebar-item group', isActive && 'active')
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={16} strokeWidth={2.2} className={cn("flex-shrink-0 transition-colors duration-200", isActive ? "text-text-primary" : "text-text-muted group-hover:text-text-primary")} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap ml-1"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {badge && !collapsed && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return navLink;

  return (
    <Tooltip content={label} placement="right">
      {navLink}
    </Tooltip>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

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
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed top-0 left-0 h-screen z-40',
        'bg-surface border-r border-border',
        'flex flex-col overflow-hidden flex-shrink-0'
      )}
      aria-label="Main navigation"
    >
      {/* ─── Header: Logo + Clinic Name ────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-4 min-h-[60px] relative z-10">
        {/* Clinic avatar */}
        <div className="w-7 h-7 rounded-[6px] bg-gradient-to-tr from-primary to-primary-hover flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm border border-white/10">
          {getInitials(clinic.name)}
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden flex-1"
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {clinic.name}
                </span>
                {clinic.isPro && (
                  <span className="text-[10px] font-bold px-1.5 py-px bg-primary/10 text-primary border border-primary/20 rounded-md">
                    PRO
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Navigation ────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5 relative scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            {/* Section label — hidden when collapsed */}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="px-2 mb-1.5"
                >
                  <span className="text-[10px] font-bold uppercase text-text-muted/70 tracking-[0.08em] select-none">
                    {group.label}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Nav items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  {...item}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <div className="px-3 py-4 space-y-1 relative z-10 border-t border-border/50 bg-surface/50 backdrop-blur-sm">
        {/* Trust signal */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 pb-3"
            >
              <div className="flex items-center gap-2 text-[10px] text-text-muted/80 font-medium">
                <Shield size={12} className="text-success opacity-80" />
                <span className="truncate">HIPAA-conscious & encrypted</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme toggle */}
        <Tooltip content={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} placement="right">
          <button
            onClick={toggleTheme}
            className={cn(
              'sidebar-item w-full',
              sidebarCollapsed && 'justify-center px-0'
            )}
          >
            {theme === 'light' ? <Moon size={15} strokeWidth={2.2} /> : <Sun size={15} strokeWidth={2.2} />}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap ml-1 text-[13px] font-medium"
                >
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>

        {/* Collapse toggle */}
        <Tooltip content={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <button
            onClick={toggleSidebar}
            className={cn(
              'sidebar-item w-full',
              sidebarCollapsed && 'justify-center px-0'
            )}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={15} strokeWidth={2.2} /> : <PanelLeftClose size={15} strokeWidth={2.2} />}
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden whitespace-nowrap ml-1 text-[13px] font-medium"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </Tooltip>

        {/* User info + Logout */}
        <div className={cn(
          'flex items-center gap-2 mt-2 px-1.5 py-1.5 rounded-lg border border-transparent hover:border-border/50 hover:bg-surface-secondary/50 transition-all cursor-pointer group',
          sidebarCollapsed ? 'justify-center' : ''
        )}>
          <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-text-primary text-[11px] font-bold flex-shrink-0 shadow-sm">
            {getInitials(user?.name ?? 'Admin')}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden ml-0.5"
              >
                <div className="text-[13px] font-semibold text-text-primary truncate leading-tight">{user?.name}</div>
                <div className="text-[11px] text-text-muted truncate leading-tight">{user?.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!sidebarCollapsed && (
            <Tooltip content="Logout" placement="left">
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 p-1.5 rounded-md transition-all duration-200"
              >
                <LogOut size={14} strokeWidth={2.5} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

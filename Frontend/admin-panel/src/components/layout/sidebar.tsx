import { Link, useRouterState } from '@tanstack/react-router';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { useAuth } from '@/features/auth/auth-context';
import { hasPermission } from '@/app/permissions';
import { cn } from '@/lib/utils';
import { NAV_GROUPS, type NavItem } from './nav-config';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function isActive(currentPath: string, target: string): boolean {
  if (target === '/') return currentPath === '/';
  return currentPath === target || currentPath.startsWith(target + '/');
}

function NavItemLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  const link = (
    <Link
      to={item.to}
      className={cn(
        'group relative flex items-center gap-2.5 h-7 px-2 text-xs rounded-[6px] transition-colors',
        active
          ? 'bg-[var(--color-elevated)] text-[var(--color-primary)]'
          : 'text-[var(--color-tertiary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-elevated)]',
        collapsed && 'justify-center px-0',
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-[2px] rounded-r-full bg-[var(--color-accent)]"
        />
      )}
      <Icon className="size-3.5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.hint && (
        <span className="ml-auto text-[10px] text-[var(--color-tertiary)]">{item.hint}</span>
      )}
    </Link>
  );
  if (collapsed) {
    return (
      <Tooltip delayDuration={120}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggle = useUiStore((s) => s.toggleSidebar);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full border-r border-[var(--color-border-subtle)] bg-[var(--color-canvas)]',
        'transition-[width] duration-200 ease-out',
        collapsed ? 'w-[58px]' : 'w-[232px]',
      )}
      aria-label="Primary navigation"
    >
      {/* Brand */}
      <div className={cn('flex items-center h-12 px-3 gap-2 border-b border-[var(--color-border-subtle)]')}>
        <div className="grid place-items-center w-7 h-7 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)]">
          <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
              d="M9 7v18h14"
              stroke="var(--color-accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="23" cy="9" r="2.5" fill="var(--color-accent)" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Linor</span>
            <span className="text-[10px] text-[var(--color-tertiary)] mt-0.5">Super Admin</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (i) => !i.permission || (user && hasPermission(user.role, i.permission)),
          );
          if (items.length === 0) return null;
          return (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-2 mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-tertiary)]">
                  {group.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item.to}>
                    <NavItemLink
                      item={item}
                      collapsed={collapsed}
                      active={isActive(path, item.to)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-[var(--color-border-subtle)]">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full justify-center"
        >
          {collapsed ? <ChevronsRight className="size-3.5" /> : <ChevronsLeft className="size-3.5" />}
        </Button>
      </div>
    </aside>
  );
}

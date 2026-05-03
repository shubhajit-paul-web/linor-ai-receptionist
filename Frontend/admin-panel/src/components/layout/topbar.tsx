import { Bell, LogOut, Search, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUiStore } from '@/stores/ui-store';
import { useAuth } from '@/features/auth/auth-context';
import { ROLES } from '@/app/permissions';
import { Badge } from '@/components/ui/badge';

function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Theme">
          {theme === 'light' ? (
            <Sun className="size-3.5" />
          ) : theme === 'system' ? (
            <Monitor className="size-3.5" />
          ) : (
            <Moon className="size-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? 'system'} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DensityMenuItems />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DensityMenuItems() {
  const density = useUiStore((s) => s.density);
  const setDensity = useUiStore((s) => s.setDensity);
  return (
    <DropdownMenuRadioGroup value={density} onValueChange={(v) => setDensity(v as typeof density)}>
      <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="cozy">Cozy</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}

function UserMenu() {
  const { user, signOut, switchRole } = useAuth();
  if (!user) return null;
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-[6px] hover:bg-[var(--color-elevated)] transition-colors"
          aria-label="Account menu"
        >
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start leading-none">
            <span className="text-xs font-medium">{user.name}</span>
            <span className="text-[10px] text-[var(--color-tertiary)] mt-0.5">{user.role}</span>
          </div>
          <ChevronDown className="size-3 text-[var(--color-tertiary)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <div className="px-2 pb-2 text-xs">
          <div className="font-medium text-[var(--color-primary)]">{user.name}</div>
          <div className="text-[var(--color-tertiary)]">{user.email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Switch role (demo)</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={user.role} onValueChange={(v) => switchRole(v as typeof user.role)}>
          {ROLES.map((r) => (
            <DropdownMenuRadioItem key={r} value={r}>
              {r}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut()}>
          <LogOut className="size-3.5" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Topbar() {
  const toggleCommand = useUiStore((s) => s.toggleCommand);
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
  return (
    <header
      className="flex items-center h-12 px-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas)] gap-3"
      aria-label="Top bar"
    >
      <button
        onClick={toggleCommand}
        className="flex items-center gap-2 h-7 pl-2 pr-2 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)] text-xs text-[var(--color-tertiary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-secondary)] transition-colors min-w-[260px]"
      >
        <Search className="size-3.5" />
        <span>Search hospitals, users, actions…</span>
        <span className="ml-auto flex items-center gap-1">
          <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Badge tone="success" className="hidden sm:inline-flex">
          <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
          All systems operational
        </Badge>

        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <Bell className="size-3.5" />
        </Button>

        <ThemeMenu />

        <UserMenu />
      </div>
    </header>
  );
}

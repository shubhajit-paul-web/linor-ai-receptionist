import { Command } from 'cmdk';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import {
  Building2,
  Compass,
  CornerDownLeft,
  Bot,
  Users,
  MessagesSquare,
  Phone,
  ChartLine,
  FileText,
  Settings,
  Search,
} from 'lucide-react';
import { useUiStore } from '@/stores/ui-store';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { listHospitals } from '@/lib/api/operations';
import { apiCall } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/kbd';

interface CommandTarget {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: typeof Compass;
  to: string;
}

const STATIC_NAV: CommandTarget[] = [
  { id: 'overview', group: 'Navigate', icon: Compass, label: 'Overview', to: '/' },
  { id: 'hospitals', group: 'Navigate', icon: Building2, label: 'Hospitals', to: '/hospitals' },
  { id: 'users', group: 'Navigate', icon: Users, label: 'Users', to: '/users' },
  { id: 'agents', group: 'Navigate', icon: Bot, label: 'AI Agents', to: '/agents' },
  { id: 'conversations', group: 'Navigate', icon: MessagesSquare, label: 'Conversations', to: '/conversations' },
  { id: 'calls', group: 'Navigate', icon: Phone, label: 'Calls', to: '/calls' },
  { id: 'analytics', group: 'Navigate', icon: ChartLine, label: 'Analytics', to: '/analytics' },
  { id: 'audit', group: 'Navigate', icon: FileText, label: 'Audit Log', to: '/audit' },
  { id: 'settings', group: 'Navigate', icon: Settings, label: 'Settings', to: '/settings' },
];

export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const toggle = useUiStore((s) => s.toggleCommand);
  const navigate = useNavigate();

  // Global hotkey
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  const { data: hospitals } = useQuery({
    queryKey: ['command', 'hospitals'],
    queryFn: () => apiCall(listHospitals, { pageSize: 50 }),
    enabled: open,
  });

  const hospitalTargets = useMemo<CommandTarget[]>(() => {
    if (!hospitals) return [];
    return hospitals.items.map((h) => ({
      id: `h-${h.id}`,
      group: 'Hospitals',
      icon: Building2,
      label: h.name,
      hint: h.planTier,
      to: `/hospitals/${h.id}`,
    }));
  }, [hospitals]);

  const grouped = useMemo(() => {
    const all = [...STATIC_NAV, ...hospitalTargets];
    const map = new Map<string, CommandTarget[]>();
    for (const t of all) {
      const arr = map.get(t.group) ?? [];
      arr.push(t);
      map.set(t.group, arr);
    }
    return [...map.entries()];
  }, [hospitalTargets]);

  function handleSelect(to: string) {
    setOpen(false);
    void navigate({ to });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-xl">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Jump to any page, hospital, or action.
        </DialogDescription>
        <Command
          className="bg-[var(--color-elevated)]"
          loop
          filter={(value, search) => {
            if (!search) return 1;
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <div className="flex items-center gap-2 px-3 h-11 border-b border-[var(--color-border-subtle)]">
            <Search className="size-4 text-[var(--color-tertiary)]" />
            <Command.Input
              placeholder="Search hospitals, pages, actions…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-tertiary)]"
            />
            <Kbd>esc</Kbd>
          </div>

          <Command.List className="max-h-[420px] overflow-y-auto p-1.5">
            <Command.Empty className="px-3 py-8 text-center text-xs text-[var(--color-tertiary)]">
              No results.
            </Command.Empty>
            {grouped.map(([group, items]) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-tertiary)]"
              >
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.hint ?? ''}`}
                      onSelect={() => handleSelect(item.to)}
                      className={cn(
                        'flex items-center gap-2.5 h-8 px-2 rounded-[6px] text-xs cursor-default',
                        'data-[selected=true]:bg-[var(--color-overlay)]',
                      )}
                    >
                      <Icon className="size-3.5 text-[var(--color-tertiary)]" />
                      <span className="text-[var(--color-primary)]">{item.label}</span>
                      {item.hint && (
                        <span className="ml-auto text-[10px] text-[var(--color-tertiary)]">{item.hint}</span>
                      )}
                      <CornerDownLeft className="size-3 text-[var(--color-tertiary)] data-[selected=true]:opacity-100 opacity-0" />
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

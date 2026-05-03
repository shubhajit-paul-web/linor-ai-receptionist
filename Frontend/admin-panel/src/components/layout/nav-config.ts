import {
  Activity,
  AlertTriangle,
  Banknote,
  Bell,
  Bot,
  Building2,
  CalendarClock,
  ChartLine,
  CircleDot,
  Compass,
  FileLock2,
  FileText,
  FlaskConical,
  Flag,
  GalleryVerticalEnd,
  Headphones,
  KeyRound,
  LifeBuoy,
  MessagesSquare,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Permission } from '@/app/permissions';

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Optional permission gate. Items the user cannot access are hidden. */
  permission?: Permission;
  /** Optional hint badge — e.g. "New", "Beta". */
  hint?: string;
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', to: '/', icon: Compass },
      { label: 'Hospitals', to: '/hospitals', icon: Building2, permission: 'hospitals.read' },
      { label: 'Branches', to: '/branches', icon: GalleryVerticalEnd, permission: 'hospitals.read' },
      { label: 'Users', to: '/users', icon: Users, permission: 'users.read' },
      { label: 'AI Agents', to: '/agents', icon: Bot, permission: 'agents.read' },
    ],
  },
  {
    label: 'Activity',
    items: [
      {
        label: 'Conversations',
        to: '/conversations',
        icon: MessagesSquare,
        permission: 'conversations.read',
      },
      { label: 'Calls', to: '/calls', icon: Phone, permission: 'calls.read' },
      { label: 'Analytics', to: '/analytics', icon: ChartLine, permission: 'hospitals.read' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Billing', to: '/billing', icon: Banknote, permission: 'billing.read' },
      { label: 'Infrastructure', to: '/infra', icon: Activity, permission: 'infra.read' },
      { label: 'Incidents', to: '/incidents', icon: AlertTriangle, permission: 'incidents.read' },
    ],
  },
  {
    label: 'Governance',
    items: [
      { label: 'Audit Log', to: '/audit', icon: FileText, permission: 'audit.read' },
      { label: 'Feature Flags', to: '/flags', icon: Flag, permission: 'flags.read' },
      { label: 'Announcements', to: '/announcements', icon: Bell, permission: 'announcements.read' },
      { label: 'Support', to: '/support', icon: LifeBuoy, permission: 'hospitals.impersonate' },
      { label: 'API Keys', to: '/api-keys', icon: KeyRound, permission: 'apikeys.read' },
      { label: 'Compliance', to: '/compliance', icon: ShieldCheck, permission: 'compliance.read' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', to: '/settings', icon: Settings, permission: 'settings.read' },
    ],
  },
];

// Re-export for command palette and quick actions
export const QUICK_ICONS = {
  Sparkles,
  CalendarClock,
  CircleDot,
  Bell,
  FlaskConical,
  Headphones,
  FileLock2,
};

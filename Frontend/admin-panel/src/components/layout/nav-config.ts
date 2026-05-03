import {
  Bot,
  Building2,
  ChartLine,
  Compass,
  FileText,
  MessagesSquare,
  Phone,
  Settings,
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
    label: 'System',
    items: [
      { label: 'Audit Log', to: '/audit', icon: FileText, permission: 'audit.read' },
      { label: 'Settings', to: '/settings', icon: Settings, permission: 'settings.read' },
    ],
  },
];

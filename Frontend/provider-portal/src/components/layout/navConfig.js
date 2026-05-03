import {
  LayoutDashboard, CalendarCheck, MessageSquare, HelpCircle,
  Sliders, Code2, Building2, Clock, Shield, CreditCard,
} from 'lucide-react';

/**
 * Sidebar navigation. Grouped sections drive both the sidebar
 * and the breadcrumb map in the topbar — single source of truth.
 */
export const NAV_GROUPS = [
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
      { path: '/billing', label: 'Billing', icon: CreditCard, hint: 'Pro' },
    ],
  },
];

/**
 * Build a path → breadcrumbs map derived from NAV_GROUPS.
 * Used by the topbar; avoids duplicating navigation knowledge.
 */
export const BREADCRUMB_MAP = NAV_GROUPS.reduce((acc, group) => {
  for (const item of group.items) {
    acc[item.path] = group.label === 'Overview'
      ? [item.label]
      : [group.label, item.label];
  }
  return acc;
}, {});

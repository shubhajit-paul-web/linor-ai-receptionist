/**
 * Linor internal RBAC.
 * Roles map to a set of fine-grained permissions; UI gates on permission, never on role directly,
 * so adding new roles or per-resource overrides later requires only the matrix below.
 */

export const ROLES = ['SuperAdmin', 'OpsAdmin', 'Support', 'Billing', 'ReadOnly'] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  // Tenants
  'hospitals.read',
  'hospitals.write',
  'hospitals.delete',
  'hospitals.impersonate',
  // Users
  'users.read',
  'users.write',
  'users.delete',
  // Agents / KB / Integrations
  'agents.read',
  'agents.write',
  'kb.read',
  'kb.write',
  'integrations.read',
  'integrations.write',
  // Conversations / Calls
  'conversations.read',
  'calls.read',
  // Billing
  'billing.read',
  'billing.write',
  // Infrastructure
  'infra.read',
  'infra.write',
  'incidents.read',
  'incidents.write',
  // Governance
  'audit.read',
  'flags.read',
  'flags.write',
  'announcements.read',
  'announcements.write',
  'apikeys.read',
  'apikeys.write',
  'compliance.read',
  'compliance.write',
  // Roles & team
  'team.read',
  'team.write',
  // Settings
  'settings.read',
  'settings.write',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const READ_ONLY_PERMS: Permission[] = PERMISSIONS.filter((p) => p.endsWith('.read'));

export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  SuperAdmin: new Set(PERMISSIONS),
  OpsAdmin: new Set<Permission>([
    ...PERMISSIONS.filter((p) => !p.startsWith('billing.write') && !p.endsWith('.delete')),
  ]),
  Support: new Set<Permission>([...READ_ONLY_PERMS, 'hospitals.impersonate']),
  Billing: new Set<Permission>([
    ...READ_ONLY_PERMS,
    'billing.read',
    'billing.write',
  ]),
  ReadOnly: new Set<Permission>(READ_ONLY_PERMS),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].has(permission);
}

export function hasAnyPermission(role: Role, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

import { createFileRoute } from '@tanstack/react-router';
import { Palette, Shield, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useUiStore, type Density } from '@/stores/ui-store';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/auth-context';
import { ROLES } from '@/app/permissions';
import { Badge } from '@/components/ui/badge';
import { requirePermissions } from '@/lib/route-guard';
import { SESSION_POLICY, DATA_RETENTION, PASSWORD_POLICY } from '@/lib/compliance';

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  beforeLoad: () => requirePermissions(['settings.read']),
});

function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Workspace, team, appearance, notifications, and security." />

      <Tabs defaultValue="general" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="general">
            <Users className="size-3" /> General
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="size-3" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="size-3" /> Team & roles
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="size-3" /> Security & Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Workspace identity, regions, and default tenant policies.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <AppearancePanel />
        </TabsContent>

        <TabsContent value="team">
          <TeamPanel />
        </TabsContent>

        <TabsContent value="security">
          <SecurityPrivacyPanel />
        </TabsContent>

      </Tabs>
    </div>
  );
}

function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  const density = useUiStore((s) => s.density);
  const setDensity = useUiStore((s) => s.setDensity);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Label>Color scheme</Label>
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)] w-fit">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTheme(t)}
                className="h-7 capitalize"
              >
                {t}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Density</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Label>Row height</Label>
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)] w-fit">
            {(['compact', 'comfortable', 'cozy'] as const).map((d) => (
              <Button
                key={d}
                variant={density === d ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setDensity(d as Density)}
                className="h-7 capitalize"
              >
                {d}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityPrivacyPanel() {
  const phiMasked = useUiStore((s) => s.phiMasked);
  const togglePhiMask = useUiStore((s) => s.togglePhiMask);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <Card>
        <CardHeader>
          <CardTitle>PHI Display</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-xs text-[var(--color-tertiary)] leading-relaxed">
            When enabled, patient names, phone numbers, and emails are masked
            in all data tables. Recommended when screen-sharing or in public areas.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant={phiMasked ? 'primary' : 'secondary'}
              size="sm"
              onClick={togglePhiMask}
            >
              {phiMasked ? 'PHI Masked' : 'PHI Visible'}
            </Button>
            <Badge tone={phiMasked ? 'success' : 'warning'}>
              {phiMasked ? 'Protected' : 'Visible'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Policy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Inactivity warning</span>
            <span>{SESSION_POLICY.warnAfterMinutes} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Auto sign-out</span>
            <span>{SESSION_POLICY.logoutAfterMinutes} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Max session length</span>
            <span>{SESSION_POLICY.maxSessionHours} hours</span>
          </div>
          <p className="text-[10px] text-[var(--color-tertiary)] mt-1">
            Per HIPAA §164.312(a)(2)(iii) — Automatic logoff.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Policy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Min length</span>
            <span>{PASSWORD_POLICY.minLength} characters</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Require uppercase</span>
            <Badge tone={PASSWORD_POLICY.requireUppercase ? 'success' : 'neutral'}>
              {PASSWORD_POLICY.requireUppercase ? 'Yes' : 'No'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Require digit</span>
            <Badge tone={PASSWORD_POLICY.requireDigit ? 'success' : 'neutral'}>
              {PASSWORD_POLICY.requireDigit ? 'Yes' : 'No'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Default retention</span>
            <span>{DATA_RETENTION.defaultYears} years</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Audit logs</span>
            <span>{DATA_RETENTION.auditLogYears} years</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">Session logs</span>
            <span>{DATA_RETENTION.sessionLogDays} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-tertiary)]">PHI access logs</span>
            <span>{DATA_RETENTION.phiAccessLogYears} years</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamPanel() {
  const { user, switchRole } = useAuth();
  if (!user) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles & permissions (demo)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs text-[var(--color-tertiary)] leading-relaxed max-w-prose">
          Switch your demo role to preview which navigation items, actions and resources each role
          can access. Real role assignment runs through the team management flow.
        </p>
        <div className="inline-flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)] w-fit">
          {ROLES.map((r) => (
            <Button
              key={r}
              variant={user.role === r ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => switchRole(r)}
              className="h-7"
            >
              {r}
            </Button>
          ))}
        </div>
        <div>
          <Badge tone="accent">Active role: {user.role}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

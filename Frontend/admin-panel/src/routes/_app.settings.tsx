import { createFileRoute } from '@tanstack/react-router';
import { Bell, KeyRound, Palette, ShieldCheck, Users } from 'lucide-react';
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

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
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
          <TabsTrigger value="notifications">
            <Bell className="size-3" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="size-3" /> Security
          </TabsTrigger>
          <TabsTrigger value="api">
            <KeyRound className="size-3" /> API
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

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Routing rules, severity preferences, and per-channel preferences (email, Slack, Webhook).
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Sessions, MFA, IP allow-list, and audit retention policies.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Global API keys, webhook signing secrets, and rate limit configuration.
            </CardContent>
          </Card>
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

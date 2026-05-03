import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Eye, ShieldAlert } from 'lucide-react';
import { apiCall } from '@/lib/api/client';
import { listHospitals } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/_app/support')({
  component: SupportPage,
});

function SupportPage() {
  const hospitals = useQuery({
    queryKey: ['hospitals', 'support'],
    queryFn: () => apiCall(listHospitals, { pageSize: 25, sort: 'riskScore', dir: 'desc' }),
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Support & Impersonation"
        description="Jump-as-tenant for troubleshooting. Every impersonation event is audited and visible to the customer admin."
      />

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-[var(--color-warning)]" />
            Impersonation policy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-[var(--color-secondary)] leading-relaxed">
          Impersonation grants temporary, scoped access to act on behalf of a hospital admin. A
          persistent banner is shown while impersonating, and all actions are written to the tenant
          audit log with the original Linor actor recorded.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Highest-risk tenants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {hospitals.data
            ? hospitals.data.items.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-2 h-9 px-2 -mx-2 rounded-[6px] hover:bg-[var(--color-elevated)] transition-colors"
                >
                  <div className="grid place-items-center w-7 h-7 rounded-[6px] bg-[var(--color-elevated)] text-[10px] font-medium uppercase text-[var(--color-secondary)]">
                    {h.name.slice(0, 2)}
                  </div>
                  <Link
                    to="/hospitals/$hospitalId"
                    params={{ hospitalId: h.id }}
                    className="text-xs text-[var(--color-primary)] hover:underline underline-offset-4"
                  >
                    {h.name}
                  </Link>
                  <Badge
                    tone={h.riskScore > 70 ? 'danger' : h.riskScore > 40 ? 'warning' : 'neutral'}
                    className="ml-auto"
                  >
                    Risk {h.riskScore}
                  </Badge>
                  <Button variant="secondary" size="sm">
                    <Eye className="size-3" />
                    Impersonate
                  </Button>
                </div>
              ))
            : Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9" />)}
        </CardContent>
      </Card>
    </div>
  );
}

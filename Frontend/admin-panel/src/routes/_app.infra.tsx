import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listIncidents, listServiceHealth } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusDot, type StatusTone } from '@/components/ui/status-dot';
import { DataTable } from '@/components/data-table/data-table';
import { formatPercent } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { Incident, ServiceHealth, ServiceStatus } from '@/lib/schemas';

export const Route = createFileRoute('/_app/infra')({
  component: InfraPage,
});

const SERVICE_TONE: Record<ServiceStatus, StatusTone> = {
  operational: 'success',
  degraded: 'warning',
  'partial-outage': 'warning',
  outage: 'danger',
  maintenance: 'info',
};

function InfraPage() {
  const services = useQuery({
    queryKey: ['infra', 'health'],
    queryFn: () => apiCall(listServiceHealth, undefined),
  });
  const incidents = useQuery({
    queryKey: ['incidents'],
    queryFn: () => apiCall(listIncidents, { pageSize: 50, sort: 'openedAt', dir: 'desc' }),
  });

  const incidentCols = useMemo<ColumnDef<Incident, unknown>[]>(
    () => [
      {
        id: 'severity',
        header: 'Severity',
        accessorKey: 'severity',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.severity === 'SEV-1'
                ? 'danger'
                : row.original.severity === 'SEV-2'
                  ? 'warning'
                  : 'neutral'
            }
          >
            {row.original.severity}
          </Badge>
        ),
      },
      { id: 'title', header: 'Title', accessorKey: 'title' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge tone={row.original.status === 'resolved' ? 'success' : 'warning'}>
            {row.original.status}
          </Badge>
        ),
      },
      { id: 'commander', header: 'Commander', accessorKey: 'commander' },
      {
        id: 'opened',
        header: 'Opened',
        accessorKey: 'openedAt',
        cell: ({ row }) =>
          formatDistanceToNow(new Date(row.original.openedAt), { addSuffix: true }),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Infrastructure"
        description="Service health, latency percentiles, error budgets, and active incidents."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(services.data ?? []).map((s: ServiceHealth) => (
          <Card key={s.id}>
            <CardContent className="flex flex-col gap-3 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot tone={SERVICE_TONE[s.status]} pulse={s.status !== 'operational'} />
                  <span className="text-sm font-medium truncate">{s.name}</span>
                </div>
                <Badge tone="outline">{s.category}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <Stat label="p50" value={`${s.p50LatencyMs}ms`} />
                <Stat label="p95" value={`${s.p95LatencyMs}ms`} />
                <Stat label="p99" value={`${s.p99LatencyMs}ms`} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[var(--color-tertiary)]">
                <span>30d uptime: {formatPercent(s.uptime30d, 2)}</span>
                <span>Error budget: {formatPercent(s.errorBudgetRemaining, 0)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Incidents</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <DataTable
            data={incidents.data?.items ?? []}
            columns={incidentCols}
            isLoading={incidents.isLoading}
            className="border-0 rounded-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-tertiary)]">{label}</span>
      <span className="tabular-nums text-[var(--color-secondary)]">{value}</span>
    </div>
  );
}

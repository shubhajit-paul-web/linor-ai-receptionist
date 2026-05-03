import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listAgents } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { Agent } from '@/lib/schemas';
import { formatPercent } from '@/lib/utils';
import { requirePermissions } from '@/lib/route-guard';

export const Route = createFileRoute('/_app/agents')({
  component: AgentsPage,
  beforeLoad: () => requirePermissions(['agents.read']),
});

function AgentsPage() {
  const query = useQuery({
    queryKey: ['agents', 'all'],
    queryFn: () => apiCall(listAgents, { pageSize: 500 }),
  });

  const columns = useMemo<ColumnDef<Agent, unknown>[]>(
    () => [
      { id: 'name', header: 'Agent', accessorKey: 'name' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'live'
                ? 'success'
                : row.original.status === 'training'
                  ? 'info'
                  : row.original.status === 'paused'
                    ? 'warning'
                    : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'channels',
        header: 'Channels',
        accessorKey: 'channels',
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.channels.map((c) => (
              <Badge key={c} tone="outline">
                {c}
              </Badge>
            ))}
          </div>
        ),
      },
      { id: 'model', header: 'Model', accessorKey: 'model' },
      { id: 'voice', header: 'Voice', accessorKey: 'voice' },
      { id: 'lang', header: 'Language', accessorKey: 'language' },
      {
        id: 'lat',
        header: 'p50 latency',
        accessorKey: 'avgLatencyMs',
        cell: ({ row }) => `${row.original.avgLatencyMs}ms`,
      },
      {
        id: 'success',
        header: 'Success',
        accessorKey: 'successRate',
        cell: ({ row }) => formatPercent(row.original.successRate, 1),
      },
      {
        id: 'csat',
        header: 'CSAT',
        accessorKey: 'csat',
        cell: ({ row }) => row.original.csat.toFixed(2),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Agents"
        description="Receptionist instances across every tenant — models, voices, channels, and live quality metrics."
      />
      <DataTable data={query.data?.items ?? []} columns={columns} isLoading={query.isLoading} />
    </div>
  );
}

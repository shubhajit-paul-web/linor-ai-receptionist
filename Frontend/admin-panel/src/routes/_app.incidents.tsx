import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listIncidents } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import type { Incident } from '@/lib/schemas';

export const Route = createFileRoute('/_app/incidents')({
  component: IncidentsPage,
});

function IncidentsPage() {
  const q = useQuery({
    queryKey: ['incidents', 'all'],
    queryFn: () => apiCall(listIncidents, { pageSize: 100, sort: 'openedAt', dir: 'desc' }),
  });
  const cols = useMemo<ColumnDef<Incident, unknown>[]>(
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
      {
        id: 'opened',
        header: 'Opened',
        accessorKey: 'openedAt',
        cell: ({ row }) => format(new Date(row.original.openedAt), 'MMM d, HH:mm'),
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorKey: 'resolvedAt',
        cell: ({ row }) =>
          row.original.resolvedAt
            ? formatDistanceToNow(new Date(row.original.openedAt), { addSuffix: false })
            : 'Ongoing',
      },
      { id: 'commander', header: 'Commander', accessorKey: 'commander' },
    ],
    [],
  );
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Incidents" description="Severity timeline with affected services and on-call commander." />
      <DataTable data={q.data?.items ?? []} columns={cols} isLoading={q.isLoading} />
    </div>
  );
}

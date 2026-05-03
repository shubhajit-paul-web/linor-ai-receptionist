import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { apiCall } from '@/lib/api/client';
import { listAuditEvents } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { AuditEvent } from '@/lib/schemas';
import { format } from 'date-fns';

export const Route = createFileRoute('/_app/audit')({
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState('');
  const query = useQuery({
    queryKey: ['audit', { q }],
    queryFn: () => apiCall(listAuditEvents, { q: q || undefined, pageSize: 200 }),
  });

  const cols = useMemo<ColumnDef<AuditEvent, unknown>[]>(
    () => [
      {
        id: 'when',
        header: 'When',
        accessorKey: 'occurredAt',
        cell: ({ row }) => format(new Date(row.original.occurredAt), 'MMM d, HH:mm:ss'),
      },
      { id: 'actor', header: 'Actor', accessorKey: 'actorName' },
      { id: 'role', header: 'Role', accessorKey: 'actorRole' },
      {
        id: 'action',
        header: 'Action',
        accessorKey: 'action',
        cell: ({ row }) => <Badge tone="outline">{row.original.action}</Badge>,
      },
      { id: 'resource', header: 'Resource', accessorKey: 'resourceType' },
      { id: 'ip', header: 'IP', accessorKey: 'ip' },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Audit log"
        description="Every state change in the platform — searchable, filterable, with a diff viewer for config events."
      />
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="size-3.5 text-[var(--color-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search action, actor, resource…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8 w-72"
          />
        </div>
      </div>
      <DataTable data={query.data?.items ?? []} columns={cols} isLoading={query.isLoading} />
    </div>
  );
}

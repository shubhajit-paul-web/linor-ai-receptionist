import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listApiKeys } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { ApiKey } from '@/lib/schemas';
import { format, formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/_app/api-keys')({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  const q = useQuery({ queryKey: ['apikeys'], queryFn: () => apiCall(listApiKeys, { pageSize: 100 }) });
  const cols = useMemo<ColumnDef<ApiKey, unknown>[]>(
    () => [
      { id: 'name', header: 'Name', accessorKey: 'name' },
      {
        id: 'prefix',
        header: 'Key',
        accessorKey: 'prefix',
        cell: ({ row }) => (
          <span className="font-mono text-[10px] text-[var(--color-secondary)]">
            {row.original.prefix}…
          </span>
        ),
      },
      {
        id: 'scopes',
        header: 'Scopes',
        accessorKey: 'scopes',
        cell: ({ row }) => (
          <div className="flex gap-1 flex-wrap">
            {row.original.scopes.map((s) => (
              <Badge key={s} tone="outline">
                {s}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: 'last',
        header: 'Last used',
        accessorKey: 'lastUsedAt',
        cell: ({ row }) =>
          row.original.lastUsedAt
            ? formatDistanceToNow(new Date(row.original.lastUsedAt), { addSuffix: true })
            : '—',
      },
      {
        id: 'created',
        header: 'Created',
        accessorKey: 'createdAt',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'revoked',
        cell: ({ row }) => (
          <Badge tone={row.original.revoked ? 'danger' : 'success'}>
            {row.original.revoked ? 'Revoked' : 'Active'}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="API keys & webhooks"
        description="Global keys, signing secrets, and webhook delivery logs."
      />
      <DataTable data={q.data?.items ?? []} columns={cols} isLoading={q.isLoading} />
    </div>
  );
}

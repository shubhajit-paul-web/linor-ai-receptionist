import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listFeatureFlags } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { FeatureFlag } from '@/lib/schemas';
import { formatDistanceToNow } from 'date-fns';

export const Route = createFileRoute('/_app/flags')({
  component: FlagsPage,
});

function FlagsPage() {
  const q = useQuery({
    queryKey: ['flags'],
    queryFn: () => apiCall(listFeatureFlags, { pageSize: 100 }),
  });

  const cols = useMemo<ColumnDef<FeatureFlag, unknown>[]>(
    () => [
      {
        id: 'key',
        header: 'Key',
        accessorKey: 'key',
        cell: ({ row }) => (
          <span className="font-mono text-[10px] text-[var(--color-secondary)]">{row.original.key}</span>
        ),
      },
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[var(--color-primary)]">{row.original.name}</span>
            <span className="text-[10px] text-[var(--color-tertiary)] truncate max-w-[320px]">
              {row.original.description}
            </span>
          </div>
        ),
      },
      {
        id: 'env',
        header: 'Env',
        accessorKey: 'environment',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.environment === 'production'
                ? 'success'
                : row.original.environment === 'staging'
                  ? 'warning'
                  : 'neutral'
            }
          >
            {row.original.environment}
          </Badge>
        ),
      },
      {
        id: 'enabled',
        header: 'Enabled',
        accessorKey: 'enabled',
        cell: ({ row }) => (
          <Badge tone={row.original.enabled ? 'success' : 'neutral'}>
            {row.original.enabled ? 'On' : 'Off'}
          </Badge>
        ),
      },
      {
        id: 'rollout',
        header: 'Rollout',
        accessorKey: 'rolloutPct',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-1 w-20 bg-[var(--color-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--color-accent)]"
                style={{ width: `${row.original.rolloutPct}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-tertiary)] tabular-nums">
              {row.original.rolloutPct}%
            </span>
          </div>
        ),
      },
      {
        id: 'updated',
        header: 'Updated',
        accessorKey: 'updatedAt',
        cell: ({ row }) =>
          formatDistanceToNow(new Date(row.original.updatedAt), { addSuffix: true }),
      },
      { id: 'by', header: 'By', accessorKey: 'updatedBy' },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Feature flags"
        description="Cross-tenant rollouts with percent gating and per-hospital targeting."
      />
      <DataTable data={q.data?.items ?? []} columns={cols} isLoading={q.isLoading} />
    </div>
  );
}

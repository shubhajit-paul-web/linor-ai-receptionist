import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { apiCall } from '@/lib/api/client';
import { listUsers } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User, UserScope } from '@/lib/schemas';
import { format } from 'date-fns';

export const Route = createFileRoute('/_app/users')({
  component: UsersPage,
});

function UsersPage() {
  const [q, setQ] = useState('');
  const [scope, setScope] = useState<UserScope | null>(null);
  const query = useQuery({
    queryKey: ['users', { q, scope }],
    queryFn: () => apiCall(listUsers, { q: q || undefined, ...(scope ? { scope } : {}), pageSize: 200 }),
  });

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[var(--color-primary)]">{row.original.name}</span>
            <span className="text-[10px] text-[var(--color-tertiary)]">{row.original.email}</span>
          </div>
        ),
      },
      {
        id: 'scope',
        header: 'Scope',
        accessorKey: 'scope',
        cell: ({ row }) => (
          <Badge tone={row.original.scope === 'linor' ? 'accent' : 'neutral'}>
            {row.original.scope === 'linor' ? 'Internal' : 'Hospital'}
          </Badge>
        ),
      },
      { id: 'role', header: 'Role', accessorKey: 'role' },
      { id: 'title', header: 'Title', accessorKey: 'title' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'active'
                ? 'success'
                : row.original.status === 'invited'
                  ? 'info'
                  : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'mfa',
        header: 'MFA',
        accessorKey: 'mfaEnabled',
        cell: ({ row }) => (row.original.mfaEnabled ? 'On' : 'Off'),
      },
      {
        id: 'lastSeen',
        header: 'Last seen',
        accessorKey: 'lastSeenAt',
        cell: ({ row }) =>
          row.original.lastSeenAt ? format(new Date(row.original.lastSeenAt), 'MMM d, HH:mm') : '—',
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description="Internal Linor staff and hospital staff across every tenant."
        meta={
          <span className="text-xs text-[var(--color-tertiary)]">
            <span className="text-[var(--color-secondary)] font-medium">
              {query.data?.pagination.total ?? 0}
            </span>{' '}
            total
          </span>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="size-3.5 text-[var(--color-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8 w-72"
          />
        </div>
        <div className="inline-flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)]">
          <Button variant={scope === null ? 'secondary' : 'ghost'} size="sm" onClick={() => setScope(null)} className="h-6">
            All
          </Button>
          <Button variant={scope === 'linor' ? 'secondary' : 'ghost'} size="sm" onClick={() => setScope('linor')} className="h-6">
            Internal
          </Button>
          <Button
            variant={scope === 'hospital' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setScope('hospital')}
            className="h-6"
          >
            Hospital
          </Button>
        </div>
      </div>

      <DataTable data={query.data?.items ?? []} columns={columns} isLoading={query.isLoading} />
    </div>
  );
}

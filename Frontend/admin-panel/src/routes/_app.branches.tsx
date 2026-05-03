import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listBranches } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { Branch } from '@/lib/schemas';

export const Route = createFileRoute('/_app/branches')({
  component: BranchesPage,
});

function BranchesPage() {
  const query = useQuery({
    queryKey: ['branches', 'global'],
    queryFn: () => apiCall(listBranches, { pageSize: 500 }),
  });

  const columns = useMemo<ColumnDef<Branch, unknown>[]>(
    () => [
      { id: 'name', header: 'Branch', accessorKey: 'name' },
      { id: 'city', header: 'City', accessorKey: 'city' },
      { id: 'country', header: 'Country', accessorKey: 'country' },
      { id: 'tz', header: 'Timezone', accessorKey: 'timezone' },
      { id: 'beds', header: 'Beds', accessorKey: 'beds' },
      { id: 'staff', header: 'Staff', accessorKey: 'staffCount' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge tone={row.original.status === 'active' ? 'success' : 'neutral'}>{row.original.status}</Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Branches"
        description="Every branch across every tenant. Filter by region, status, or beds."
      />
      <DataTable data={query.data?.items ?? []} columns={columns} isLoading={query.isLoading} />
    </div>
  );
}

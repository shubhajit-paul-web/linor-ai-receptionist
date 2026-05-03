import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listComplianceControls } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { ComplianceControl } from '@/lib/schemas';
import { format } from 'date-fns';

export const Route = createFileRoute('/_app/compliance')({
  component: CompliancePage,
});

function CompliancePage() {
  const q = useQuery({
    queryKey: ['compliance'],
    queryFn: () => apiCall(listComplianceControls, { pageSize: 200 }),
  });
  const cols = useMemo<ColumnDef<ComplianceControl, unknown>[]>(
    () => [
      {
        id: 'framework',
        header: 'Framework',
        accessorKey: 'framework',
        cell: ({ row }) => <Badge tone="accent">{row.original.framework}</Badge>,
      },
      { id: 'controlId', header: 'Control', accessorKey: 'controlId' },
      {
        id: 'title',
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[var(--color-primary)]">{row.original.title}</span>
            <span className="text-[10px] text-[var(--color-tertiary)] truncate max-w-md">
              {row.original.description}
            </span>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'compliant'
                ? 'success'
                : row.original.status === 'in-progress'
                  ? 'warning'
                  : row.original.status === 'gap'
                    ? 'danger'
                    : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      { id: 'owner', header: 'Owner', accessorKey: 'owner' },
      { id: 'evidence', header: 'Evidence', accessorKey: 'evidenceCount' },
      {
        id: 'reviewed',
        header: 'Last review',
        accessorKey: 'lastReviewedAt',
        cell: ({ row }) => format(new Date(row.original.lastReviewedAt), 'MMM d, yyyy'),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Compliance"
        description="HIPAA, SOC 2, GDPR, ISO 27001 controls — status, owners, evidence, and review cadence."
      />
      <DataTable data={q.data?.items ?? []} columns={cols} isLoading={q.isLoading} />
    </div>
  );
}

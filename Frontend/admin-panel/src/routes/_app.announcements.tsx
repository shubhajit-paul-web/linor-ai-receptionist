import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listAnnouncements } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { Announcement } from '@/lib/schemas';
import { format } from 'date-fns';

export const Route = createFileRoute('/_app/announcements')({
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const q = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiCall(listAnnouncements, { pageSize: 100 }),
  });

  const cols = useMemo<ColumnDef<Announcement, unknown>[]>(
    () => [
      {
        id: 'severity',
        header: 'Severity',
        accessorKey: 'severity',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.severity === 'critical'
                ? 'danger'
                : row.original.severity === 'warning'
                  ? 'warning'
                  : 'info'
            }
          >
            {row.original.severity}
          </Badge>
        ),
      },
      {
        id: 'title',
        header: 'Title',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-[var(--color-primary)]">{row.original.title}</span>
            <span className="text-[10px] text-[var(--color-tertiary)] truncate max-w-md">
              {row.original.body}
            </span>
          </div>
        ),
      },
      { id: 'audience', header: 'Audience', accessorKey: 'audience' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'publishedAt',
        cell: ({ row }) =>
          row.original.publishedAt ? (
            <Badge tone="success">Published</Badge>
          ) : row.original.scheduledFor ? (
            <Badge tone="info">Scheduled</Badge>
          ) : (
            <Badge tone="neutral">Draft</Badge>
          ),
      },
      {
        id: 'when',
        header: 'When',
        accessorKey: 'createdAt',
        cell: ({ row }) => format(new Date(row.original.createdAt), 'MMM d, yyyy'),
      },
      { id: 'by', header: 'By', accessorKey: 'createdBy' },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Announcements"
        description="Compose, schedule, and target broadcasts to specific tenants or admin audiences."
      />
      <DataTable data={q.data?.items ?? []} columns={cols} isLoading={q.isLoading} />
    </div>
  );
}

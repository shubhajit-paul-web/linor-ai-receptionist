import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { apiCall } from '@/lib/api/client';
import { listConversations } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Conversation } from '@/lib/schemas';
import { format } from 'date-fns';

export const Route = createFileRoute('/_app/conversations')({
  component: ConversationsPage,
});

function ConversationsPage() {
  const [q, setQ] = useState('');
  const query = useQuery({
    queryKey: ['conversations', 'global', { q }],
    queryFn: () =>
      apiCall(listConversations, {
        q: q || undefined,
        pageSize: 200,
        sort: 'startedAt',
        dir: 'desc',
      }),
  });

  const columns = useMemo<ColumnDef<Conversation, unknown>[]>(
    () => [
      {
        id: 'started',
        header: 'Started',
        accessorKey: 'startedAt',
        cell: ({ row }) => format(new Date(row.original.startedAt), 'MMM d, HH:mm'),
      },
      { id: 'patient', header: 'Patient', accessorKey: 'patientName' },
      { id: 'channel', header: 'Channel', accessorKey: 'channel' },
      { id: 'topic', header: 'Topic', accessorKey: 'topic' },
      {
        id: 'sentiment',
        header: 'Sentiment',
        accessorKey: 'sentiment',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.sentiment === 'positive'
                ? 'success'
                : row.original.sentiment === 'negative'
                  ? 'danger'
                  : 'neutral'
            }
          >
            {row.original.sentiment}
          </Badge>
        ),
      },
      {
        id: 'outcome',
        header: 'Outcome',
        accessorKey: 'outcome',
        cell: ({ row }) => <Badge tone="outline">{row.original.outcome}</Badge>,
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorKey: 'durationSec',
        cell: ({ row }) => `${Math.round(row.original.durationSec / 60)}m`,
      },
      {
        id: 'csat',
        header: 'CSAT',
        accessorKey: 'csat',
        cell: ({ row }) => row.original.csat?.toFixed(1) ?? '—',
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Conversations"
        description="Cross-tenant transcript browser. Sort, search, and filter by sentiment, outcome, channel."
        meta={
          <span className="text-xs text-[var(--color-tertiary)]">
            <span className="text-[var(--color-secondary)] font-medium">
              {query.data?.pagination.total ?? 0}
            </span>{' '}
            shown
          </span>
        }
      />
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="size-3.5 text-[var(--color-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by patient or topic…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8 w-72"
          />
        </div>
      </div>
      <DataTable data={query.data?.items ?? []} columns={columns} isLoading={query.isLoading} />
    </div>
  );
}

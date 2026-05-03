import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listCalls } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import type { Call } from '@/lib/schemas';
import { format } from 'date-fns';
import { formatPercent } from '@/lib/utils';

export const Route = createFileRoute('/_app/calls')({
  component: CallsPage,
});

function CallsPage() {
  const query = useQuery({
    queryKey: ['calls', 'global'],
    queryFn: () => apiCall(listCalls, { pageSize: 200, sort: 'startedAt', dir: 'desc' }),
  });

  const columns = useMemo<ColumnDef<Call, unknown>[]>(
    () => [
      {
        id: 'started',
        header: 'Started',
        accessorKey: 'startedAt',
        cell: ({ row }) => format(new Date(row.original.startedAt), 'MMM d, HH:mm'),
      },
      { id: 'from', header: 'From', accessorKey: 'fromNumber' },
      { id: 'to', header: 'To', accessorKey: 'toNumber' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'completed'
                ? 'success'
                : row.original.status === 'failed'
                  ? 'danger'
                  : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'duration',
        header: 'Duration',
        accessorKey: 'durationSec',
        cell: ({ row }) => `${Math.round(row.original.durationSec / 60)}m ${row.original.durationSec % 60}s`,
      },
      {
        id: 'asr',
        header: 'ASR',
        accessorKey: 'asrConfidence',
        cell: ({ row }) => formatPercent(row.original.asrConfidence, 1),
      },
      {
        id: 'tts',
        header: 'TTS',
        accessorKey: 'ttsLatencyMs',
        cell: ({ row }) => `${row.original.ttsLatencyMs}ms`,
      },
      {
        id: 'llm',
        header: 'LLM',
        accessorKey: 'llmLatencyMs',
        cell: ({ row }) => `${row.original.llmLatencyMs}ms`,
      },
      {
        id: 'e2e',
        header: 'p50 e2e',
        accessorKey: 'endToEndLatencyMs',
        cell: ({ row }) => `${row.original.endToEndLatencyMs}ms`,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Calls"
        description="Voice call ledger across all tenants — ASR confidence, TTS / LLM / e2e latency, and recording links."
      />
      <DataTable data={query.data?.items ?? []} columns={columns} isLoading={query.isLoading} />
    </div>
  );
}

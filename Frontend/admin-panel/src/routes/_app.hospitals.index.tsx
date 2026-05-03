import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Building2, Filter, Plus, Search } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { apiCall } from '@/lib/api/client';
import { listHospitals } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { DataTable } from '@/components/data-table/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusDot, type StatusTone } from '@/components/ui/status-dot';
import { EmptyState } from '@/components/feedback/empty-state';
import { formatCompact, formatCurrency, formatPercent } from '@/lib/utils';
import type { Hospital, HospitalStatus, PlanTier } from '@/lib/schemas';
import { requirePermissions } from '@/lib/route-guard';

export const Route = createFileRoute('/_app/hospitals/')({
  component: HospitalsListPage,
  beforeLoad: () => requirePermissions(['hospitals.read']),
});

const STATUS_TONE: Record<HospitalStatus, StatusTone> = {
  active: 'success',
  trialing: 'info',
  paused: 'warning',
  suspended: 'danger',
  archived: 'neutral',
};

const PLAN_TONE: Record<PlanTier, 'neutral' | 'accent' | 'info' | 'success'> = {
  Starter: 'neutral',
  Growth: 'info',
  Scale: 'accent',
  Enterprise: 'success',
};

const STATUSES: HospitalStatus[] = ['active', 'trialing', 'paused', 'suspended', 'archived'];

function HospitalsListPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<HospitalStatus | null>(null);

  const query = useQuery({
    queryKey: ['hospitals', { q, statusFilter }],
    queryFn: () =>
      apiCall(listHospitals, {
        q: q || undefined,
        pageSize: 100,
        ...(statusFilter ? { filters: { status: statusFilter } } : {}),
      }),
  });

  const columns = useMemo<ColumnDef<Hospital, unknown>[]>(
    () => [
      {
        id: 'name',
        header: 'Hospital',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="grid place-items-center w-7 h-7 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-[10px] font-medium uppercase text-[var(--color-secondary)] shrink-0">
              {row.original.name.slice(0, 2)}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-[var(--color-primary)] font-medium truncate">{row.original.name}</span>
              <span className="text-[10px] text-[var(--color-tertiary)] truncate">
                {row.original.primaryDomain}
              </span>
            </div>
          </div>
        ),
        size: 280,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <div className="inline-flex items-center gap-1.5">
            <StatusDot tone={STATUS_TONE[row.original.status]} />
            <span className="capitalize">{row.original.status}</span>
          </div>
        ),
      },
      {
        id: 'plan',
        header: 'Plan',
        accessorKey: 'planTier',
        cell: ({ row }) => <Badge tone={PLAN_TONE[row.original.planTier]}>{row.original.planTier}</Badge>,
      },
      {
        id: 'region',
        header: 'Region',
        accessorKey: 'region',
        cell: ({ row }) => <span className="text-[var(--color-tertiary)] uppercase">{row.original.region}</span>,
      },
      {
        id: 'mrr',
        header: 'MRR',
        accessorKey: 'mrrUsd',
        cell: ({ row }) => (
          <span className="tabular-nums text-[var(--color-primary)]">
            {formatCurrency(row.original.mrrUsd)}
          </span>
        ),
      },
      {
        id: 'conversations',
        header: 'Convos / mo',
        accessorKey: 'monthlyConversations',
        cell: ({ row }) => <span className="tabular-nums">{formatCompact(row.original.monthlyConversations)}</span>,
      },
      {
        id: 'booking',
        header: 'Booking',
        accessorKey: 'bookingRate',
        cell: ({ row }) => (
          <span className="tabular-nums text-[var(--color-success)]">
            {formatPercent(row.original.bookingRate, 1)}
          </span>
        ),
      },
      {
        id: 'csat',
        header: 'CSAT',
        accessorKey: 'csat',
        cell: ({ row }) => <span className="tabular-nums">{row.original.csat.toFixed(2)}</span>,
      },
      {
        id: 'baa',
        header: 'BAA',
        accessorKey: 'baaStatus',
        cell: ({ row }) => {
          const s = row.original.baaStatus;
          const tone = s === 'signed' ? 'success' : s === 'pending' ? 'warning' : s === 'expired' ? 'danger' : 'neutral';
          return <Badge tone={tone}>{s}</Badge>;
        },
      },
      {
        id: 'hipaa',
        header: 'HIPAA',
        accessorKey: 'hipaaStatus',
        cell: ({ row }) => {
          const s = row.original.hipaaStatus;
          const tone = s === 'compliant' ? 'success' : s === 'review-needed' ? 'warning' : s === 'non-compliant' ? 'danger' : 'neutral';
          return <Badge tone={tone}>{s}</Badge>;
        },
      },
      {
        id: 'risk',
        header: 'Risk',
        accessorKey: 'riskScore',
        cell: ({ row }) => {
          const score = row.original.riskScore;
          const tone = score > 70 ? 'danger' : score > 40 ? 'warning' : 'neutral';
          return <Badge tone={tone}>{score}</Badge>;
        },
      },
    ],
    [],
  );

  const counts = useMemo(() => {
    const total = query.data?.pagination.total ?? 0;
    return { total };
  }, [query.data]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Hospitals"
        description="Every connected hospital tenant. Drill into any row to view branches, agents, conversations, billing, and audit."
        meta={
          <span className="text-xs text-[var(--color-tertiary)]">
            <span className="text-[var(--color-secondary)] font-medium">{counts.total}</span> total
          </span>
        }
        actions={
          <>
            <Button variant="secondary" size="md">
              <Filter className="size-3.5" />
              Saved views
            </Button>
            <Button variant="primary" size="md">
              <Plus className="size-3.5" />
              New hospital
            </Button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="size-3.5 text-[var(--color-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name, domain, email…"
            className="pl-8 w-72"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="inline-flex items-center gap-0.5 p-0.5 rounded-[6px] bg-[var(--color-elevated)] border border-[var(--color-border-default)]">
          <Button
            variant={statusFilter === null ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter(null)}
            className="h-6"
          >
            All
          </Button>
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className="h-6 capitalize"
            >
              <StatusDot tone={STATUS_TONE[s]} />
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={query.data?.items ?? []}
        columns={columns}
        isLoading={query.isLoading}
        onRowClick={(h) => navigate({ to: '/hospitals/$hospitalId', params: { hospitalId: h.id } })}
        emptyState={
          <EmptyState
            icon={Building2}
            title="No hospitals match"
            description="Try clearing search or switching status filter."
          />
        }
      />
    </div>
  );
}

import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Eye, Pencil, ShieldAlert } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { apiCall } from '@/lib/api/client';
import {
  getHospital,
  listAgents,
  listBranches,
  listCalls,
  listConversations,
  listDepartments,
  listInvoices,
  listUsers,
} from '@/lib/api/operations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusDot, type StatusTone } from '@/components/ui/status-dot';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/data-table/data-table';
import { KpiCard } from '@/components/charts/kpi-card';
import { formatCompact, formatCurrency, formatPercent } from '@/lib/utils';
import { format } from 'date-fns';
import type {
  Agent,
  Branch,
  Call,
  Conversation,
  Department,
  Hospital,
  HospitalStatus,
  Invoice,
  User,
} from '@/lib/schemas';

export const Route = createFileRoute('/_app/hospitals/$hospitalId')({
  component: HospitalDetailPage,
});

const STATUS_TONE: Record<HospitalStatus, StatusTone> = {
  active: 'success',
  trialing: 'info',
  paused: 'warning',
  suspended: 'danger',
  archived: 'neutral',
};

function HospitalDetailPage() {
  const { hospitalId } = Route.useParams();
  const hospital = useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: () => apiCall(getHospital, { id: hospitalId }),
  });

  const h = hospital.data;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/hospitals"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-tertiary)] hover:text-[var(--color-secondary)] -mb-2 self-start"
      >
        <ArrowLeft className="size-3" />
        All hospitals
      </Link>

      <header className="flex items-start gap-4">
        <div className="grid place-items-center w-12 h-12 rounded-[10px] bg-[var(--color-elevated)] border border-[var(--color-border-subtle)] text-sm font-semibold uppercase text-[var(--color-secondary)] shrink-0">
          {h ? h.name.slice(0, 2) : '...'}
        </div>
        <div className="flex-1 min-w-0">
          {h ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-semibold tracking-tight truncate">{h.name}</h1>
                <Badge tone="neutral">
                  <StatusDot tone={STATUS_TONE[h.status]} />
                  <span className="capitalize">{h.status}</span>
                </Badge>
                <Badge tone="accent">{h.planTier}</Badge>
                {h.tags.map((t) => (
                  <Badge key={t} tone="outline">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-tertiary)]">
                <span>{h.legalName}</span>
                <span>·</span>
                <span>{h.primaryDomain}</span>
                <span>·</span>
                <span className="uppercase">{h.region}</span>
                <span>·</span>
                <span>{h.contactEmail}</span>
                <span>·</span>
                <span>Joined {format(new Date(h.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </>
          ) : (
            <Skeleton className="h-7 w-72" />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="md">
            <Eye className="size-3.5" />
            Impersonate
          </Button>
          <Button variant="secondary" size="md">
            <ExternalLink className="size-3.5" />
            Open portal
          </Button>
          <Button variant="primary" size="md">
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard label="MRR" value={h ? formatCurrency(h.mrrUsd) : <Skeleton className="h-7 w-20" />} />
        <KpiCard label="Branches" value={h ? h.branchCount : <Skeleton className="h-7 w-12" />} />
        <KpiCard
          label="Convos / mo"
          value={h ? formatCompact(h.monthlyConversations) : <Skeleton className="h-7 w-16" />}
        />
        <KpiCard
          label="Booking rate"
          value={h ? formatPercent(h.bookingRate, 1) : <Skeleton className="h-7 w-14" />}
        />
        <KpiCard label="CSAT" value={h ? h.csat.toFixed(2) : <Skeleton className="h-7 w-12" />} />
        <KpiCard
          label="Uptime"
          value={h ? formatPercent(h.uptimePct, 2) : <Skeleton className="h-7 w-14" />}
        />
      </section>

      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className="overflow-x-auto -mx-1 px-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="calls">Calls</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {h && <HospitalOverview hospital={h} />}
        </TabsContent>
        <TabsContent value="branches">
          <BranchesPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="departments">
          <DepartmentsPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="users">
          <UsersPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="agents">
          <AgentsPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="conversations">
          <ConversationsPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="calls">
          <CallsPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="knowledge">
          <PlaceholderPanel
            title="Knowledge bases"
            description="Documents, ingestion jobs, embedding status, retrieval analytics."
          />
        </TabsContent>
        <TabsContent value="integrations">
          <PlaceholderPanel
            title="Integrations"
            description="EHR / PMS, calendars, telephony, CRM and webhook delivery logs."
          />
        </TabsContent>
        <TabsContent value="billing">
          <BillingPanel hospitalId={hospitalId} />
        </TabsContent>
        <TabsContent value="usage">
          <PlaceholderPanel title="Usage" description="Per-resource usage with overage projections." />
        </TabsContent>
        <TabsContent value="audit">
          <PlaceholderPanel
            title="Audit"
            description="Per-tenant audit feed with diff viewer for config changes."
          />
        </TabsContent>
        <TabsContent value="settings">
          <PlaceholderPanel title="Settings" description="Domains, branding, retention, data residency." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HospitalOverview({ hospital }: { hospital: Hospital }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
          <Field label="Legal name" value={hospital.legalName} />
          <Field label="Primary domain" value={hospital.primaryDomain} />
          <Field label="Contact email" value={hospital.contactEmail} />
          <Field label="Phone" value={hospital.phone} />
          <Field label="Region" value={hospital.region.toUpperCase()} />
          <Field label="Plan" value={hospital.planTier} />
          <Field label="Created" value={format(new Date(hospital.createdAt), 'PPP')} />
          <Field label="Updated" value={format(new Date(hospital.updatedAt), 'PPP')} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <ShieldAlert className="size-3.5 text-[var(--color-tertiary)]" />
            Risk profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-end gap-3">
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {hospital.riskScore}
            </div>
            <div className="text-[11px] text-[var(--color-tertiary)] mb-1">/ 100</div>
          </div>
          <div className="h-1.5 w-full bg-[var(--color-elevated)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${hospital.riskScore}%`,
                background:
                  hospital.riskScore > 70
                    ? 'var(--color-danger)'
                    : hospital.riskScore > 40
                      ? 'var(--color-warning)'
                      : 'var(--color-success)',
              }}
            />
          </div>
          <p className="text-[11px] text-[var(--color-tertiary)] leading-relaxed">
            Composite of churn signals, latency, error rate, CSAT trend, and contract renewal proximity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-[var(--color-tertiary)]">{label}</span>
      <span className="text-[var(--color-primary)] truncate">{value}</span>
    </div>
  );
}

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center text-center gap-2 py-12">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[var(--color-tertiary)] max-w-md">{description}</p>
        <p className="text-[10px] uppercase tracking-wider text-[var(--color-tertiary)] mt-2">
          Wires up to live data once backend endpoints land.
        </p>
      </CardContent>
    </Card>
  );
}

// -------- Sub-tab panels --------

function BranchesPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['branches', hospitalId],
    queryFn: () => apiCall(listBranches, { hospitalId, pageSize: 100 }),
  });
  const columns = useMemo<ColumnDef<Branch, unknown>[]>(
    () => [
      { id: 'name', header: 'Name', accessorKey: 'name' },
      { id: 'city', header: 'City', accessorKey: 'city' },
      { id: 'country', header: 'Country', accessorKey: 'country' },
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
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function DepartmentsPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['departments', hospitalId],
    queryFn: () => apiCall(listDepartments, { hospitalId, pageSize: 200 }),
  });
  const columns = useMemo<ColumnDef<Department, unknown>[]>(
    () => [
      { id: 'name', header: 'Department', accessorKey: 'name' },
      { id: 'specialty', header: 'Specialty', accessorKey: 'specialty' },
      { id: 'head', header: 'Head', accessorKey: 'headPhysician' },
      { id: 'staff', header: 'Staff', accessorKey: 'staffCount' },
      {
        id: 'appts',
        header: 'Monthly appts',
        accessorKey: 'monthlyAppointments',
        cell: ({ row }) => formatCompact(row.original.monthlyAppointments),
      },
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function UsersPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['users', hospitalId],
    queryFn: () => apiCall(listUsers, { hospitalId, pageSize: 100 }),
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
        cell: ({ row }) => (row.original.mfaEnabled ? 'Yes' : '—'),
      },
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function AgentsPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['agents', hospitalId],
    queryFn: () => apiCall(listAgents, { hospitalId, pageSize: 100 }),
  });
  const columns = useMemo<ColumnDef<Agent, unknown>[]>(
    () => [
      { id: 'name', header: 'Agent', accessorKey: 'name' },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'live'
                ? 'success'
                : row.original.status === 'training'
                  ? 'info'
                  : row.original.status === 'paused'
                    ? 'warning'
                    : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'channels',
        header: 'Channels',
        accessorKey: 'channels',
        cell: ({ row }) => (
          <div className="flex gap-1">
            {row.original.channels.map((c) => (
              <Badge key={c} tone="outline">
                {c}
              </Badge>
            ))}
          </div>
        ),
      },
      { id: 'model', header: 'Model', accessorKey: 'model' },
      { id: 'lang', header: 'Language', accessorKey: 'language' },
      {
        id: 'lat',
        header: 'p50 latency',
        accessorKey: 'avgLatencyMs',
        cell: ({ row }) => `${row.original.avgLatencyMs}ms`,
      },
      {
        id: 'success',
        header: 'Success',
        accessorKey: 'successRate',
        cell: ({ row }) => formatPercent(row.original.successRate, 1),
      },
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function ConversationsPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['conversations', hospitalId],
    queryFn: () => apiCall(listConversations, { hospitalId, pageSize: 50 }),
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
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function CallsPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['calls', hospitalId],
    queryFn: () => apiCall(listCalls, { hospitalId, pageSize: 50 }),
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
        id: 'e2e',
        header: 'p50 e2e',
        accessorKey: 'endToEndLatencyMs',
        cell: ({ row }) => `${row.original.endToEndLatencyMs}ms`,
      },
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

function BillingPanel({ hospitalId }: { hospitalId: string }) {
  const q = useQuery({
    queryKey: ['invoices', hospitalId],
    queryFn: () => apiCall(listInvoices, { hospitalId, pageSize: 50, sort: 'issuedAt', dir: 'desc' }),
  });
  const columns = useMemo<ColumnDef<Invoice, unknown>[]>(
    () => [
      { id: 'number', header: 'Invoice', accessorKey: 'number' },
      {
        id: 'issued',
        header: 'Issued',
        accessorKey: 'issuedAt',
        cell: ({ row }) => format(new Date(row.original.issuedAt), 'MMM d, yyyy'),
      },
      {
        id: 'due',
        header: 'Due',
        accessorKey: 'dueAt',
        cell: ({ row }) => format(new Date(row.original.dueAt), 'MMM d, yyyy'),
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amountUsd',
        cell: ({ row }) => formatCurrency(row.original.amountUsd),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <Badge
            tone={
              row.original.status === 'paid'
                ? 'success'
                : row.original.status === 'open'
                  ? 'warning'
                  : 'neutral'
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
    ],
    [],
  );
  return <DataTable data={q.data?.items ?? []} columns={columns} isLoading={q.isLoading} />;
}

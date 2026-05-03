import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  MessageSquare,
  Phone,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { apiCall } from '@/lib/api/client';
import { getOverview, listServiceHealth } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { KpiCard } from '@/components/charts/kpi-card';
import { AreaChart } from '@/components/charts/area-chart';
import { DonutChart } from '@/components/charts/donut-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusDot, type StatusTone } from '@/components/ui/status-dot';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/feedback/error-state';
import { formatCompact, formatCurrency, formatPercent } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CHART_COLORS } from '@/components/charts/chart-tokens';
import type { ServiceStatus } from '@/lib/schemas';

export const Route = createFileRoute('/_app/')({
  component: OverviewPage,
});

const SERVICE_STATUS_TONE: Record<ServiceStatus, StatusTone> = {
  operational: 'success',
  degraded: 'warning',
  'partial-outage': 'warning',
  outage: 'danger',
  maintenance: 'info',
};

function OverviewPage() {
  const overview = useQuery({
    queryKey: ['overview'],
    queryFn: () => apiCall(getOverview, undefined),
  });
  const services = useQuery({
    queryKey: ['infra', 'health', 'topbar'],
    queryFn: () => apiCall(listServiceHealth, undefined),
  });

  if (overview.isError) {
    return (
      <div>
        <PageHeader title="Overview" />
        <div className="mt-6">
          <ErrorState onRetry={() => overview.refetch()} />
        </div>
      </div>
    );
  }

  const data = overview.data;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Overview"
        description="Real-time picture of every Linor tenant — adoption, quality, revenue, and infrastructure health."
        meta={
          <>
            <Badge tone="success">
              <CheckCircle2 className="size-3" />
              Live
            </Badge>
            <span className="text-xs text-[var(--color-tertiary)]">
              Updated {formatDistanceToNow(new Date(), { addSuffix: true })}
            </span>
          </>
        }
        actions={
          <>
            <Button variant="secondary" size="md">
              <Sparkles className="size-3.5" />
              Customize
            </Button>
            <Button variant="primary" size="md" asChild>
              <Link to="/hospitals">
                Browse hospitals
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </>
        }
      />

      {/* KPIs */}
      <section
        aria-label="Key performance indicators"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3"
      >
        <KpiCard
          label="Active hospitals"
          value={data ? `${data.activeHospitals}/${data.totalHospitals}` : <Skeleton className="h-7 w-20" />}
          delta={{ value: 4.2, label: 'mo/mo' }}
          icon={<Building2 className="size-3.5" />}
        />
        <KpiCard
          label="MRR"
          value={data ? formatCurrency(data.mrrUsd) : <Skeleton className="h-7 w-24" />}
          delta={{ value: 9.1, label: 'mo/mo' }}
          icon={<Banknote className="size-3.5" />}
        />
        <KpiCard
          label="Conversations / mo"
          value={data ? formatCompact(data.monthlyConversations) : <Skeleton className="h-7 w-16" />}
          delta={{ value: 12.6 }}
          icon={<MessageSquare className="size-3.5" />}
          trend={data?.conversationTrend.map((t) => ({ value: t.conversations })) ?? []}
        />
        <KpiCard
          label="Voice calls / mo"
          value={data ? formatCompact(data.monthlyCalls) : <Skeleton className="h-7 w-16" />}
          delta={{ value: 7.8 }}
          icon={<Phone className="size-3.5" />}
          trend={data?.conversationTrend.map((t) => ({ value: t.calls })) ?? []}
        />
        <KpiCard
          label="Booking rate"
          value={data ? formatPercent(data.bookingRate, 1) : <Skeleton className="h-7 w-14" />}
          delta={{ value: 1.4 }}
          icon={<TrendingUp className="size-3.5" />}
        />
        <KpiCard
          label="Avg CSAT"
          value={data ? data.avgCsat.toFixed(2) : <Skeleton className="h-7 w-12" />}
          delta={{ value: 0.4 }}
          icon={<Star className="size-3.5" />}
        />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activity — last 30 days</CardTitle>
              <span className="text-[11px] text-[var(--color-tertiary)] inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: CHART_COLORS[0] }}
                  />
                  Conversations
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: CHART_COLORS[1] }}
                  />
                  Calls
                </span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {data ? (
              <AreaChart
                data={data.conversationTrend}
                xKey="date"
                series={[
                  { key: 'conversations', label: 'Conversations' },
                  { key: 'calls', label: 'Calls' },
                ]}
                height={240}
                yTickFormatter={formatCompact}
                xTickFormatter={(v) => v.slice(5)}
              />
            ) : (
              <Skeleton className="h-60" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            {data ? (
              <>
                <div className="flex-1 min-w-0">
                  <DonutChart
                    data={data.outcomeBreakdown.map((o) => ({ name: o.outcome, value: o.value }))}
                    height={200}
                  />
                </div>
                <ul className="flex flex-col gap-1.5 text-[11px] min-w-[120px]">
                  {data.outcomeBreakdown.map((o, i) => (
                    <li key={o.outcome} className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full shrink-0"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-[var(--color-secondary)] capitalize truncate">
                        {o.outcome.replace('-', ' ')}
                      </span>
                      <span className="ml-auto text-[var(--color-tertiary)] tabular-nums">
                        {formatCompact(o.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Skeleton className="h-48 w-full" />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Lower row — health, risk, activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="inline-flex items-center gap-2">
                <Activity className="size-3.5 text-[var(--color-tertiary)]" />
                System health
              </CardTitle>
              <Link
                to="/infra"
                className="text-[11px] text-[var(--color-tertiary)] hover:text-[var(--color-secondary)] inline-flex items-center gap-1"
              >
                Status page
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {services.data ? (
              services.data.slice(0, 8).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 h-7 px-2 -mx-2 rounded-[6px] hover:bg-[var(--color-elevated)] transition-colors"
                >
                  <StatusDot tone={SERVICE_STATUS_TONE[s.status]} pulse={s.status !== 'operational'} />
                  <span className="text-xs text-[var(--color-primary)] truncate">{s.name}</span>
                  <span className="ml-auto text-[10px] text-[var(--color-tertiary)] tabular-nums">
                    p95 {s.p95LatencyMs}ms
                  </span>
                </div>
              ))
            ) : (
              <>
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <HeartPulse className="size-3.5 text-[var(--color-tertiary)]" />
              At-risk hospitals
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {data ? (
              data.topRiskHospitals.map((h) => (
                <Link
                  key={h.id}
                  to="/hospitals/$hospitalId"
                  params={{ hospitalId: h.id }}
                  className="flex items-center gap-2 h-8 px-2 -mx-2 rounded-[6px] hover:bg-[var(--color-elevated)] transition-colors"
                >
                  <div className="grid place-items-center w-6 h-6 rounded-[4px] bg-[var(--color-elevated)] text-[10px] font-medium uppercase text-[var(--color-secondary)]">
                    {h.name.slice(0, 2)}
                  </div>
                  <span className="text-xs truncate">{h.name}</span>
                  <Badge
                    tone={h.riskScore > 70 ? 'danger' : h.riskScore > 40 ? 'warning' : 'neutral'}
                    className="ml-auto"
                  >
                    {h.riskScore}
                  </Badge>
                </Link>
              ))
            ) : (
              <>
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-7 w-full" />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="inline-flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-[var(--color-tertiary)]" />
                Recent activity
              </CardTitle>
              <Link
                to="/audit"
                className="text-[11px] text-[var(--color-tertiary)] hover:text-[var(--color-secondary)] inline-flex items-center gap-1"
              >
                Audit log
                <ChevronRight className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {data ? (
              data.recentActivity.map((ev) => (
                <div key={ev.id} className="flex items-start gap-2 text-xs">
                  <StatusDot tone="info" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--color-primary)] truncate">
                      <span className="font-medium">{ev.actorName}</span>{' '}
                      <span className="text-[var(--color-tertiary)]">{ev.action}</span>
                    </div>
                    <div className="text-[10px] text-[var(--color-tertiary)] mt-0.5">
                      {formatDistanceToNow(new Date(ev.occurredAt), { addSuffix: true })} · {ev.actorRole}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

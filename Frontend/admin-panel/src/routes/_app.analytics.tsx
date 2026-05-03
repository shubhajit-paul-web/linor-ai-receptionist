import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/lib/api/client';
import { getOverview } from '@/lib/api/operations';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart } from '@/components/charts/area-chart';
import { BarChart } from '@/components/charts/bar-chart';
import { DonutChart } from '@/components/charts/donut-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_COLORS } from '@/components/charts/chart-tokens';
import { formatCompact } from '@/lib/utils';

export const Route = createFileRoute('/_app/analytics')({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const overview = useQuery({
    queryKey: ['overview'],
    queryFn: () => apiCall(getOverview, undefined),
  });
  const data = overview.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Adoption, engagement, outcome quality, performance, and revenue across the entire fleet."
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Engagement — last 30 days</CardTitle>
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
                yTickFormatter={formatCompact}
                xTickFormatter={(v) => v.slice(5)}
                height={260}
              />
            ) : (
              <Skeleton className="h-64" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            {data ? (
              <>
                <div className="flex-1">
                  <DonutChart
                    data={data.outcomeBreakdown.map((o) => ({ name: o.outcome, value: o.value }))}
                    height={240}
                  />
                </div>
                <ul className="flex flex-col gap-1.5 text-[11px]">
                  {data.outcomeBreakdown.map((o, i) => (
                    <li key={o.outcome} className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="capitalize">{o.outcome.replace('-', ' ')}</span>
                      <span className="ml-auto text-[var(--color-tertiary)] tabular-nums">
                        {formatCompact(o.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Skeleton className="h-60 w-full" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Channels</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <BarChart
                data={data.channelBreakdown.map((c) => ({ channel: c.channel, value: c.value }))}
                xKey="channel"
                yKey="value"
                height={240}
              />
            ) : (
              <Skeleton className="h-60" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top tenants by volume</CardTitle>
          </CardHeader>
          <CardContent>
            {data ? (
              <BarChart
                data={data.topRiskHospitals.map((h) => ({ name: h.name.slice(0, 12), value: h.riskScore }))}
                xKey="name"
                yKey="value"
                height={240}
                color="var(--color-chart-2)"
              />
            ) : (
              <Skeleton className="h-60" />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

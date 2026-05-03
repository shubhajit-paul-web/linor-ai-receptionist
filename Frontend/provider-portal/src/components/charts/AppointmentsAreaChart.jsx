import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { generateAreaChartData } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { CHART_AXIS_COLOR, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE } from './chartTokens';

const TABS = [
  { label: '7d',  days: 7  },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

/** Branded tooltip: hairline, tabular numerals, accent line. */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-strong rounded-md px-3 py-2 shadow-md">
      <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-text-primary tabular-nums">
        {payload[0]?.value} appointments
      </p>
    </div>
  );
}

export function AppointmentsAreaChart() {
  const [activeTab, setActiveTab] = useState(1); // default: 30 days
  const data = useMemo(() => generateAreaChartData(TABS[activeTab].days), [activeTab]);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Range selector — segmented control */}
      <div
        role="tablist"
        aria-label="Time range"
        className="self-start flex items-center gap-0.5 p-0.5 bg-surface-secondary border border-border rounded-md"
      >
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={cn(
              'h-6 px-2.5 text-[11px] font-semibold rounded transition-colors',
              activeTab === i
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1" aria-label="Appointments over time area chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="appointmentsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="var(--primary)" stopOpacity={0.32} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="date"
              stroke={CHART_AXIS_COLOR}
              tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={CHART_AXIS_COLOR}
              tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: CHART_GRID_COLOR, strokeDasharray: '2 2' }}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="var(--primary)"
              strokeWidth={1.6}
              fill="url(#appointmentsGrad)"
              dot={false}
              activeDot={{ r: 3, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

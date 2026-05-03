import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { RESOLUTION_DATA } from '../../lib/mockData';
import { CHART_AXIS_COLOR, CHART_GRID_COLOR, CHART_TOOLTIP_STYLE } from './chartTokens';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const rate = payload[0]?.value;
  const ok = rate >= 80;
  return (
    <div className="bg-surface border border-border-strong rounded-md px-3 py-2 shadow-md">
      <p className="text-[11px] text-text-muted mb-0.5">{label}</p>
      <p className={`text-[13px] font-semibold tabular-nums ${ok ? 'text-success' : 'text-warning'}`}>
        {rate}% resolved
      </p>
    </div>
  );
}

export function ResolutionLineChart() {
  return (
    <div aria-label="AI resolution rate trend" className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={RESOLUTION_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
            domain={[60, 100]}
            stroke={CHART_AXIS_COLOR}
            tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={32}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: CHART_GRID_COLOR, strokeDasharray: '2 2' }}
            contentStyle={CHART_TOOLTIP_STYLE}
          />
          {/* 80% target reference line */}
          <ReferenceLine
            y={80}
            stroke="var(--warning)"
            strokeDasharray="4 4"
            strokeWidth={1.2}
            label={{
              value: 'Target 80%',
              position: 'insideTopRight',
              fontSize: 10,
              fill: 'var(--warning)',
            }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="var(--success)"
            strokeWidth={1.8}
            dot={false}
            activeDot={{ r: 3, fill: 'var(--success)', stroke: 'var(--surface)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

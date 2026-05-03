import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { RESOLUTION_DATA } from '../../lib/mockData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const rate = payload[0]?.value;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-sm">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className={`text-sm font-semibold ${rate >= 80 ? 'text-success' : 'text-warning'}`}>
        {rate}% resolved
      </p>
    </div>
  );
}

export function ResolutionLineChart() {
  return (
    <div aria-label="AI resolution rate trend line chart" className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={RESOLUTION_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* 80% threshold reference line */}
          <ReferenceLine
            y={80}
            stroke="var(--warning)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'Target 80%', position: 'insideTopRight', fontSize: 10, fill: 'var(--warning)' }}
          />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="var(--success)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--success)', stroke: 'var(--surface)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

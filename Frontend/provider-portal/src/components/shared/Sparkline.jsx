import { Area, AreaChart, ResponsiveContainer } from 'recharts';

/**
 * Sparkline — micro area chart used inside KPI / StatCard.
 * Stateless, no axes, no tooltips. Just a trend hint.
 */
export function Sparkline({ data, color = 'var(--primary)', height = 32 }) {
  if (!data || data.length < 2) return null;
  // Recharts wants array-of-objects; normalize raw numbers too.
  const series = data.map((d) =>
    typeof d === 'number' ? { value: d } : d,
  );
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.4}
          fill="url(#spark-grad)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

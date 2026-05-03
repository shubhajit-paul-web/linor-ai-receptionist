import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: Array<{ value: number }>;
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = 'var(--color-accent)', height = 32 }: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.4}
          fill="url(#spark-grad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

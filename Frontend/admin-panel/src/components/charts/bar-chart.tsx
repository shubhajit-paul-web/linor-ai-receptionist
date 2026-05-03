import {
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  CHART_AXIS_COLOR,
  CHART_COLORS,
  CHART_GRID_COLOR,
  CHART_TOOLTIP_STYLE,
} from './chart-tokens';

interface BarChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T & string;
  yKey: keyof T & string;
  height?: number;
  color?: string;
}

export function BarChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  height = 200,
  color,
}: BarChartProps<T>) {
  const fill = color ?? CHART_COLORS[0];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke={CHART_AXIS_COLOR}
          tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={CHART_AXIS_COLOR}
          tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          cursor={{ fill: 'var(--color-overlay)', opacity: 0.5 }}
          labelStyle={{ color: 'var(--color-tertiary)', fontSize: 10 }}
        />
        <Bar dataKey={yKey} fill={fill} radius={[4, 4, 0, 0]} />
      </RBarChart>
    </ResponsiveContainer>
  );
}

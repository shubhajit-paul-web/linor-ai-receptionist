import {
  Area,
  AreaChart as RAreaChart,
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

interface SeriesDef {
  key: string;
  label: string;
  color?: string;
}

interface AreaChartProps<T extends Record<string, unknown>> {
  data: T[];
  xKey: keyof T & string;
  series: SeriesDef[];
  height?: number;
  yTickFormatter?: (v: number) => string;
  xTickFormatter?: (v: string) => string;
}

export function AreaChart<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 220,
  yTickFormatter,
  xTickFormatter,
}: AreaChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? CHART_COLORS[0];
            return (
              <linearGradient id={`grad-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.32} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid stroke={CHART_GRID_COLOR} strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey={xKey}
          stroke={CHART_AXIS_COLOR}
          tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
          {...(xTickFormatter ? { tickFormatter: xTickFormatter } : {})}
        />
        <YAxis
          stroke={CHART_AXIS_COLOR}
          tick={{ fontSize: 10, fill: CHART_AXIS_COLOR }}
          tickLine={false}
          axisLine={false}
          width={36}
          {...(yTickFormatter ? { tickFormatter: yTickFormatter } : {})}
        />
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          cursor={{ stroke: CHART_GRID_COLOR, strokeDasharray: '2 2' }}
          labelStyle={{ color: 'var(--color-tertiary)', fontSize: 10 }}
        />
        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length] ?? CHART_COLORS[0];
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={color}
              strokeWidth={1.6}
              fill={`url(#grad-${s.key})`}
            />
          );
        })}
      </RAreaChart>
    </ResponsiveContainer>
  );
}

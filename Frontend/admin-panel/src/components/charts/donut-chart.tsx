import { Cell, Pie, PieChart as RPieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from './chart-tokens';

interface DonutSlice {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export function DonutChart({ data, height = 200, innerRadius = 56, outerRadius = 84 }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          stroke="var(--color-canvas)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={CHART_TOOLTIP_STYLE}
          labelStyle={{ color: 'var(--color-tertiary)', fontSize: 10 }}
        />
      </RPieChart>
    </ResponsiveContainer>
  );
}

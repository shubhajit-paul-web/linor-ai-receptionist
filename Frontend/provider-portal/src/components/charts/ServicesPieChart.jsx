import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PIE_DATA } from '../../lib/mockData';
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from './chartTokens';

/**
 * Donut chart of appointments by service.
 * Slice colors come from the categorical palette (token-driven),
 * so dark/light theme swaps don't require chart code edits.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-strong rounded-md px-3 py-2 shadow-md">
      <p className="text-[12px] font-semibold text-text-primary">{payload[0].name}</p>
      <p className="text-[12px] text-text-muted tabular-nums">
        {payload[0].value} appointments
      </p>
    </div>
  );
}

export function ServicesPieChart() {
  if (PIE_DATA.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-1.5 text-center">
        <p className="text-[12px] font-medium text-text-secondary">No service data yet</p>
        <p className="text-[11px] text-text-muted">Appointment distribution will appear here.</p>
      </div>
    );
  }

  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);
  // Pull palette colors from tokens so they recolor with theme.
  const sliced = PIE_DATA.map((d, i) => ({ ...d, color: CHART_COLORS[i % CHART_COLORS.length] }));

  return (
    <div className="h-full flex flex-col gap-3" aria-label="Appointments by service donut chart">
      <div className="relative flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sliced}
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
              dataKey="value"
              stroke="var(--surface)"
              strokeWidth={2}
            >
              {sliced.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} contentStyle={CHART_TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-bold text-text-primary tabular-nums leading-none">
            {total}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-text-muted mt-1">
            Total
          </span>
        </div>
      </div>
      {/* Legend — vertical list with values for clarity */}
      <ul className="flex flex-col gap-1 text-[12px]">
        {sliced.map((entry) => {
          const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <li key={entry.name} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: entry.color }}
                aria-hidden
              />
              <span className="text-text-secondary truncate">{entry.name}</span>
              <span className="ml-auto text-text-muted tabular-nums">
                {entry.value} <span className="opacity-60">· {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

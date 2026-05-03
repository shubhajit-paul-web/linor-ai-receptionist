import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PIE_DATA } from '../../lib/mockData';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold text-text-primary">{payload[0].name}</p>
      <p className="text-sm text-text-secondary">{payload[0].value} appointments</p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-col gap-1.5 mt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: entry.color }}
            />
            <span className="text-text-secondary">{entry.value}</span>
          </div>
          <span className="font-medium text-text-primary ml-4">
            {PIE_DATA.find((d) => d.name === entry.value)?.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ServicesPieChart() {
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div className="h-full flex flex-col" aria-label="Appointments by service donut chart">
      <div className="relative flex-1" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={PIE_DATA}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              dataKey="value"
            >
              {PIE_DATA.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-text-primary">{total}</span>
          <span className="text-xs text-text-muted">Total</span>
        </div>
      </div>
      <CustomLegend payload={PIE_DATA.map((d) => ({ value: d.name, color: d.color }))} />
    </div>
  );
}

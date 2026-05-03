import { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { generateAreaChartData } from '../../lib/mockData';
import { cn } from '../../lib/utils';

const TABS = [
  { label: '7 Days',  days: 7  },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

/** Custom tooltip styled to match design system */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-sm">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-text-primary">
        {payload[0]?.value} appointments
      </p>
    </div>
  );
}

export function AppointmentsAreaChart() {
  const [activeTab, setActiveTab] = useState(1); // Default: 30 days
  const data = useMemo(() => generateAreaChartData(TABS[activeTab].days), [activeTab]);

  return (
    <div className="h-full flex flex-col">
      {/* Tab row */}
      <div className="flex items-center gap-1 mb-4">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150',
              activeTab === i
                ? 'bg-primary text-white'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1" aria-label="Appointments over time area chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="appointmentsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"   stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%"  stopColor="var(--primary)" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="appointments"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#appointmentsGrad)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--surface)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Sparkline } from './Sparkline';

/**
 * StatCard — KPI tile.
 *
 * Visual contract:
 *   ┌────────────────────────────────────┐
 *   │ LABEL                  [icon]      │
 *   │ 1,234.5  ↑3.2% vs prev    ▁▂▃▅█    │
 *   └────────────────────────────────────┘
 *
 * Backwards-compatible API:
 *   - `trend`      ('up'|'down') + `trendValue` (string)  → legacy delta row
 *   - `delta`      { value: number, label?: string }      → preferred
 *   - `sparkline`  number[] | { value }[]                 → optional micro-chart
 */
export function StatCard({
  label,
  value,
  suffix = '',
  // legacy delta props
  trend,
  trendValue,
  // new delta + sparkline
  delta,
  sparkline,
  // icon
  icon: Icon,
  iconBg,
  iconColor = 'text-primary',
  // visual
  className,
}) {
  // Animate numeric values from 0 → target on mount
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
  const isNumeric = typeof value === 'number' || /^[0-9.,-]+$/.test(String(value));

  useEffect(() => {
    if (!isNumeric) return;
    const duration = 700;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(eased * numericValue));
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [numericValue, isNumeric]);

  // Resolve delta: prefer new prop, fall back to legacy
  const resolvedDelta = delta
    ? { positive: delta.value >= 0, text: `${delta.value >= 0 ? '+' : ''}${delta.value.toFixed(1)}%`, label: delta.label }
    : trendValue
      ? { positive: trend === 'up', text: trendValue }
      : null;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface',
        'hover:border-border-strong transition-colors',
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </span>
        {Icon && (
          <span
            className={cn(
              'w-7 h-7 rounded-md grid place-items-center flex-shrink-0',
              iconBg ?? 'bg-surface-secondary',
              iconColor,
            )}
          >
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
      </div>

      {/* Value + sparkline row */}
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-[24px] font-semibold tracking-tight text-text-primary tabular-nums leading-none">
            {isNumeric ? display.toLocaleString() : value}
            {suffix && <span className="text-text-muted font-medium ml-0.5 text-[18px]">{suffix}</span>}
          </div>
          {resolvedDelta && (
            <div
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-medium',
                resolvedDelta.positive ? 'text-success' : 'text-danger',
              )}
            >
              {resolvedDelta.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              <span>{resolvedDelta.text}</span>
              {resolvedDelta.label && (
                <span className="ml-1 text-text-muted font-normal">{resolvedDelta.label}</span>
              )}
            </div>
          )}
        </div>
        {sparkline && sparkline.length > 1 && (
          <div className="w-20 h-8 flex-shrink-0">
            <Sparkline data={sparkline} />
          </div>
        )}
      </div>
    </div>
  );
}

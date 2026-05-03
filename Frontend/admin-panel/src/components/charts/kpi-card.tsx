import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from './sparkline';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta?: { value: number; label?: string };
  icon?: ReactNode;
  trend?: Array<{ value: number }>;
  className?: string;
}

export function KpiCard({ label, value, delta, icon, trend, className }: KpiCardProps) {
  const positive = delta ? delta.value >= 0 : false;
  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-4 rounded-[12px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)]',
        'hover:border-[var(--color-border-default)] transition-colors',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-tertiary)]">
          {label}
        </div>
        {icon && <span className="text-[var(--color-tertiary)]">{icon}</span>}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-2xl font-semibold tracking-tight text-[var(--color-primary)] tabular-nums truncate">
            {value}
          </div>
          {delta && (
            <div
              className={cn(
                'inline-flex items-center gap-0.5 text-[11px] font-medium',
                positive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]',
              )}
            >
              {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta.value).toFixed(1)}%
              {delta.label && (
                <span className="ml-1 text-[var(--color-tertiary)] font-normal">{delta.label}</span>
              )}
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <div className="w-20 h-8 shrink-0">
            <Sparkline data={trend} />
          </div>
        )}
      </div>
    </div>
  );
}

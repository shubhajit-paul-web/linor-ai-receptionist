import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Animated stat card — numbers count up from 0 on mount.
 * Follows F-pattern: value prominence top-left, icon top-right, trend bottom.
 */
export function StatCard({ label, value, suffix = '', trend, trendValue, icon: Icon, iconBg, iconColor }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;

  // Count up animation on mount (600ms ease-out)
  useEffect(() => {
    const duration = 800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out: 1 - (1-t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * numericValue));

      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [numericValue]);

  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div className="bg-surface/40 backdrop-blur-xl border border-border/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-3 group-hover:text-text-secondary transition-colors">{label}</p>
          <p className="text-[32px] font-bold leading-none text-text-primary tracking-tight font-sans">
            {display}{suffix}
          </p>
        </div>
        {/* Colored icon circle */}
        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner',
              iconBg
            )}
          >
            <Icon size={20} className={iconColor} />
          </div>
        )}
      </div>

      {/* Trend indicator */}
      {trendValue && (
        <div className={cn(
          'flex items-center gap-1.5 text-[13px] font-medium mt-1',
          isPositive && 'text-success',
          isNegative && 'text-danger',
          !isPositive && !isNegative && 'text-text-muted'
        )}>
          {isPositive && <TrendingUp size={14} />}
          {isNegative && <TrendingDown size={14} />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

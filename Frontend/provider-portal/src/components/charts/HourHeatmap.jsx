import { HEATMAP_DATA } from '../../lib/mockData';
import Tooltip from '../shared/Tooltip';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12a';
  if (i < 12) return `${i}a`;
  if (i === 12) return '12p';
  return `${i - 12}p`;
});

/**
 * Map a cell's intensity (0…max) to an alpha-overlay on the
 * accent color. Uses color-mix so it adapts to dark/light theme
 * automatically — no hard-coded RGB.
 */
function intensityStyle(value, max) {
  const t = max === 0 ? 0 : Math.min(value / max, 1);
  // 0 → barely visible base, 1 → near-full accent
  const pct = Math.round(8 + t * 75);
  return { background: `color-mix(in srgb, var(--primary) ${pct}%, transparent)` };
}

export function HourHeatmap() {
  const maxVal = Math.max(...HEATMAP_DATA.flat().map((c) => c.value));

  return (
    <div aria-label="Hour-of-day interaction heatmap" className="w-full overflow-x-auto">
      {/* Hour axis */}
      <div className="flex ml-8 mb-1">
        {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
          <div
            key={h}
            style={{ flex: '0 0 calc(100% / 8)' }}
            className="text-[10px] text-text-muted text-center tabular-nums"
          >
            {h}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {HEATMAP_DATA.map((row, dayIdx) => (
        <div key={dayIdx} className="flex items-center gap-0.5 mb-0.5">
          <span className="w-8 text-[11px] text-text-muted text-right pr-2 flex-shrink-0">
            {DAYS[dayIdx]}
          </span>
          {row.map((cell) => (
            <Tooltip
              key={cell.hour}
              content={`${DAYS[cell.day]} ${HOURS[cell.hour]}: ${cell.value} sessions`}
            >
              <div
                className="heatmap-cell flex-1 relative"
                style={{ ...intensityStyle(cell.value, maxVal), minWidth: 12 }}
                role="gridcell"
                aria-label={`${DAYS[cell.day]} ${HOURS[cell.hour]}, ${cell.value} sessions`}
              />
            </Tooltip>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 ml-8">
        <span className="text-[11px] text-text-muted">Less</span>
        {[10, 25, 45, 65, 85].map((pct) => (
          <div
            key={pct}
            className="w-3.5 h-3.5 rounded-sm"
            style={{ background: `color-mix(in srgb, var(--primary) ${pct}%, transparent)` }}
            aria-hidden
          />
        ))}
        <span className="text-[11px] text-text-muted">More</span>
      </div>
    </div>
  );
}

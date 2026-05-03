import { HEATMAP_DATA } from '../../lib/mockData';
import Tooltip from '../shared/Tooltip';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12a';
  if (i < 12) return `${i}a`;
  if (i === 12) return '12p';
  return `${i - 12}p`;
});

/** Map an intensity value to a color with opacity */
function getColor(value, max = 20) {
  const intensity = Math.min(value / max, 1);
  // Use primary blue with scaled opacity
  return `rgba(26, 86, 219, ${0.08 + intensity * 0.75})`;
}

export function HourHeatmap() {
  const maxVal = Math.max(...HEATMAP_DATA.flat().map((c) => c.value));

  return (
    <div aria-label="Hour-of-day interaction heatmap" className="w-full overflow-x-auto">
      {/* Hour labels */}
      <div className="flex ml-8 mb-1">
        {HOURS.filter((_, i) => i % 3 === 0).map((h) => (
          <div key={h} style={{ flex: '0 0 calc(100% / 8)' }} className="text-[10px] text-text-muted text-center">
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
                style={{ background: getColor(cell.value, maxVal), minWidth: 12 }}
              />
            </Tooltip>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 ml-8">
        <span className="text-[11px] text-text-muted">Less</span>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((op) => (
          <div
            key={op}
            className="w-4 h-4 rounded-sm"
            style={{ background: `rgba(26, 86, 219, ${op})` }}
          />
        ))}
        <span className="text-[11px] text-text-muted">More</span>
      </div>
    </div>
  );
}

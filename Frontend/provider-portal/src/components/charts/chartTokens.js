/**
 * Centralized chart palette + recharts style props.
 * All values pull from CSS custom properties so dark/light/theme
 * swaps propagate without re-rendering the chart.
 */

export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
];

export const CHART_AXIS_COLOR = 'var(--text-muted)';
export const CHART_GRID_COLOR = 'var(--border)';
export const CHART_TOOLTIP_BG = 'var(--surface-overlay)';
export const CHART_TOOLTIP_BORDER = 'var(--border-strong)';

/** Drop-in recharts <Tooltip contentStyle={…}> values. */
export const CHART_TOOLTIP_STYLE = {
  background: CHART_TOOLTIP_BG,
  border: `1px solid ${CHART_TOOLTIP_BORDER}`,
  borderRadius: '8px',
  fontSize: '11px',
  padding: '6px 10px',
  boxShadow: 'var(--shadow-md)',
};

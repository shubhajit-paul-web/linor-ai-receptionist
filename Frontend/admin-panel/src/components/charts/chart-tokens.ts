/** Centralized chart palette pulling from CSS tokens so dark/light/density swap propagates. */

export const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-6)',
  'var(--color-chart-7)',
  'var(--color-chart-8)',
] as const;

export const CHART_AXIS_COLOR = 'var(--color-tertiary)';
export const CHART_GRID_COLOR = 'var(--color-border-subtle)';
export const CHART_TOOLTIP_BG = 'var(--color-overlay)';
export const CHART_TOOLTIP_BORDER = 'var(--color-border-default)';

export const CHART_TOOLTIP_STYLE = {
  background: CHART_TOOLTIP_BG,
  border: `1px solid ${CHART_TOOLTIP_BORDER}`,
  borderRadius: '8px',
  fontSize: '11px',
  padding: '6px 8px',
  boxShadow: 'var(--shadow-md)',
} as const;

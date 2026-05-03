import { FixedSizeList as List } from 'react-window';
import { memo, useMemo } from 'react';
import { cn } from '../../lib/utils';

/**
 * Virtualized table row component - memoized for performance
 * Prevents unnecessary re-renders when data outside this row hasn't changed
 */
const VirtualizedTableRow = memo(({ index, style, data }) => {
  const { columns, rows, onRowClick, selectedRowIds, onToggleRow } = data;
  const row = rows[index];

  // Skip rendering if no row data (safety check)
  if (!row) return null;

  const isSelected = selectedRowIds?.has(row.id);

  return (
    <tr
      style={style}
      onClick={() => onRowClick?.(row)}
      className={cn('cursor-pointer border-b border-border', isSelected && 'bg-primary-light')}
    >
      {columns.map((col) => {
        const cellContent = col.render
          ? col.render(row[col.key], row)
          : row[col.key];

        return (
          <td
            key={col.key}
            className={col.className || ''}
            onClick={(e) => {
              // Don't trigger row click if user interacts with checkbox
              if (e.target.type === 'checkbox') e.stopPropagation();
            }}
          >
            {col.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleRow?.(row.id)}
                className="rounded cursor-pointer"
              />
            ) : (
              cellContent
            )}
          </td>
        );
      })}
    </tr>
  );
}, (prevProps, nextProps) => {
  // Custom equality check: only re-render if specific data changes
  const { data: prevData } = prevProps;
  const { data: nextData } = nextProps;

  return (
    prevData.rows[prevProps.index]?.id === nextData.rows[nextProps.index]?.id &&
    prevData.selectedRowIds === nextData.selectedRowIds &&
    prevProps.style.top === nextProps.style.top
  );
});

VirtualizedTableRow.displayName = 'VirtualizedTableRow';

/**
 * VirtualizedTable - High-performance table component using windowing
 * Renders only visible rows, dramatically improving performance with large datasets
 *
 * Props:
 * - columns: Array of column definitions { key, header, render?, className?, type? }
 * - rows: Array of row data
 * - height: Height of the visible viewport
 * - itemSize: Height of each row in pixels
 * - onRowClick: Callback when a row is clicked
 * - selectedRowIds: Set of selected row IDs (for highlighting)
 * - onToggleRow: Callback to toggle row selection
 * - headerClass: CSS class for header styling
 */
export function VirtualizedTable({
  columns,
  rows,
  height = 500,
  itemSize = 48,
  onRowClick,
  selectedRowIds,
  onToggleRow,
  headerClass = '',
}) {
  // Memoize list data to avoid re-creating object on every render
  const listData = useMemo(
    () => ({ columns, rows, onRowClick, selectedRowIds, onToggleRow }),
    [columns, rows, onRowClick, selectedRowIds, onToggleRow]
  );

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      {/* Fixed header */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={cn(col.className, headerClass)}>
                  {col.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      onChange={() => {
                        // Handle "select all" functionality if needed
                        // This can be passed as a callback prop
                      }}
                      className="rounded cursor-pointer"
                    />
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Virtualized body with windowing */}
      {rows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <tbody>
              <List
                height={height}
                itemCount={rows.length}
                itemSize={itemSize}
                width="100%"
                itemData={listData}
              >
                {VirtualizedTableRow}
              </List>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-text-muted text-sm">
          No data available
        </div>
      )}
    </div>
  );
}

export default VirtualizedTable;

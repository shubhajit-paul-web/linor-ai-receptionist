import { FixedSizeList as List } from 'react-window';
import { memo } from 'react';
import { cn } from '../../lib/utils';

/**
 * Virtualized list item component - memoized for performance
 * Prevents unnecessary re-renders when data outside this item hasn't changed
 */
const VirtualizedListItem = memo(({ index, style, data }) => {
  const { items, renderItem, activeId, onSelectItem } = data;
  const item = items[index];

  if (!item) return null;

  const isActive = activeId === item.id;

  return (
    <div style={style} className="w-full">
      {renderItem(item, isActive, () => onSelectItem?.(item.id))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the item or active state changes
  const prevItem = prevProps.data.items[prevProps.index];
  const nextItem = nextProps.data.items[nextProps.index];

  return (
    prevItem?.id === nextItem?.id &&
    prevProps.data.activeId === nextProps.data.activeId &&
    prevProps.style.top === nextProps.style.top
  );
});

VirtualizedListItem.displayName = 'VirtualizedListItem';

/**
 * VirtualizedList - High-performance list component using windowing
 * Renders only visible items, dramatically improving performance with large datasets
 * Perfect for scrollable lists like chat sessions, appointments, etc.
 *
 * Props:
 * - items: Array of items to render
 * - renderItem: Function(item, isActive, onSelect) => JSX to render each item
 * - height: Height of the visible viewport
 * - itemSize: Height of each item in pixels
 * - activeId: ID of currently selected/active item
 * - onSelectItem: Callback when an item is selected
 * - containerClass: CSS class for the container
 * - emptyMessage: Message to show when no items
 */
export function VirtualizedList({
  items = [],
  renderItem,
  height = 500,
  itemSize = 80,
  activeId,
  onSelectItem,
  containerClass = '',
  emptyMessage = 'No items available',
}) {
  if (!items.length) {
    return (
      <div className={cn('flex items-center justify-center text-text-muted', containerClass)}>
        <span className="text-sm">{emptyMessage}</span>
      </div>
    );
  }

  // Memoized list data to prevent re-creates
  const listData = { items, renderItem, activeId, onSelectItem };

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemSize}
      width="100%"
      itemData={listData}
      className={containerClass}
    >
      {VirtualizedListItem}
    </List>
  );
}

export default VirtualizedList;

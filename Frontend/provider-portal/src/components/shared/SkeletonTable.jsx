import { cn } from '../../lib/utils';

/**
 * Skeleton loader components — match the exact shape of the content
 * they're replacing. Always use instead of a spinner for initial page loads.
 */

/** Generic shimmer bar */
export function SkeletonBar({ className }) {
  return <div className={cn('skeleton rounded', className)} />;
}

/** Skeleton for the stat cards row (4 cards) */
export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <SkeletonBar className="h-3 w-24 mb-3" />
              <SkeletonBar className="h-8 w-16" />
            </div>
            <SkeletonBar className="h-9 w-9 rounded-full" />
          </div>
          <SkeletonBar className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a data table */
export function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 border-b border-border">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBar key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div
          key={ri}
          className="flex gap-4 px-4 py-4 border-b border-border last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, ci) => (
            <SkeletonBar
              key={ci}
              className={cn('h-4 flex-1', ci === 0 && 'w-8 flex-none')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a chart card */
export function SkeletonChart({ height = 200 }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <SkeletonBar className="h-4 w-36" />
        <SkeletonBar className="h-7 w-40 rounded-md" />
      </div>
      <SkeletonBar className="w-full rounded-md" style={{ height }} />
    </div>
  );
}

/** Skeleton for a single FAQ card */
export function SkeletonFaqCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex gap-3">
      <SkeletonBar className="w-4 h-4 rounded mt-1 flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBar className="h-4 w-3/4 mb-2" />
        <SkeletonBar className="h-3 w-full mb-1" />
        <SkeletonBar className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/** Skeleton for a chat session list item */
export function SkeletonChatItem() {
  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <SkeletonBar className="h-3 w-24" />
        <SkeletonBar className="h-3 w-16" />
      </div>
      <SkeletonBar className="h-3 w-full mb-1" />
      <SkeletonBar className="h-3 w-3/4" />
    </div>
  );
}

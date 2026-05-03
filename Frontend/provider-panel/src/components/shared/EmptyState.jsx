import { cn } from '../../lib/utils';

/**
 * EmptyState — every list/table gets one.
 * Pattern: illustration + heading + description + optional CTA.
 * Tone: helpful and instructive, never apologetic.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-secondary flex items-center justify-center mb-4">
          <Icon size={32} className="text-text-muted" />
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'h-9 px-4 text-sm font-semibold rounded-md transition-colors duration-150',
            'bg-primary text-white hover:bg-primary-hover'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

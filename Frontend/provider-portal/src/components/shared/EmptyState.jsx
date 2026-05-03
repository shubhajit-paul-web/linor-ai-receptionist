import { cn } from '../../lib/utils';

/**
 * EmptyState — restrained, instructional empty placeholder.
 *
 * Use everywhere a list/table can be empty. Tone is helpful,
 * never apologetic. Renders a CTA when work is required.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-14 px-6 text-center',
        'border border-dashed border-border rounded-xl bg-surface',
        className,
      )}
      role="status"
    >
      {Icon && (
        <div className="w-11 h-11 rounded-xl bg-surface-secondary border border-border grid place-items-center mb-4 text-text-muted">
          <Icon size={20} />
        </div>
      )}
      <h3 className="text-[14px] font-semibold text-text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-[12.5px] text-text-muted max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 mt-5">
          {action && (
            <button
              onClick={action.onClick}
              className="h-8 px-3 text-[12.5px] font-semibold rounded-md bg-primary text-primary-on hover:bg-primary-hover transition-colors"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="h-8 px-3 text-[12.5px] font-medium rounded-md bg-surface border border-border text-text-secondary hover:bg-surface-secondary transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

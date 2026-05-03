import { cn } from '../../lib/utils';

/**
 * PageHeader — consistent page-top hero used across every route.
 *
 * Slots:
 *   title        — required, single h1.
 *   description  — optional supporting subtitle.
 *   meta         — small badges/timestamps rendered under the title.
 *   actions      — right-aligned button cluster (CTA, exports, …).
 *
 * The component intentionally has no card chrome; it lets the page
 * own the section layout below it.
 */
export function PageHeader({ title, description, meta, actions, className }) {
  return (
    <header className={cn('flex flex-col gap-2 mb-6', className)}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] md:text-[24px] font-semibold tracking-tight text-text-primary leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[13.5px] text-text-secondary max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>
    </header>
  );
}

/**
 * Section — labeled container for grouping page content.
 * Renders a small section title + optional description above
 * its children. Use to break long pages into legible chunks.
 */
export function Section({ title, description, actions, children, className }) {
  return (
    <section className={cn('flex flex-col gap-3', className)}>
      {(title || actions) && (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[15px] font-semibold text-text-primary tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[12.5px] text-text-muted mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

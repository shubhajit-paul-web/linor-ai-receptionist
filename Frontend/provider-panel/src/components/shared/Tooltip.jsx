import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

const PLACEMENT_FALLBACKS = {
  top: ['top', 'bottom', 'right', 'left'],
  right: ['right', 'left', 'top', 'bottom'],
  bottom: ['bottom', 'top', 'right', 'left'],
  left: ['left', 'right', 'top', 'bottom'],
};

function composeHandlers(original, next) {
  return (...args) => {
    original?.(...args);
    next?.(...args);
  };
}

function mergeRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else ref.current = node;
    });
  };
}

function clamp(value, min, max) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function getPosition(triggerRect, tooltipRect, placement, offset) {
  switch (placement) {
    case 'right':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + offset,
      };
    case 'bottom':
      return {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case 'left':
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - offset,
      };
    case 'top':
    default:
      return {
        top: triggerRect.top - tooltipRect.height - offset,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
  }
}

function getOverflow(coords, tooltipRect, viewportPadding) {
  const right = coords.left + tooltipRect.width;
  const bottom = coords.top + tooltipRect.height;

  return {
    top: Math.max(0, viewportPadding - coords.top),
    left: Math.max(0, viewportPadding - coords.left),
    right: Math.max(0, right - (window.innerWidth - viewportPadding)),
    bottom: Math.max(0, bottom - (window.innerHeight - viewportPadding)),
  };
}

function pickBestPlacement(preferredPlacement, triggerRect, tooltipRect, offset, viewportPadding) {
  const candidates = PLACEMENT_FALLBACKS[preferredPlacement] ?? PLACEMENT_FALLBACKS.top;
  let fallback = null;

  for (const placement of candidates) {
    const coords = getPosition(triggerRect, tooltipRect, placement, offset);
    const overflow = getOverflow(coords, tooltipRect, viewportPadding);
    const totalOverflow = overflow.top + overflow.right + overflow.bottom + overflow.left;

    if (totalOverflow === 0) return { placement, coords };
    if (!fallback || totalOverflow < fallback.totalOverflow) {
      fallback = { placement, coords, totalOverflow };
    }
  }

  return { placement: fallback?.placement ?? preferredPlacement, coords: fallback?.coords ?? { top: 0, left: 0 } };
}

function getTransformOrigin(placement) {
  if (placement === 'top') return 'bottom center';
  if (placement === 'bottom') return 'top center';
  if (placement === 'left') return 'center right';
  return 'center left';
}

export default function Tooltip({
  children,
  content,
  placement = 'top',
  offset = 10,
  delay = 120,
  disabled = false,
  className,
}) {
  const tooltipId = useId();
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const openTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement });

  const isDisabled = disabled || !content;

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updatePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const tooltipEl = tooltipRef.current;
    if (!triggerEl || !tooltipEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportPadding = 8;
    const best = pickBestPlacement(placement, triggerRect, tooltipRect, offset, viewportPadding);

    setPosition({
      placement: best.placement,
      top: clamp(
        best.coords.top,
        viewportPadding,
        window.innerHeight - tooltipRect.height - viewportPadding
      ),
      left: clamp(
        best.coords.left,
        viewportPadding,
        window.innerWidth - tooltipRect.width - viewportPadding
      ),
    });
  }, [offset, placement]);

  const openTooltip = useCallback(() => {
    if (isDisabled) return;
    clearTimers();
    openTimerRef.current = setTimeout(() => {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
    }, delay);
  }, [clearTimers, delay, isDisabled]);

  const closeTooltip = useCallback(() => {
    clearTimers();
    setIsVisible(false);
    closeTimerRef.current = setTimeout(() => setIsMounted(false), 120);
  }, [clearTimers]);

  useLayoutEffect(() => {
    if (!isMounted) return;
    updatePosition();
  }, [content, isMounted, updatePosition]);

  useEffect(() => {
    if (!isMounted) return undefined;

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isMounted, updatePosition]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  if (isDisabled || !isValidElement(children)) return children;

  const child = Children.only(children);
  const describedBy = child.props['aria-describedby'];
  const mergedDescribedBy = isMounted
    ? (describedBy ? `${describedBy} ${tooltipId}` : tooltipId)
    : describedBy;

  const trigger = cloneElement(child, {
    ref: mergeRefs(child.ref, triggerRef),
    onMouseEnter: composeHandlers(child.props.onMouseEnter, openTooltip),
    onMouseLeave: composeHandlers(child.props.onMouseLeave, closeTooltip),
    onFocus: composeHandlers(child.props.onFocus, openTooltip),
    onBlur: composeHandlers(child.props.onBlur, closeTooltip),
    onKeyDown: composeHandlers(child.props.onKeyDown, (event) => {
      if (event.key === 'Escape') closeTooltip();
    }),
    'aria-describedby': mergedDescribedBy,
  });

  return (
    <>
      {trigger}
      {isMounted && createPortal(
        <div
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          className={cn(
            'fixed z-[90] pointer-events-none max-w-[260px] rounded-md border border-border bg-surface',
            'px-2.5 py-1.5 text-xs font-medium leading-relaxed text-text-primary',
            'shadow-[0_8px_30px_rgba(15,22,33,0.16)] transition-all duration-150 ease-out',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transformOrigin: getTransformOrigin(position.placement),
          }}
        >
          {content}
          <span
            aria-hidden
            className={cn(
              'absolute h-2.5 w-2.5 rotate-45 border border-border bg-surface',
              position.placement === 'top' && '-bottom-1 left-1/2 -translate-x-1/2',
              position.placement === 'right' && '-left-1 top-1/2 -translate-y-1/2',
              position.placement === 'bottom' && '-top-1 left-1/2 -translate-x-1/2',
              position.placement === 'left' && '-right-1 top-1/2 -translate-y-1/2'
            )}
          />
        </div>,
        document.body
      )}
    </>
  );
}

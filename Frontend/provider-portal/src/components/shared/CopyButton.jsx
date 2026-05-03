import { useState, useCallback } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';
import { copyToClipboard } from '../../lib/utils';
import { cn } from '../../lib/utils';

/**
 * Copy button with 2-second success state feedback.
 * Used on API key, embed code, and any copyable text.
 */
export function CopyButton({ text, className, size = 'sm' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [text]);

  const sizeClasses = {
    sm: 'h-7 px-2 text-xs gap-1',
    md: 'h-9 px-3 text-sm gap-1.5',
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center rounded-md font-medium transition-all duration-150',
        'border border-border hover:border-border-strong',
        'bg-surface hover:bg-surface-secondary',
        'text-text-secondary hover:text-text-primary',
        copied && 'border-success text-success bg-success-light',
        sizeClasses[size],
        className
      )}
    >
      {copied ? (
        <>
          <Check size={12} />
          Copied!
        </>
      ) : (
        <>
          <ClipboardCopy size={12} />
          Copy
        </>
      )}
    </button>
  );
}

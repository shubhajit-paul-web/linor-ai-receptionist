import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names intelligently, resolving Tailwind conflicts.
 * Always use this instead of raw clsx for component variants.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string.
 * Uses short locale format to keep table cells compact.
 */
export function formatDate(date, opts = {}) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  });
}

/**
 * Format time to HH:MM AM/PM.
 */
export function formatTime(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}



export function formatDateTime(date) {
  if (!date) return '—';
  return `${formatDate(date)}, ${formatTime(date)}`;
}



/**
 * Truncate a string to a given length with ellipsis.
 */
export function truncate(str, length = 50) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '…' : str;
}

/**
 * Mask an API key — show only last 4 chars.
 */
export function maskApiKey(key) {
  if (!key || key.length < 8) return '••••••••';
  return `sk-${'•'.repeat(16)}${key.slice(-4)}`;
}

/**
 * Generate a random mock API key for demo purposes.
 */
export function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const key = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `sk-${key}`;
}

/**
 * Copy text to clipboard with fallback.
 * Returns a promise so callers can show success state.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}

/**
 * Debounce a function. Returns a debounced version.
 * Used for search inputs and auto-save triggers.
 */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Get initials from a name for avatar fallbacks.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Format a number with K/M suffix for display in stat cards.
 */
export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Sleep utility for simulating async operations in mock data.
 * Use sparingly — only in dev/demo mocks, never in real API calls.
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes deterministically — used by every shadcn primitive. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Exhaustiveness helper: place in `default:` of a switch on a union to assert all branches are handled. */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

/** Sleep helper — used by the mock adapter to simulate latency. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Random float between min (inclusive) and max (exclusive). */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** Random integer between min (inclusive) and max (inclusive). */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Compact, locale-aware number formatting (e.g. 1.2k, 3.4M). */
const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

/** Currency formatter; defaults to USD. */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

/** Percent formatter — accepts 0..1 or 0..100, inferred. */
export function formatPercent(value: number, fractionDigits = 1): string {
  const normalized = value > 1 ? value / 100 : value;
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(normalized);
}

/** Pick N items deterministically from an array. */
export function pickN<T>(items: readonly T[], n: number): T[] {
  if (n >= items.length) return [...items];
  const copy = [...items];
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    const removed = copy.splice(idx, 1)[0];
    if (removed !== undefined) out.push(removed);
  }
  return out;
}

/** Type-safe object keys. */
export function objectKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

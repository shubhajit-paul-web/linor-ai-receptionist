/** Runtime configuration sourced from Vite env. Validated once on app boot. */

type ApiMode = 'mock' | 'live';

function parseApiMode(value: string | undefined): ApiMode {
  return value === 'live' ? 'live' : 'mock';
}

function parseBool(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

export const config = {
  apiMode: parseApiMode(import.meta.env.VITE_API_MODE),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1',
  telemetryEnabled: parseBool(import.meta.env.VITE_TELEMETRY_ENABLED, false),
  appName: 'Linor',
  appTagline: 'Super Admin',
  version: '0.1.0',
} as const;

export type AppConfig = typeof config;

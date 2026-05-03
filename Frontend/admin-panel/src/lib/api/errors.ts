/** Discriminated, typed error class used across the API surface. */
export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, opts: { code?: string; status?: number; details?: unknown } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = opts.code ?? 'unknown';
    this.status = opts.status ?? 500;
    this.details = opts.details;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

import { config } from '@/lib/config';
import { ApiError } from './errors';
import { sleep, randomInt } from '@/lib/utils';

/**
 * The API client is split into:
 *  - `request<T>()`: low-level fetcher used in live mode (HTTP).
 *  - `mockExec<T>()`: adapter that runs an in-process handler with simulated latency / error rate.
 *
 * Higher-level resource APIs (in `features/*\/api.ts`) call `apiCall()` which dispatches
 * based on `config.apiMode`. This means: switching to a real backend requires only
 * `VITE_API_MODE=live` and that the live endpoints match the typed `Operation` table.
 */

export interface Operation<I, O> {
  /** Stable name used as query key fragment. */
  name: string;
  /** Live HTTP method + path (used when apiMode === 'live'). */
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: (input: I) => string;
  /** Mock handler executed in-process. */
  mock: (input: I) => Promise<O> | O;
}

const SIMULATED_FAILURE_RATE = 0.005; // 0.5% — enough to exercise error states, rare enough not to annoy.

async function request<O>(method: string, path: string, body?: unknown): Promise<O> {
  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  const res = await fetch(url, init);
  if (!res.ok) {
    let payload: unknown = undefined;
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    throw new ApiError(`${method} ${path} failed`, {
      status: res.status,
      code: `http_${res.status}`,
      details: payload,
    });
  }
  return (await res.json()) as O;
}

async function mockExec<I, O>(op: Operation<I, O>, input: I): Promise<O> {
  await sleep(randomInt(60, 380));
  if (Math.random() < SIMULATED_FAILURE_RATE) {
    throw new ApiError(`Simulated transient failure in ${op.name}`, {
      status: 503,
      code: 'mock_transient',
    });
  }
  return op.mock(input);
}

export function apiCall<I, O>(op: Operation<I, O>, input: I): Promise<O> {
  if (config.apiMode === 'live') {
    const path = op.path(input);
    if (op.method === 'GET' || op.method === 'DELETE') {
      return request<O>(op.method, path);
    }
    return request<O>(op.method, path, input);
  }
  return mockExec(op, input);
}

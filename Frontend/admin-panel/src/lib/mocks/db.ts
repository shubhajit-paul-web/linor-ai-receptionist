import { getSeedDb, type SeedDb } from './seed';

/**
 * In-memory mock store. Holds seeded data + provides paginate/filter/sort utilities
 * shared by the mock handlers. Mutations (create/update/delete) write here so the UI
 * sees consistent state across queries during a session.
 */
export const db: SeedDb = getSeedDb();

export interface PageParams {
  page?: number | undefined;
  pageSize?: number | undefined;
  sort?: string | undefined;
  dir?: 'asc' | 'desc' | undefined;
  q?: string | undefined;
  filters?: Record<string, string | string[] | undefined> | undefined;
}

export interface PageResult<T> {
  items: T[];
  pagination: { page: number; pageSize: number; total: number };
}

function applySearch<T extends Record<string, unknown>>(items: T[], q: string | undefined, fields: (keyof T)[]): T[] {
  if (!q) return items;
  const needle = q.toLowerCase();
  return items.filter((item) =>
    fields.some((f) => {
      const v = item[f];
      return typeof v === 'string' && v.toLowerCase().includes(needle);
    }),
  );
}

function applyFilters<T extends Record<string, unknown>>(
  items: T[],
  filters: Record<string, string | string[] | undefined> | undefined,
): T[] {
  if (!filters) return items;
  return items.filter((item) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined) continue;
      const target = item[key];
      const list = Array.isArray(value) ? value : [value];
      if (!list.includes(String(target))) return false;
    }
    return true;
  });
}

function applySort<T extends Record<string, unknown>>(items: T[], sort: string | undefined, dir: 'asc' | 'desc' = 'asc'): T[] {
  if (!sort) return items;
  const sign = dir === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];
    if (av === bv) return 0;
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign;
    return String(av).localeCompare(String(bv)) * sign;
  });
}

export function paginate<T extends Record<string, unknown>>(
  items: T[],
  params: PageParams,
  searchFields: (keyof T)[] = [],
): PageResult<T> {
  const filtered = applyFilters(applySearch(items, params.q, searchFields), params.filters);
  const sorted = applySort(filtered, params.sort, params.dir);
  const page = params.page ?? 0;
  const pageSize = params.pageSize ?? 25;
  const start = page * pageSize;
  return {
    items: sorted.slice(start, start + pageSize),
    pagination: { page, pageSize, total: filtered.length },
  };
}

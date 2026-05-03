import { z } from 'zod';

export const idSchema = z.string().min(1);

export const timestampSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export function makePaginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    pagination: paginationSchema,
  });
}

export const sortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof sortDirectionSchema>;

export const listQuerySchema = z.object({
  q: z.string().optional(),
  page: z.number().int().nonnegative().default(0),
  pageSize: z.number().int().positive().max(200).default(25),
  sort: z.string().optional(),
  dir: sortDirectionSchema.optional(),
  filters: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

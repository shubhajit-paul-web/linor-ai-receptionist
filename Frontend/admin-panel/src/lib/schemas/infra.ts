import { z } from 'zod';
import { idSchema, timestampSchema } from './common';

export const serviceStatusSchema = z.enum(['operational', 'degraded', 'partial-outage', 'outage', 'maintenance']);
export type ServiceStatus = z.infer<typeof serviceStatusSchema>;

export const serviceHealthSchema = z.object({
  id: idSchema,
  name: z.string(),
  category: z.enum(['api', 'worker', 'model', 'storage', 'queue', 'telephony', 'integration']),
  status: serviceStatusSchema,
  uptime30d: z.number().min(0).max(1),
  p50LatencyMs: z.number().nonnegative(),
  p95LatencyMs: z.number().nonnegative(),
  p99LatencyMs: z.number().nonnegative(),
  errorRate: z.number().min(0).max(1),
  errorBudgetRemaining: z.number().min(0).max(1),
  region: z.string(),
  lastIncidentAt: timestampSchema.nullable(),
});
export type ServiceHealth = z.infer<typeof serviceHealthSchema>;

export const incidentSeveritySchema = z.enum(['SEV-1', 'SEV-2', 'SEV-3', 'SEV-4']);
export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;

export const incidentSchema = z.object({
  id: idSchema,
  title: z.string(),
  severity: incidentSeveritySchema,
  status: z.enum(['investigating', 'identified', 'monitoring', 'resolved']),
  affectedServices: z.array(z.string()),
  openedAt: timestampSchema,
  resolvedAt: timestampSchema.nullable(),
  commander: z.string(),
  summary: z.string(),
});
export type Incident = z.infer<typeof incidentSchema>;

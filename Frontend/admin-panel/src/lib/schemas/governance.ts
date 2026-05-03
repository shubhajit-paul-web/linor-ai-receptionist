import { z } from 'zod';
import { idSchema, timestampSchema } from './common';

export const auditEventSchema = z.object({
  id: idSchema,
  actorId: idSchema,
  actorName: z.string(),
  actorRole: z.string(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: idSchema,
  hospitalId: idSchema.nullable(),
  before: z.record(z.string(), z.unknown()).nullable(),
  after: z.record(z.string(), z.unknown()).nullable(),
  ip: z.string(),
  userAgent: z.string(),
  occurredAt: timestampSchema,
});
export type AuditEvent = z.infer<typeof auditEventSchema>;

export const featureFlagSchema = z.object({
  id: idSchema,
  key: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  rolloutPct: z.number().min(0).max(100),
  targetHospitals: z.array(idSchema),
  environment: z.enum(['development', 'staging', 'production']),
  updatedAt: timestampSchema,
  updatedBy: z.string(),
});
export type FeatureFlag = z.infer<typeof featureFlagSchema>;

export const announcementSchema = z.object({
  id: idSchema,
  title: z.string(),
  body: z.string(),
  severity: z.enum(['info', 'warning', 'critical']),
  audience: z.enum(['all', 'admins', 'specific']),
  targetHospitalIds: z.array(idSchema),
  scheduledFor: timestampSchema.nullable(),
  publishedAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
  createdBy: z.string(),
});
export type Announcement = z.infer<typeof announcementSchema>;

export const apiKeySchema = z.object({
  id: idSchema,
  name: z.string(),
  prefix: z.string(),
  scopes: z.array(z.string()),
  hospitalId: idSchema.nullable(),
  lastUsedAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
  createdBy: z.string(),
  expiresAt: timestampSchema.nullable(),
  revoked: z.boolean(),
});
export type ApiKey = z.infer<typeof apiKeySchema>;

export const complianceControlSchema = z.object({
  id: idSchema,
  framework: z.enum(['HIPAA', 'SOC2', 'GDPR', 'ISO27001']),
  controlId: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['compliant', 'in-progress', 'gap', 'not-applicable']),
  owner: z.string(),
  evidenceCount: z.number().int().nonnegative(),
  lastReviewedAt: timestampSchema,
});
export type ComplianceControl = z.infer<typeof complianceControlSchema>;

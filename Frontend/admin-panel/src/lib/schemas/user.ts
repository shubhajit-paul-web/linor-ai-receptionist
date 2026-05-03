import { z } from 'zod';
import { idSchema, timestampSchema } from './common';
import { ROLES } from '@/app/permissions';

export const userScopeSchema = z.enum(['linor', 'hospital']);
export type UserScope = z.infer<typeof userScopeSchema>;

export const userStatusSchema = z.enum(['active', 'invited', 'disabled']);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const userSchema = z.object({
  id: idSchema,
  scope: userScopeSchema,
  hospitalId: idSchema.nullable(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(ROLES).or(z.string()),
  title: z.string().nullable(),
  status: userStatusSchema,
  lastSeenAt: timestampSchema.nullable(),
  mfaEnabled: z.boolean(),
  createdAt: timestampSchema,
});
export type User = z.infer<typeof userSchema>;

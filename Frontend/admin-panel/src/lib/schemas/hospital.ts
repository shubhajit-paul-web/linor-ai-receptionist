import { z } from 'zod';
import { idSchema, timestampSchema } from './common';

export const planTierSchema = z.enum(['Starter', 'Growth', 'Scale', 'Enterprise']);
export type PlanTier = z.infer<typeof planTierSchema>;

export const hospitalStatusSchema = z.enum(['active', 'trialing', 'paused', 'suspended', 'archived']);
export type HospitalStatus = z.infer<typeof hospitalStatusSchema>;

export const regionSchema = z.enum(['us-east', 'us-west', 'eu-west', 'ap-south', 'ap-southeast']);
export type Region = z.infer<typeof regionSchema>;

export const hospitalSchema = z.object({
  id: idSchema,
  slug: z.string(),
  name: z.string(),
  legalName: z.string(),
  logoUrl: z.string().url().nullable(),
  status: hospitalStatusSchema,
  planTier: planTierSchema,
  region: regionSchema,
  primaryDomain: z.string(),
  contactEmail: z.string().email(),
  phone: z.string(),
  branchCount: z.number().int().nonnegative(),
  departmentCount: z.number().int().nonnegative(),
  userCount: z.number().int().nonnegative(),
  agentCount: z.number().int().nonnegative(),
  monthlyConversations: z.number().int().nonnegative(),
  monthlyCalls: z.number().int().nonnegative(),
  bookingRate: z.number().min(0).max(1),
  csat: z.number().min(0).max(5),
  mrrUsd: z.number().nonnegative(),
  uptimePct: z.number().min(0).max(1),
  riskScore: z.number().min(0).max(100),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  tags: z.array(z.string()).default([]),
});

export type Hospital = z.infer<typeof hospitalSchema>;

export const branchSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  name: z.string(),
  city: z.string(),
  country: z.string(),
  timezone: z.string(),
  beds: z.number().int().nonnegative(),
  staffCount: z.number().int().nonnegative(),
  status: z.enum(['active', 'inactive']),
  createdAt: timestampSchema,
});
export type Branch = z.infer<typeof branchSchema>;

export const departmentSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  branchId: idSchema,
  name: z.string(),
  specialty: z.string(),
  headPhysician: z.string().nullable(),
  staffCount: z.number().int().nonnegative(),
  monthlyAppointments: z.number().int().nonnegative(),
  createdAt: timestampSchema,
});
export type Department = z.infer<typeof departmentSchema>;

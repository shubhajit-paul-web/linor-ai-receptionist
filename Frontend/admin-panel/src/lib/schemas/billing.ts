import { z } from 'zod';
import { idSchema, timestampSchema } from './common';
import { planTierSchema } from './hospital';

export const planSchema = z.object({
  id: idSchema,
  tier: planTierSchema,
  name: z.string(),
  monthlyPriceUsd: z.number().nonnegative(),
  annualPriceUsd: z.number().nonnegative(),
  includedConversations: z.number().int().nonnegative(),
  includedSeats: z.number().int().nonnegative(),
  features: z.array(z.string()),
  active: z.boolean(),
  createdAt: timestampSchema,
});
export type Plan = z.infer<typeof planSchema>;

export const subscriptionStatusSchema = z.enum([
  'active',
  'trialing',
  'past_due',
  'paused',
  'cancelled',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const subscriptionSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  planId: idSchema,
  status: subscriptionStatusSchema,
  currentPeriodStart: timestampSchema,
  currentPeriodEnd: timestampSchema,
  cancelAtPeriodEnd: z.boolean(),
  seats: z.number().int().nonnegative(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

export const invoiceStatusSchema = z.enum(['paid', 'open', 'void', 'uncollectible', 'draft']);
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

export const invoiceSchema = z.object({
  id: idSchema,
  number: z.string(),
  hospitalId: idSchema,
  amountUsd: z.number().nonnegative(),
  status: invoiceStatusSchema,
  issuedAt: timestampSchema,
  dueAt: timestampSchema,
  paidAt: timestampSchema.nullable(),
  pdfUrl: z.string().url().nullable(),
});
export type Invoice = z.infer<typeof invoiceSchema>;

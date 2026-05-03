import { z } from 'zod';
import { idSchema, timestampSchema } from './common';
import { agentChannelSchema } from './agent';

export const sentimentSchema = z.enum(['positive', 'neutral', 'negative']);
export type Sentiment = z.infer<typeof sentimentSchema>;

export const conversationOutcomeSchema = z.enum([
  'booked',
  'rescheduled',
  'cancelled',
  'info-only',
  'transferred',
  'unresolved',
]);
export type ConversationOutcome = z.infer<typeof conversationOutcomeSchema>;

export const conversationSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  agentId: idSchema,
  channel: agentChannelSchema,
  patientName: z.string(),
  startedAt: timestampSchema,
  endedAt: timestampSchema.nullable(),
  durationSec: z.number().nonnegative(),
  messageCount: z.number().int().nonnegative(),
  sentiment: sentimentSchema,
  outcome: conversationOutcomeSchema,
  language: z.string(),
  csat: z.number().min(0).max(5).nullable(),
  topic: z.string(),
  flagged: z.boolean(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const callSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  agentId: idSchema,
  conversationId: idSchema.nullable(),
  fromNumber: z.string(),
  toNumber: z.string(),
  startedAt: timestampSchema,
  durationSec: z.number().nonnegative(),
  status: z.enum(['completed', 'missed', 'voicemail', 'failed', 'in-progress']),
  recordingUrl: z.string().url().nullable(),
  asrConfidence: z.number().min(0).max(1),
  ttsLatencyMs: z.number().nonnegative(),
  llmLatencyMs: z.number().nonnegative(),
  endToEndLatencyMs: z.number().nonnegative(),
});
export type Call = z.infer<typeof callSchema>;

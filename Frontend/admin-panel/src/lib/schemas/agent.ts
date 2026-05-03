import { z } from 'zod';
import { idSchema, timestampSchema } from './common';

export const agentStatusSchema = z.enum(['live', 'training', 'paused', 'draft']);
export type AgentStatus = z.infer<typeof agentStatusSchema>;

export const agentChannelSchema = z.enum(['voice', 'chat', 'sms', 'whatsapp']);
export type AgentChannel = z.infer<typeof agentChannelSchema>;

export const agentSchema = z.object({
  id: idSchema,
  hospitalId: idSchema,
  name: z.string(),
  description: z.string(),
  status: agentStatusSchema,
  channels: z.array(agentChannelSchema).min(1),
  model: z.string(),
  voice: z.string().nullable(),
  language: z.string(),
  knowledgeBaseId: idSchema.nullable(),
  monthlyConversations: z.number().int().nonnegative(),
  avgLatencyMs: z.number().nonnegative(),
  successRate: z.number().min(0).max(1),
  csat: z.number().min(0).max(5),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});
export type Agent = z.infer<typeof agentSchema>;

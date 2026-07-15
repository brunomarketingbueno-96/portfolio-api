import { z } from 'zod';

export const aiProviderSchema = z.object({
  id: z.string().optional(),

  name: z.string()
    .min(3, { message: 'settings.error.ai_provider_name_min' }),

  provider: z.enum(['openai', 'groq', 'gemini'] as const, {
    error: 'settings.error.ai_provider'
  }),

  key: z.string().optional().or(z.literal('')),

  isActive: z.boolean().default(false).optional(),
}).refine((data) => {

  if (!data.id && (!data.key || data.key.trim() === '')) {
    return false;
  }
  return true;

}, {
  message: 'settings.error.ai_provider_key_required',
  path: ['key']
});

export type AIProvider = z.infer<typeof aiProviderSchema>;
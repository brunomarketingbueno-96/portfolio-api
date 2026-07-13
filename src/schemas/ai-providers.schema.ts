import { z } from 'zod';

export const aiProviderSchema = z.object({
  name: z.string()
    .min(3, { message: 'settings.error.ai_provider_name_min' }),

  provider: z.enum(['openai', 'groq', 'gemini'] as const, {
    error: 'settings.error.ai_provider'
  }),

  key: z.string()
    .min(1, { message: 'settings.error.ai_provider_key_required' }),

  isActive: z.boolean().default(false).optional(),
}).strict();

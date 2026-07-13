import { z } from 'zod';

import { aiProviderSchema } from '../../../src/schemas/ai-providers.schema';
export type NewAiProvider = z.infer<typeof aiProviderSchema>;

export type AiProvider = NewAiProvider & { id: string };
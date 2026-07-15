import { z } from 'zod';

import { aiProviderSchema } from '../../../src/schemas/ai-providers.schema';
export type AIProvider = z.infer<typeof aiProviderSchema>;

export type SafeAiProvider = Omit<AIProvider, 'key'> & {
  id: string;
};
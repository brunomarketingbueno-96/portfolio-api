import { z } from 'zod';
import { settingsSchema } from '../../../src/schemas/settings.schema';
import type { AIProvider } from './AiProvider.d.ts';

export type Settings = z.infer<typeof settingsSchema>;
export type GlobalSettings = Settings & {
  id: string;
  aiKeys?: AIProvider[];
};

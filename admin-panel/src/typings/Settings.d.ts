import { z } from 'zod';
import { settingsSchema } from '../../../../src/schemas/settings.schema';

export type NewSettings = z.infer<typeof settingsSchema>;

export type GlobalSettings = z.infer<NewSettings> & {
  id: string;
  aiKeys?: AiProvider[];
};
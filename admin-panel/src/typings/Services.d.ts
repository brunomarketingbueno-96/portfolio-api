import { z } from 'zod';

import { serviceSchema } from '../../../src/schemas/services.schema';

export type NewService = z.infer<typeof serviceSchema>;

export type Service = NewService & {
  id: string;
};
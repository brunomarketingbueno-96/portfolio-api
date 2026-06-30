import { handleResponse } from '@/helpers/fetchHelpers';

import { z } from 'zod';
import { settingsSchema } from '../../../src/schemas/settings.schema';

type Settings = z.infer<typeof settingsSchema>;

export const SettingsService = {
  async get(): Promise<Settings> {
    const res = await fetch('/api/settings', { credentials: 'include' });
    return handleResponse(res);
  },

  async update(payload: Partial<Settings>): Promise<Settings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  }
};

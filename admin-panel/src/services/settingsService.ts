import { handleResponse } from '@/helpers/fetchHelpers';
import type { GlobalSettings } from '@/typings/Settings';

export const SettingsService = {
  async get(): Promise<GlobalSettings> {
    const res = await fetch('/api/settings', { credentials: 'include' });
    return handleResponse(res);
  },

  async update(payload: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  }
};

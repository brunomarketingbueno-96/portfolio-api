import { Context } from 'hono';

import {
  findGlobalSettings,
  updateGlobalSettingsRecord
} from '../repositories/settings.repository.js';

import { settingsSchema } from '../schemas/settings.schema.js';

export const getSettings = async (c: Context) => {
  try {
    const settings = await findGlobalSettings();

    if (!settings) return c.json({
      error: 'settings.error.not_found', message: 'Settings not found'
    }, 404);

    return c.json(settings, 200);

  } catch (error: any) {
    return c.json({ error: 'settings.error.get', message: error.message }, 500);
  }
};

export const updateSettings = async (c: Context) => {
  try {
    const settingsData = settingsSchema.parse(await c.req.json());

    const existingSettings = await findGlobalSettings();

    if (!existingSettings) return c.json({
      error: 'settings.error.not_found', message: 'Settings not found'
    }, 404);

    const updatedSettings = await updateGlobalSettingsRecord(existingSettings.id, settingsData);

    if (!updatedSettings) return c.json({
      error: 'settings.error.update', message: 'Settings not updated'
    }, 422);

    return c.json(updatedSettings, 200);

  } catch (error: any) {
    return c.json({ error: 'settings.error.update', message: error.message }, 500);
  }
};

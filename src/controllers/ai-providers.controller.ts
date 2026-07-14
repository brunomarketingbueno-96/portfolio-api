import { Context } from 'hono';

import type { AIProvider } from '../schemas/ai-providers.schema.js';
import { findGlobalSettings } from '../repositories/settings.repository.js';

import {
  createAiProviderRecord,
  updateAiProviderRecord,
  deleteAiProviderRecord
} from '../repositories/ai-providers.repository.js';

export const createAiProvider = async (c: Context) => {
  try {
    const data = await c.req.json<AIProvider>();

    const settings = await findGlobalSettings();
    if (!settings) return c.json({
      error: 'settings.error.not_found', message: 'Settings not found'
    }, 404);

    const newProvider = await createAiProviderRecord({
      ...data,
      settingsId: settings.id
    });

    if (!newProvider) return c.json({
      error: 'ai_providers.error.create', message: 'AI Provider not created'
    }, 422);

    return c.json(newProvider, 201);

  } catch (error: any) {
    return c.json({ error: 'ai_providers.error.create', message: error.message }, 500);
  }
};

export const updateAiProvider = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const data = await c.req.json<AIProvider>();

    const updatedProvider = await updateAiProviderRecord(id, data);
    if (!updatedProvider) return c.json({
      error: 'ai_providers.error.update', message: 'AI Provider not updated'
    }, 422);

    return c.json(updatedProvider, 200);

  } catch (error: any) {
    return c.json({ error: 'ai_providers.error.update', message: error.message }, 500);
  }
};

export const deleteAiProvider = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const deletedProvider = await deleteAiProviderRecord(id);
    if (!deletedProvider) return c.json({
      error: 'ai_providers.error.delete', message: 'AI Provider not deleted'
    }, 422);

    return c.json(deletedProvider, 200);

  } catch (error: any) {
    return c.json({ error: 'ai_providers.error.delete', message: error.message }, 500);
  }
};

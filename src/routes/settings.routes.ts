import { Hono } from 'hono';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { settingsSchema } from '../schemas/settings.schema.js';

const settings = new Hono();

settings.get('/', authMiddleware, getSettings);
settings.put('/', authMiddleware, zValidator('json', settingsSchema), updateSettings);

export default settings;
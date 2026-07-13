import { Hono } from 'hono';

import {
  createAiProvider,
  updateAiProvider,
  deleteAiProvider
} from '../controllers/ai-providers.controller.js';

import { authMiddleware } from '../middlewares/auth.js';

import { zValidator } from '@hono/zod-validator';
import { aiProviderSchema } from '../schemas/ai-providers.schema.js';

const aiProvider = new Hono();

aiProvider.post('/', authMiddleware, zValidator('json', aiProviderSchema), createAiProvider);
aiProvider.put('/:id', authMiddleware, zValidator('json', aiProviderSchema), updateAiProvider);
aiProvider.delete('/:id', authMiddleware, deleteAiProvider);

export default aiProvider;
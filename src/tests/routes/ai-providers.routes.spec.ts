import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

import aiProviderRoutes from '../../routes/ai-providers.routes.js';
import { authMiddleware } from '../../middlewares/auth.js';
import {
  createAiProvider,
  updateAiProvider,
  deleteAiProvider,
} from '../../controllers/ai-providers.controller.js';

vi.mock('../../controllers/ai-providers.controller.js', () => ({
  createAiProvider: vi.fn((c) => c.json({ id: 'provider-123', name: 'OpenAI' }, 201)),
  updateAiProvider: vi.fn((c) => c.json({ id: 'provider-123', name: 'OpenAI Updated' }, 200)),
  deleteAiProvider: vi.fn((c) => c.json({ id: 'provider-123' }, 200)),
}));

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: '123', email: 'admin@example.com' });
    await next();
  }),
}));

describe('AI Providers Routes', () => {
  let app: Hono;

  const validPayload = {
    name: 'OpenAI Test',
    provider: 'openai',
    key: 'sk-test-key',
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route('/ai-providers', aiProviderRoutes);
  });

  describe('POST /ai-providers', () => {
    it('should create an AI provider with valid payload when authenticated', async () => {
      const res = await app.request('/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toEqual({ id: 'provider-123', name: 'OpenAI' });
      expect(authMiddleware).toHaveBeenCalled();
      expect(createAiProvider).toHaveBeenCalled();
    });

    it('should return 400 with invalid payload due to schema validation', async () => {
      const invalidPayload = {
        name: 'Op', // too short
        provider: 'unknown-provider',
        key: '',
      };

      const res = await app.request('/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      expect(res.status).toBe(400);
      expect(createAiProvider).not.toHaveBeenCalled();
    });

    it('should block request when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/ai-providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      expect(res.status).toBe(401);
      expect(createAiProvider).not.toHaveBeenCalled();
    });
  });

  describe('PUT /ai-providers/:id', () => {
    it('should update the AI provider with valid payload when authenticated', async () => {
      const res = await app.request('/ai-providers/provider-123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ id: 'provider-123', name: 'OpenAI Updated' });
      expect(authMiddleware).toHaveBeenCalled();
      expect(updateAiProvider).toHaveBeenCalled();
    });

    it('should return 400 with invalid payload due to schema validation', async () => {
      const invalidPayload = {
        name: 'Op',
      };

      const res = await app.request('/ai-providers/provider-123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      expect(res.status).toBe(400);
      expect(updateAiProvider).not.toHaveBeenCalled();
    });

    it('should block request when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/ai-providers/provider-123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validPayload),
      });

      expect(res.status).toBe(401);
      expect(updateAiProvider).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /ai-providers/:id', () => {
    it('should delete the AI provider when authenticated', async () => {
      const res = await app.request('/ai-providers/provider-123', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ id: 'provider-123' });
      expect(authMiddleware).toHaveBeenCalled();
      expect(deleteAiProvider).toHaveBeenCalled();
    });

    it('should block request when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/ai-providers/provider-123', {
        method: 'DELETE',
      });

      expect(res.status).toBe(401);
      expect(deleteAiProvider).not.toHaveBeenCalled();
    });
  });
});

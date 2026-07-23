import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';

import settingsRoutes from '../../routes/settings.routes.js';
import { authMiddleware } from '../../middlewares/auth.js';
import { getSettings, updateSettings } from '../../controllers/settings.controller.js';

vi.mock('../../controllers/settings.controller.js', () => ({
  getSettings: vi.fn((c) => c.json({ theme: 'dark', panelLanguage: 'en' })),
  updateSettings: vi.fn((c) => c.json({ success: true, message: 'Settings updated' })),
}));

vi.mock('../../middlewares/auth.js', () => ({
  authMiddleware: vi.fn(async (c, next) => {
    c.set('jwtPayload', { id: '123', email: 'test@example.com' });
    await next();
  }),
}));

describe('Settings Routes', () => {
  let app: Hono;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Hono();
    app.route('/settings', settingsRoutes);
  });

  describe('GET /settings', () => {
    it('should return settings when authenticated', async () => {
      const res = await app.request('/settings');

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ theme: 'dark', panelLanguage: 'en' });
      expect(authMiddleware).toHaveBeenCalled();
      expect(getSettings).toHaveBeenCalled();
    });

    it('should block request when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/settings');

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toEqual({ message: 'Unauthorized' });
      expect(getSettings).not.toHaveBeenCalled();
    });
  });

  describe('PUT /settings', () => {
    it('should update settings with valid payload when authenticated', async () => {
      const payload = {
        theme: 'light',
        panelLanguage: 'pt',
        siteUrl: 'https://mysite.com',
        publicEmail: 'admin@mysite.com',
        logoUrl: 'https://mysite.com/logo.png',
        customConfig: { some: 'value' },
      };

      const res = await app.request('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ success: true, message: 'Settings updated' });
      expect(authMiddleware).toHaveBeenCalled();
      expect(updateSettings).toHaveBeenCalled();
    });

    it('should return 400 with invalid payload due to schema validation', async () => {
      const invalidPayload = {
        theme: 'invalid-theme',
      };

      const res = await app.request('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidPayload),
      });

      expect(res.status).toBe(400);
      expect(updateSettings).not.toHaveBeenCalled();
    });

    it('should block request when not authenticated', async () => {
      vi.mocked(authMiddleware).mockImplementationOnce(async (c) => {
        return c.json({ message: 'Unauthorized' }, 401);
      });

      const res = await app.request('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: 'dark' }),
      });

      expect(res.status).toBe(401);
      expect(updateSettings).not.toHaveBeenCalled();
    });
  });
});

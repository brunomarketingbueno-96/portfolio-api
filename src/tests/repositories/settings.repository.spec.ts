import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      settings: {
        findFirst: vi.fn(),
      },
    },
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
  },
}));

import {
  findGlobalSettings,
  updateGlobalSettingsRecord,
} from '../../repositories/settings.repository.js';
import { db } from '../../db/index.js';
import { settings } from '../../db/schema.js';

describe('Settings Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findGlobalSettings', () => {
    it('should call findFirst and return the settings object', async () => {
      const mockSettings = {
        id: '1',
        theme: 'dark' as const,
        panelLanguage: 'en',
        siteUrl: 'https://site.com',
        publicEmail: 'contact@site.com',
        logoUrl: 'https://site.com/logo.png',
        customConfig: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(db.query.settings.findFirst).mockResolvedValue(mockSettings);

      const result = await findGlobalSettings();

      expect(db.query.settings.findFirst).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });

    it('should return undefined if no settings exist', async () => {
      vi.mocked(db.query.settings.findFirst).mockResolvedValue(undefined);

      const result = await findGlobalSettings();

      expect(db.query.settings.findFirst).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('updateGlobalSettingsRecord', () => {
    it('should update and return the updated settings record', async () => {
      const mockSettingsInput = {
        theme: 'light' as const,
        panelLanguage: 'pt',
      };
      const mockUpdatedSettings = {
        id: '1',
        theme: 'light',
        panelLanguage: 'pt',
        siteUrl: 'https://site.com',
        publicEmail: 'contact@site.com',
        logoUrl: 'https://site.com/logo.png',
        customConfig: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([mockUpdatedSettings]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateGlobalSettingsRecord('1', mockSettingsInput);

      expect(db.update).toHaveBeenCalledWith(settings);
      expect(mockUpdateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'light',
          panelLanguage: 'pt',
          updatedAt: expect.any(Date),
        })
      );
      expect(mockUpdateChain.where).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedSettings);
    });

    it('should return null if the record was not updated (empty returning array)', async () => {
      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockUpdateChain = {
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

      const result = await updateGlobalSettingsRecord('1', { theme: 'light' });

      expect(result).toBeNull();
    });
  });
});

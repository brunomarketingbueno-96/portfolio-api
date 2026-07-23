import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      services: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    transaction: vi.fn(),
  },
}));

import {
  findAllServices,
  findServiceById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} from '../../repositories/services.repository.js';
import { db } from '../../db/index.js';
import { services, serviceTranslations } from '../../db/schema.js';

describe('Services Repository', () => {
  const mockTx = {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.transaction).mockImplementation(async (callback) => {
      return await callback(mockTx as any);
    });
  });

  describe('findAllServices', () => {
    it('should find and return all services with translations', async () => {
      const mockServices = [
        {
          id: 's-1',
          link: 'https://service.com',
          imageUrl: 'image.png',
          translations: [{ id: 'st-1', serviceId: 's-1', language: 'en', title: 'Service' }],
        },
      ];
      vi.mocked(db.query.services.findMany).mockResolvedValue(mockServices as any);

      const result = await findAllServices();

      expect(db.query.services.findMany).toHaveBeenCalledWith({
        with: { translations: true },
      });
      expect(result).toEqual(mockServices);
    });
  });

  describe('findServiceById', () => {
    it('should find and return service by ID with translations', async () => {
      const mockService = {
        id: 's-1',
        link: 'https://service.com',
        imageUrl: 'image.png',
        translations: [],
      };
      vi.mocked(db.query.services.findFirst).mockResolvedValue(mockService as any);

      const result = await findServiceById('s-1');

      expect(db.query.services.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: { translations: true },
      });
      expect(result).toEqual(mockService);
    });
  });

  describe('createServiceRecord', () => {
    it('should create a service record and its translations in a transaction', async () => {
      const serviceData = { link: 'https://service.com', imageUrl: 'image.png' };
      const translations = [{ language: 'en', title: 'Service', description: 'Desc' }];
      const createdService = { id: 's-1', ...serviceData };
      const createdTranslations = [{ id: 'st-1', serviceId: 's-1', ...translations[0] }];

      // Mock tx.insert for services
      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdService]),
      } as any);

      // Mock tx.insert for serviceTranslations
      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(createdTranslations),
      } as any);

      const result = await createServiceRecord(serviceData, translations);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenNthCalledWith(1, services);
      expect(mockTx.insert).toHaveBeenNthCalledWith(2, serviceTranslations);
      expect(result).toEqual({
        ...createdService,
        translations: createdTranslations,
      });
    });

    it('should return null if service record creation fails (returning empty array)', async () => {
      const serviceData = { link: 'https://service.com', imageUrl: 'image.png' };

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await createServiceRecord(serviceData, []);

      expect(result).toBeNull();
    });

    it('should create a service record without translations if translations is empty or not provided', async () => {
      const serviceData = { link: 'https://service.com', imageUrl: 'image.png' };
      const createdService = { id: 's-1', ...serviceData };

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdService]),
      } as any);

      const result = await createServiceRecord(serviceData, []);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalledTimes(1);
      expect(mockTx.insert).toHaveBeenCalledWith(services);
      expect(result).toEqual({
        ...createdService,
        translations: [],
      });
    });
  });

  describe('updateServiceRecord', () => {
    it('should update service record and rebuild translations in a transaction', async () => {
      const id = 's-1';
      const serviceData = { link: 'https://new-service.com', imageUrl: 'new-image.png' };
      const translations = [{ language: 'en', title: 'New Title', description: 'New Desc' }];

      const updatedService = { id, ...serviceData, updatedAt: new Date() };
      const updatedTranslations = [{ id: 'st-1', serviceId: id, ...translations[0] }];

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedService]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValue({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(updatedTranslations),
      } as any);

      const result = await updateServiceRecord(id, serviceData, translations);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.update).toHaveBeenCalledWith(services);
      expect(mockTx.delete).toHaveBeenCalledWith(serviceTranslations);
      expect(mockTx.insert).toHaveBeenCalledWith(serviceTranslations);
      expect(result).toEqual({
        ...updatedService,
        translations: updatedTranslations,
      });
    });

    it('should return null if update fails to return a record', async () => {
      const id = 's-1';
      const serviceData = { link: 'https://new-service.com', imageUrl: 'new-image.png' };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await updateServiceRecord(id, serviceData, []);

      expect(result).toBeNull();
    });

    it('should update service without translations if translations is not an array', async () => {
      const id = 's-1';
      const serviceData = { link: 'https://new-service.com', imageUrl: 'new-image.png' };
      const updatedService = { id, ...serviceData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedService]),
      } as any);

      const result = await updateServiceRecord(id, serviceData, undefined as any);

      expect(mockTx.update).toHaveBeenCalledWith(services);
      expect(mockTx.delete).not.toHaveBeenCalled();
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedService,
        translations: [],
      });
    });

    it('should delete old translations but not insert new ones if translations is empty', async () => {
      const id = 's-1';
      const serviceData = { link: 'https://new-service.com', imageUrl: 'new-image.png' };
      const updatedService = { id, ...serviceData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedService]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      const result = await updateServiceRecord(id, serviceData, []);

      expect(mockTx.update).toHaveBeenCalledWith(services);
      expect(mockTx.delete).toHaveBeenCalledWith(serviceTranslations);
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedService,
        translations: [],
      });
    });
  });

  describe('deleteServiceRecord', () => {
    it('should delete a service record and return deleted info', async () => {
      const id = 's-1';
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id }]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteServiceRecord(id);

      expect(db.delete).toHaveBeenCalledWith(services);
      expect(result).toEqual({ id });
    });

    it('should return null if no service is deleted', async () => {
      const id = 's-1';
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteServiceRecord(id);

      expect(result).toBeNull();
    });
  });
});

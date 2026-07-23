import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      education: {
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
  findAllEducations,
  findEducationById,
  createEducationRecord,
  updateEducationRecord,
  deleteEducationRecord,
} from '../../repositories/educations.repository.js';
import { db } from '../../db/index.js';
import { education, educationTranslations } from '../../db/schema.js';

describe('Educations Repository', () => {
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

  describe('findAllEducations', () => {
    it('should find and return all educations with translations', async () => {
      const mockEducations = [
        {
          id: 'edu-1',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          type: 'college' as const,
          status: 'completed',
          translations: [{ id: 'edut-1', educationId: 'edu-1', language: 'en', name: 'CS' }],
        },
      ];
      vi.mocked(db.query.education.findMany).mockResolvedValue(mockEducations as any);

      const result = await findAllEducations();

      expect(db.query.education.findMany).toHaveBeenCalledWith({
        with: { translations: true },
      });
      expect(result).toEqual(mockEducations);
    });
  });

  describe('findEducationById', () => {
    it('should find and return education by ID with translations', async () => {
      const mockEdu = {
        id: 'edu-1',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
        translations: [],
      };
      vi.mocked(db.query.education.findFirst).mockResolvedValue(mockEdu as any);

      const result = await findEducationById('edu-1');

      expect(db.query.education.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: { translations: true },
      });
      expect(result).toEqual(mockEdu);
    });
  });

  describe('createEducationRecord', () => {
    it('should create an education record and translations in transaction', async () => {
      const educationData = {
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
      };
      const translations = [{ language: 'en', name: 'CS', institution: 'Uni', description: 'Desc' }];

      const createdEdu = { id: 'edu-1', ...educationData };
      const createdTranslations = [{ id: 'edut-1', educationId: 'edu-1', ...translations[0] }];

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdEdu]),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(createdTranslations),
      } as any);

      const result = await createEducationRecord(educationData, translations);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenNthCalledWith(1, education);
      expect(mockTx.insert).toHaveBeenNthCalledWith(2, educationTranslations);
      expect(result).toEqual({
        ...createdEdu,
        translations: createdTranslations,
      });
    });

    it('should return null if education creation fails', async () => {
      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await createEducationRecord({} as any, []);

      expect(result).toBeNull();
    });

    it('should create an education record without translations if translationsData is empty or not provided', async () => {
      const educationData = {
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
      };
      const createdEdu = { id: 'edu-1', ...educationData };

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdEdu]),
      } as any);

      const result = await createEducationRecord(educationData, []);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalledTimes(1);
      expect(mockTx.insert).toHaveBeenCalledWith(education);
      expect(result).toEqual({
        ...createdEdu,
        translations: [],
      });
    });
  });

  describe('updateEducationRecord', () => {
    it('should update education and replace translations', async () => {
      const id = 'edu-1';
      const educationData = {
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
      };
      const translations = [{ language: 'en', name: 'New CS', institution: 'Uni', description: 'Desc' }];

      const updatedEdu = { id, ...educationData, updatedAt: new Date() };
      const updatedTranslations = [{ id: 'edut-1', educationId: id, ...translations[0] }];

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedEdu]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValue({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(updatedTranslations),
      } as any);

      const result = await updateEducationRecord(id, educationData, translations);

      expect(mockTx.update).toHaveBeenCalledWith(education);
      expect(mockTx.delete).toHaveBeenCalledWith(educationTranslations);
      expect(mockTx.insert).toHaveBeenCalledWith(educationTranslations);
      expect(result).toEqual({
        ...updatedEdu,
        translations: updatedTranslations,
      });
    });

    it('should return null if update fails', async () => {
      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await updateEducationRecord('edu-1', {} as any, []);

      expect(result).toBeNull();
    });

    it('should update education without translations if translationsData is not an array', async () => {
      const id = 'edu-1';
      const educationData = {
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
      };
      const updatedEdu = { id, ...educationData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedEdu]),
      } as any);

      const result = await updateEducationRecord(id, educationData, undefined as any);

      expect(mockTx.update).toHaveBeenCalledWith(education);
      expect(mockTx.delete).not.toHaveBeenCalled();
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedEdu,
        translations: [],
      });
    });

    it('should delete old translations but not insert new ones if translationsData is empty', async () => {
      const id = 'edu-1';
      const educationData = {
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        type: 'college' as const,
        status: 'completed',
      };
      const updatedEdu = { id, ...educationData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedEdu]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      const result = await updateEducationRecord(id, educationData, []);

      expect(mockTx.update).toHaveBeenCalledWith(education);
      expect(mockTx.delete).toHaveBeenCalledWith(educationTranslations);
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedEdu,
        translations: [],
      });
    });
  });

  describe('deleteEducationRecord', () => {
    it('should delete education record and return its id', async () => {
      const id = 'edu-1';
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id }]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteEducationRecord(id);

      expect(db.delete).toHaveBeenCalledWith(education);
      expect(result).toEqual({ id });
    });

    it('should return null if no education record was deleted', async () => {
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteEducationRecord('edu-1');

      expect(result).toBeNull();
    });
  });
});

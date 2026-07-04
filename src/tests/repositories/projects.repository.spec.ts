import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      projects: {
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
  findAllProjects,
  findProjectById,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
} from '../../repositories/projects.repository.js';
import { db } from '../../db/index.js';
import { projects, projectTranslations, githubStats } from '../../db/schema.js';

describe('Projects Repository', () => {
  const mockTx = {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnThis(),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
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

  describe('findAllProjects', () => {
    it('should find and return all projects with translations and github stats', async () => {
      const mockProjects = [
        {
          id: 'p-1',
          imageUrl: 'image.png',
          translations: [{ id: 'pt-1', projectId: 'p-1', language: 'en', title: 'Portfolio' }],
          githubStats: { id: 'gs-1', stars: 5 },
        },
      ];
      vi.mocked(db.query.projects.findMany).mockResolvedValue(mockProjects as any);

      const result = await findAllProjects();

      expect(db.query.projects.findMany).toHaveBeenCalledWith({
        with: {
          translations: true,
          githubStats: true,
        },
      });
      expect(result).toEqual(mockProjects);
    });
  });

  describe('findProjectById', () => {
    it('should find and return project by ID with translations and github stats', async () => {
      const mockProject = {
        id: 'p-1',
        imageUrl: 'image.png',
        translations: [],
        githubStats: null,
      };
      vi.mocked(db.query.projects.findFirst).mockResolvedValue(mockProject as any);

      const result = await findProjectById('p-1');

      expect(db.query.projects.findFirst).toHaveBeenCalledWith({
        where: expect.any(Object),
        with: {
          translations: true,
          githubStats: true,
        },
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('createProjectRecord', () => {
    it('should create a project record, translations, and github stats in a transaction', async () => {
      const projectData = { imageUrl: 'image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const translations = [{ language: 'en', title: 'Portfolio', description: 'Desc' }];
      const incomingGithubStats = { stars: 10, languages: ['TS'], topics: ['web'] };

      const createdProject = { id: 'p-1', ...projectData };
      const createdTranslations = [{ id: 'pt-1', projectId: 'p-1', ...translations[0] }];
      const createdGithubStats = { id: 'gs-1', projectId: 'p-1', ...incomingGithubStats };

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdProject]),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(createdTranslations),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdGithubStats]),
      } as any);

      const result = await createProjectRecord(projectData, translations, incomingGithubStats);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenNthCalledWith(1, projects);
      expect(mockTx.insert).toHaveBeenNthCalledWith(2, projectTranslations);
      expect(mockTx.insert).toHaveBeenNthCalledWith(3, githubStats);
      expect(result).toEqual({
        ...createdProject,
        translations: createdTranslations,
        githubStats: createdGithubStats,
      });
    });

    it('should return null if project insertion fails', async () => {
      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await createProjectRecord({} as any, [], undefined);

      expect(result).toBeNull();
    });

    it('should create project without translations and without github stats if not provided', async () => {
      const projectData = { imageUrl: 'image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const createdProject = { id: 'p-1', ...projectData };

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([createdProject]),
      } as any);

      const result = await createProjectRecord(projectData, [], undefined);

      expect(db.transaction).toHaveBeenCalled();
      expect(mockTx.insert).toHaveBeenCalledTimes(1);
      expect(mockTx.insert).toHaveBeenCalledWith(projects);
      expect(result).toEqual({
        ...createdProject,
        translations: [],
        githubStats: null,
      });
    });
  });

  describe('updateProjectRecord', () => {
    it('should update project, refresh translations, and upsert github stats', async () => {
      const id = 'p-1';
      const projectData = { imageUrl: 'new-image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const translations = [{ language: 'en', title: 'New Portfolio', description: 'New Desc' }];
      const incomingGithubStats = { stars: 20, languages: ['TS', 'JS'], topics: ['web'] };

      const updatedProject = { id, ...projectData, updatedAt: new Date() };
      const updatedTranslations = [{ id: 'pt-1', projectId: id, ...translations[0] }];
      const updatedGithubStats = { id: 'gs-1', projectId: id, ...incomingGithubStats, syncedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedProject]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(updatedTranslations),
      } as any).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedGithubStats]),
      } as any);

      const result = await updateProjectRecord(id, projectData, translations, incomingGithubStats);

      expect(mockTx.update).toHaveBeenCalledWith(projects);
      expect(mockTx.delete).toHaveBeenCalledWith(projectTranslations);
      expect(mockTx.insert).toHaveBeenNthCalledWith(1, projectTranslations);
      expect(mockTx.insert).toHaveBeenNthCalledWith(2, githubStats);
      expect(result).toEqual({
        ...updatedProject,
        translations: updatedTranslations,
        githubStats: updatedGithubStats,
      });
    });

    it('should return null if update fails', async () => {
      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      } as any);

      const result = await updateProjectRecord('p-1', {} as any, [], undefined);

      expect(result).toBeNull();
    });

    it('should update project without translations if translations is not an array', async () => {
      const id = 'p-1';
      const projectData = { imageUrl: 'new-image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const updatedProject = { id, ...projectData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedProject]),
      } as any);

      const result = await updateProjectRecord(id, projectData, undefined as any, undefined);

      expect(mockTx.update).toHaveBeenCalledWith(projects);
      expect(mockTx.delete).not.toHaveBeenCalled();
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedProject,
        translations: [],
        githubStats: null,
      });
    });

    it('should delete old translations but not insert new ones if translations is empty', async () => {
      const id = 'p-1';
      const projectData = { imageUrl: 'new-image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const updatedProject = { id, ...projectData, updatedAt: new Date() };

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedProject]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      const result = await updateProjectRecord(id, projectData, [], undefined);

      expect(mockTx.update).toHaveBeenCalledWith(projects);
      expect(mockTx.delete).toHaveBeenCalledWith(projectTranslations);
      expect(mockTx.insert).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...updatedProject,
        translations: [],
        githubStats: null,
      });
    });

    it('should update project without github stats if incomingGithubStats is not provided', async () => {
      const id = 'p-1';
      const projectData = { imageUrl: 'new-image.png', liveUrl: 'https://site.com', repoUrl: 'https://github' };
      const translations = [{ language: 'en', title: 'New Portfolio', description: 'New Desc' }];

      const updatedProject = { id, ...projectData, updatedAt: new Date() };
      const updatedTranslations = [{ id: 'pt-1', projectId: id, ...translations[0] }];

      vi.mocked(mockTx.update).mockReturnValue({
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([updatedProject]),
      } as any);

      vi.mocked(mockTx.delete).mockReturnValue({
        where: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      } as any);

      vi.mocked(mockTx.insert).mockReturnValueOnce({
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue(updatedTranslations),
      } as any);

      const result = await updateProjectRecord(id, projectData, translations, undefined);

      expect(mockTx.update).toHaveBeenCalledWith(projects);
      expect(mockTx.delete).toHaveBeenCalledWith(projectTranslations);
      expect(mockTx.insert).toHaveBeenCalledTimes(1);
      expect(mockTx.insert).toHaveBeenCalledWith(projectTranslations);
      expect(result).toEqual({
        ...updatedProject,
        translations: updatedTranslations,
        githubStats: null,
      });
    });
  });

  describe('deleteProjectRecord', () => {
    it('should delete project record and return its id', async () => {
      const id = 'p-1';
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([{ id }]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteProjectRecord(id);

      expect(db.delete).toHaveBeenCalledWith(projects);
      expect(result).toEqual({ id });
    });

    it('should return null if no project record was deleted', async () => {
      const mockDeleteChain = {
        where: vi.fn().mockReturnThis(),
        returning: vi.fn().mockResolvedValue([]),
      };
      vi.mocked(db.delete).mockReturnValue(mockDeleteChain as any);

      const result = await deleteProjectRecord('p-1');

      expect(result).toBeNull();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: {
    query: {
      projects: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnThis(),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    }),
  },
}));

import {
  getAllProjectsForSync,
  upsertProjectGithubStats,
} from '../../repositories/github.repository.js';
import { db } from '../../db/index.js';
import { githubStats } from '../../db/schema.js';

describe('Github Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProjectsForSync', () => {
    it('should query all projects', async () => {
      const mockProjects = [
        { id: 'p-1', repoUrl: 'https://github.com/test' },
      ];
      vi.mocked(db.query.projects.findMany).mockResolvedValue(mockProjects as any);

      const result = await getAllProjectsForSync();

      expect(db.query.projects.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockProjects);
    });
  });

  describe('upsertProjectGithubStats', () => {
    it('should insert or update github stats and return them', async () => {
      const projectId = 'p-1';
      const statsInput = {
        stars: 10,
        languages: ['TypeScript', 'HTML'],
        topics: ['portfolio'],
      };
      const expectedRecord = {
        id: 'gs-1',
        projectId,
        ...statsInput,
        syncedAt: new Date(),
      };

      const mockReturning = vi.fn().mockResolvedValue([expectedRecord]);
      const mockInsertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.insert).mockReturnValue(mockInsertChain as any);

      const result = await upsertProjectGithubStats(projectId, statsInput);

      expect(db.insert).toHaveBeenCalledWith(githubStats);
      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          stars: 10,
          languages: ['TypeScript', 'HTML'],
          topics: ['portfolio'],
          syncedAt: expect.any(Date),
        })
      );
      expect(mockInsertChain.onConflictDoUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          target: githubStats.projectId,
          set: expect.objectContaining({
            stars: 10,
            languages: ['TypeScript', 'HTML'],
            topics: ['portfolio'],
            syncedAt: expect.any(Date),
          }),
        })
      );
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toEqual(expectedRecord);
    });

    it('should return null if no stats record is returned', async () => {
      const projectId = 'p-1';
      const statsInput = { stars: 0, languages: [], topics: [] };

      const mockReturning = vi.fn().mockResolvedValue([]);
      const mockInsertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockReturnThis(),
        returning: mockReturning,
      };
      vi.mocked(db.insert).mockReturnValue(mockInsertChain as any);

      const result = await upsertProjectGithubStats(projectId, statsInput);

      expect(result).toBeNull();
    });
  });
});

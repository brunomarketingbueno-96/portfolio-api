import { db } from '../db/index.js';
import { projects, githubStats } from '../db/schema.js';

type Project = typeof projects.$inferSelect;
type NewGithubStat = typeof githubStats.$inferInsert;

export const getAllProjectsForSync = async (): Promise<Project[]> => {
  return await db.select().from(projects);
};

export const upsertProjectGithubStats = async (
  projectId: string,
  stats: Omit<NewGithubStat, 'id' | 'projectId' | 'syncedAt'>
): Promise<void> => {
  await db.insert(githubStats)
    .values({
      ...stats,
      projectId,
      syncedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: githubStats.projectId,
      set: {
        ...stats,
        syncedAt: new Date(),
      },
    });
};

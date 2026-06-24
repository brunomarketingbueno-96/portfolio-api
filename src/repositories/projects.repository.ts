import { db } from '../db/index.js';
import { projects, projectTranslations, githubStats } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type Project = typeof projects.$inferSelect;
type ProjectTranslation = typeof projectTranslations.$inferSelect;
type NewProject = typeof projects.$inferInsert;

type GithubStat = typeof githubStats.$inferSelect;

export const findAllProjects = async (): Promise<Array<Project & { translations: ProjectTranslation[]; githubStats: GithubStat | null }>> => {
  return await db.query.projects.findMany({
    with: {
      translations: true,
      githubStats: true,
    },
  });
};

export const findProjectById = async (id: string): Promise<(Project & { translations: ProjectTranslation[]; githubStats: GithubStat | null }) | undefined> => {
  return await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: {
      translations: true,
      githubStats: true,
    },
  });
};

export const createProjectRecord = async (
  projectData: NewProject,
  translations: Omit<ProjectTranslation, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[],
  incomingGithubStats?: Omit<GithubStat, 'id' | 'projectId' | 'syncedAt'>
) => {
  return await db.transaction(async (tx) => {
    const insertedProjects = await tx.insert(projects).values(projectData).returning();
    const project = insertedProjects[0];

    if (!project) {
      throw new Error('Falha ao inserir o projeto principal no banco de dados.');
    }

    if (translations?.length) {
      await tx.insert(projectTranslations).values(
        translations.map((t) => ({
          ...t,
          projectId: project.id,
        }))
      );
    }

    if (incomingGithubStats) {
      await tx.insert(githubStats).values({
        ...incomingGithubStats,
        projectId: project.id,
      });
    }

    return project;
  });
};

export const updateProjectRecord = async (
  id: string,
  projectData: Partial<NewProject>,
  translations: Omit<ProjectTranslation, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>[],
  incomingGithubStats?: Omit<GithubStat, 'id' | 'projectId' | 'syncedAt'>
) => {
  await db.transaction(async (tx) => {
    await tx.update(projects)
      .set({
        ...projectData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id));

    if (translations && Array.isArray(translations)) {
      await tx.delete(projectTranslations).where(eq(projectTranslations.projectId, id));

      if (translations.length > 0) {
        await tx.insert(projectTranslations).values(
          translations.map((t) => ({
            ...t,
            projectId: id,
          }))
        );
      }
    }

    if (incomingGithubStats) {
      await tx.insert(githubStats)
        .values({
          ...incomingGithubStats,
          projectId: id,
          syncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: githubStats.projectId,
          set: {
            ...incomingGithubStats,
            syncedAt: new Date(),
          },
        });
    }
  });
};

export const deleteProjectRecord = async (id: string) => {
  await db.delete(projects).where(eq(projects.id, id));
};

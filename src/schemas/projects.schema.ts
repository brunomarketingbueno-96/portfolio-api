import { z } from 'zod';

const projectTranslationSchema = z.object({
  language: z.string().min(2, { error: 'errors.projects.language' }),
  title: z.string().min(3, { error: 'errors.projects.title' }),
  description: z.string().min(10, { error: 'errors.projects.description' }),
}).strict();

const githubStatsSchema = z.object({
  stars: z.number().int().nonnegative().optional(),
  languages: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
}).strict();

export const projectSchema = z.object({
  imageUrl: z.url({ error: 'errors.projects.image_url' })
    .startsWith('http', { error: 'errors.projects.image_url' })
    .optional()
    .or(z.literal('')),

  liveUrl: z.url({ error: 'errors.projects.live_url' })
    .startsWith('http', { error: 'errors.projects.live_url' })
    .optional()
    .or(z.literal('')),

  repoUrl: z.url({ error: 'errors.projects.repo_url' })
    .startsWith('http', { error: 'errors.projects.repo_url' })
    .optional()
    .or(z.literal('')),

  translations: z.array(projectTranslationSchema).min(1, { error: 'errors.projects.translations_required' }),

  githubStats: githubStatsSchema.optional().nullable(),
}).strict();

export type Project = z.infer<typeof projectSchema>;
import { z } from 'zod';

export const githubSchema = z.object({
  repoUrl: z.url({ error: 'errors.github.repo_url' })
    .startsWith('http', { error: 'errors.github.repo_url' })
}).strict();

export type Github = z.infer<typeof githubSchema>;

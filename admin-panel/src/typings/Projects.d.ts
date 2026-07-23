import { z } from 'zod'
import { projectSchema } from '../../../src/schemas/projects.schema';

export type NewProject = z.infer<typeof projectSchema>;

export type Project = NewProject & {
  id: string;
}

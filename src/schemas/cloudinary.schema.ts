import { z } from 'zod';

export const cloudinarySignatureSchema = z.object({
  folder: z.enum(['projects', 'services', 'educations', 'users', 'settings', 'blog-posts'], {
    error: 'errors.cloudinary.invalid_folder',
  }),

  identifier: z.string().min(1, { error: 'errors.cloudinary.invalid_identifier' }),
}).strict();

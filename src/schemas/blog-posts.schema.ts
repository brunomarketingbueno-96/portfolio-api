import { z } from 'zod';

export const blogPostSchema = z.object({
  coverImageUrl: z.url({ message: 'blog.error.image_url' })
    .startsWith('http', { message: 'blog.error.image_url' })
    .optional()
    .or(z.literal('')),

  isPublished: z.boolean().default(false).optional(),

  translations: z.array(z.object({
    language: z.string().min(2, { message: 'blog.error.language' }),
    slug: z.string().min(3, { message: 'blog.error.slug' }),
    title: z.string().min(3, { message: 'blog.error.title' }),
    excerpt: z.string().min(10, { message: 'blog.error.excerpt' }),
    content: z.string().min(10, { message: 'blog.error.content' }),
  }).strict()).min(1, { message: 'blog.error.translations_required' }),
}).strict();

import { z } from 'zod';

export const blogPostSchema = z.object({
  coverImageUrl: z.url({ error: 'blog_posts.error.image_url' })
    .startsWith('http', { error: 'blog_posts.error.image_url' })
    .optional()
    .or(z.literal('')),

  isPublished: z.boolean().default(false).optional(),

  translations: z.array(z.object({
    language: z.string().min(2, { error: 'blog_posts.error.language' }),
    slug: z.string().min(3, { error: 'blog_posts.error.slug' }),
    title: z.string().min(3, { error: 'blog_posts.error.title' }),
    excerpt: z.string().min(10, { error: 'blog_posts.error.excerpt' }),
    content: z.string().min(10, { error: 'blog_posts.error.content' }),
  }).strict()).min(1, { error: 'blog_posts.error.translations_required' }),
}).strict();

export const generateBlogPostSchema = z.object({
  prompt: z.string().optional(),

  postPartialData: z.object({
    language: z.string().min(2, { error: 'blog_posts.error.language' }),

    slug: z.string().optional(),
    title: z.string().optional(),
    excerpt: z.string().optional(),
  }).optional().default({ language: 'en' })
}).strict();

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

export type BlogPost = z.infer<typeof blogPostSchema>;

export const generateBlogPostSchema = z.object({
  prompt: z.string().optional(),
  providerId: z.uuid({ message: 'blog_posts.error.invalid_provider_id' }),

  postPartialData: z.object({

    language: z.enum(['pt', 'en', 'es'] as const, {
      message: 'blog_posts.error.language_invalid'
    }).default('en'),

    title: z.string().min(3, { message: 'blog_posts.error.title_required' }),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
  })
}).strict();

export type GenerateBlogPost = z.infer<typeof generateBlogPostSchema>;

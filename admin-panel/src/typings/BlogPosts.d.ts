import { z } from 'zod'
import { blogPostSchema } from '../../../src/schemas/blog-posts.schema';

export type NewBlogPost = z.infer<typeof blogPostSchema>;

export type BlogPost = NewBlogPost & {
  id: string;
};

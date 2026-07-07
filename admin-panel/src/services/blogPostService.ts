import { handleResponse } from '@/helpers/fetchHelpers';

import { z } from 'zod';
import { blogPostSchema } from '../../../src/schemas/blog-posts.schema.js';

type BlogPost = z.infer<typeof blogPostSchema>;

export const BlogPostService = {
  async getAll(): Promise<BlogPost[]> {
    const res = await fetch('/api/blog-posts', { credentials: 'include' });
    return handleResponse(res);
  },

  async getById(id: string): Promise<BlogPost> {
    const res = await fetch(`/api/blog-posts/${id}`, { credentials: 'include' });
    return handleResponse(res);
  },

  async create(payload: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/blog-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async update(id: string, payload: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch(`/api/blog-posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async delete(id: string): Promise<{ id: string }> {
    const res = await fetch(`/api/blog-posts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(res);
  }
};

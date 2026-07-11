import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getAdminBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../../controllers/blog-posts.controller.js';

import {
  findAllBlogPosts,
  findBlogPostById,
  findBlogPostBySlugAndLang,
  createBlogPostRecord,
  updateBlogPostRecord,
  deleteBlogPostRecord,
} from '../../repositories/blog-posts.repository.js';

vi.mock('../../repositories/blog-posts.repository.js', () => ({
  findAllBlogPosts: vi.fn(),
  findBlogPostById: vi.fn(),
  findBlogPostBySlugAndLang: vi.fn(),
  createBlogPostRecord: vi.fn(),
  updateBlogPostRecord: vi.fn(),
  deleteBlogPostRecord: vi.fn(),
}));

describe('Blog Posts Controller', () => {
  let mockContext: any;
  let mockParams: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = {};
    mockContext = {
      req: {
        json: vi.fn(),
        param: vi.fn((name?: string) => {
          if (name) return mockParams[name];
          return mockParams;
        }),
      },
      json: vi.fn((data, status = 200) => ({ data, status })),
    };
  });

  describe('getBlogPosts', () => {
    it('should return 200 with list of published posts', async () => {
      const mockPosts = [{ id: '1', title: 'Post 1' }];
      vi.mocked(findAllBlogPosts).mockResolvedValue(mockPosts as any);

      const response = await getBlogPosts(mockContext);

      expect(findAllBlogPosts).toHaveBeenCalledWith(true);
      expect(mockContext.json).toHaveBeenCalledWith(mockPosts, 200);
      expect(response.status).toBe(200);
    });

    it('should return 500 when repository throws error', async () => {
      const errorMsg = 'DB Error';
      vi.mocked(findAllBlogPosts).mockRejectedValue(new Error(errorMsg));

      const response = await getBlogPosts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.list', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('getBlogPostBySlug', () => {
    it('should return 200 with the blog post when found', async () => {
      mockParams = { lang: 'en', slug: 'test-slug' };
      const mockPost = { id: '1', slug: 'test-slug' };
      vi.mocked(findBlogPostBySlugAndLang).mockResolvedValue(mockPost as any);

      const response = await getBlogPostBySlug(mockContext);

      expect(findBlogPostBySlugAndLang).toHaveBeenCalledWith('en', 'test-slug');
      expect(mockContext.json).toHaveBeenCalledWith(mockPost, 200);
      expect(response.status).toBe(200);
    });

    it('should return 404 when blog post is not found', async () => {
      mockParams = { lang: 'en', slug: 'non-existent' };
      vi.mocked(findBlogPostBySlugAndLang).mockResolvedValue(null as any);

      const response = await getBlogPostBySlug(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.not_found', message: 'Blog post not found' },
        404
      );
      expect(response.status).toBe(404);
    });

    it('should return 500 when repository throws error', async () => {
      mockParams = { lang: 'en', slug: 'error-slug' };
      const errorMsg = 'DB Error';
      vi.mocked(findBlogPostBySlugAndLang).mockRejectedValue(new Error(errorMsg));

      const response = await getBlogPostBySlug(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.get_by_slug', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('getAdminBlogPosts', () => {
    it('should return 200 with list of all posts (admin)', async () => {
      const mockPosts = [{ id: '1', title: 'Post 1' }];
      vi.mocked(findAllBlogPosts).mockResolvedValue(mockPosts as any);

      const response = await getAdminBlogPosts(mockContext);

      expect(findAllBlogPosts).toHaveBeenCalledWith(false);
      expect(mockContext.json).toHaveBeenCalledWith(mockPosts, 200);
      expect(response.status).toBe(200);
    });

    it('should return 500 when repository throws error', async () => {
      const errorMsg = 'DB Error';
      vi.mocked(findAllBlogPosts).mockRejectedValue(new Error(errorMsg));

      const response = await getAdminBlogPosts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.list', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('getBlogPostById', () => {
    it('should return 200 with the blog post when found', async () => {
      mockParams = { id: 'post-123' };
      const mockPost = { id: 'post-123', title: 'Test Post' };
      vi.mocked(findBlogPostById).mockResolvedValue(mockPost as any);

      const response = await getBlogPostById(mockContext);

      expect(findBlogPostById).toHaveBeenCalledWith('post-123');
      expect(mockContext.json).toHaveBeenCalledWith(mockPost, 200);
      expect(response.status).toBe(200);
    });

    it('should return 404 when blog post is not found', async () => {
      mockParams = { id: 'non-existent' };
      vi.mocked(findBlogPostById).mockResolvedValue(null as any);

      const response = await getBlogPostById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.not_found', message: 'Blog post not found' },
        404
      );
      expect(response.status).toBe(404);
    });

    it('should return 500 when repository throws error', async () => {
      mockParams = { id: 'error-id' };
      const errorMsg = 'DB Error';
      vi.mocked(findBlogPostById).mockRejectedValue(new Error(errorMsg));

      const response = await getBlogPostById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.get_by_id', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('createBlogPost', () => {
    const validPayload = {
      coverImageUrl: 'https://example.com/image.png',
      isPublished: true,
      translations: [
        {
          language: 'en',
          slug: 'my-post',
          title: 'My Post',
          excerpt: 'This is a short excerpt.',
          content: 'This is a long content for the post.',
        },
      ],
    };

    it('should return 201 with the created blog post on success', async () => {
      mockContext.req.json.mockResolvedValue(validPayload);
      const mockNewPost = { id: 'new-id', ...validPayload };
      vi.mocked(createBlogPostRecord).mockResolvedValue(mockNewPost as any);

      const response = await createBlogPost(mockContext);

      expect(createBlogPostRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          coverImageUrl: validPayload.coverImageUrl,
          isPublished: validPayload.isPublished,
          publishedAt: expect.any(Date),
        }),
        validPayload.translations
      );
      expect(mockContext.json).toHaveBeenCalledWith(mockNewPost, 201);
      expect(response.status).toBe(201);
    });

    it('should set publishedAt to null if isPublished is false', async () => {
      const unpublishedPayload = { ...validPayload, isPublished: false };
      mockContext.req.json.mockResolvedValue(unpublishedPayload);
      const mockNewPost = { id: 'new-id', ...unpublishedPayload };
      vi.mocked(createBlogPostRecord).mockResolvedValue(mockNewPost as any);

      await createBlogPost(mockContext);

      expect(createBlogPostRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          coverImageUrl: validPayload.coverImageUrl,
          isPublished: false,
          publishedAt: null,
        }),
        validPayload.translations
      );
    });

    it('should return 422 if creation returns null', async () => {
      mockContext.req.json.mockResolvedValue(validPayload);
      vi.mocked(createBlogPostRecord).mockResolvedValue(null);

      const response = await createBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.create', message: 'Blog post not created' },
        422
      );
      expect(response.status).toBe(422);
    });

    it('should return 500 when input schema parsing fails', async () => {
      const invalidPayload = { isPublished: 'not-a-boolean' };
      mockContext.req.json.mockResolvedValue(invalidPayload);

      const response = await createBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'blog_posts.error.create',
          message: expect.any(String),
        }),
        500
      );
      expect(response.status).toBe(500);
    });

    it('should return 500 when repository throws error', async () => {
      mockContext.req.json.mockResolvedValue(validPayload);
      const errorMsg = 'Create Failed';
      vi.mocked(createBlogPostRecord).mockRejectedValue(new Error(errorMsg));

      const response = await createBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.create', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('updateBlogPost', () => {
    const validPayload = {
      coverImageUrl: 'https://example.com/image.png',
      isPublished: true,
      translations: [
        {
          language: 'en',
          slug: 'my-post',
          title: 'My Post',
          excerpt: 'This is a short excerpt.',
          content: 'This is a long content for the post.',
        },
      ],
    };

    it('should return 200 with updated blog post on success', async () => {
      mockParams = { id: 'post-123' };
      mockContext.req.json.mockResolvedValue(validPayload);

      const existingPost = { id: 'post-123', publishedAt: null };
      vi.mocked(findBlogPostById).mockResolvedValue(existingPost as any);

      const mockUpdatedPost = { id: 'post-123', ...validPayload };
      vi.mocked(updateBlogPostRecord).mockResolvedValue(mockUpdatedPost as any);

      const response = await updateBlogPost(mockContext);

      expect(findBlogPostById).toHaveBeenCalledWith('post-123');
      expect(updateBlogPostRecord).toHaveBeenCalledWith(
        'post-123',
        expect.objectContaining({
          coverImageUrl: validPayload.coverImageUrl,
          isPublished: validPayload.isPublished,
          publishedAt: expect.any(Date),
        }),
        validPayload.translations
      );
      expect(mockContext.json).toHaveBeenCalledWith(mockUpdatedPost, 200);
      expect(response.status).toBe(200);
    });

    it('should not update publishedAt if isPublished is true but it was already published', async () => {
      mockParams = { id: 'post-123' };
      mockContext.req.json.mockResolvedValue(validPayload);

      const alreadyPublishedDate = new Date('2026-01-01');
      const existingPost = { id: 'post-123', publishedAt: alreadyPublishedDate };
      vi.mocked(findBlogPostById).mockResolvedValue(existingPost as any);

      const mockUpdatedPost = { id: 'post-123', ...validPayload, publishedAt: alreadyPublishedDate };
      vi.mocked(updateBlogPostRecord).mockResolvedValue(mockUpdatedPost as any);

      await updateBlogPost(mockContext);

      const secondArg = vi.mocked(updateBlogPostRecord).mock.calls[0][1];
      expect(secondArg.publishedAt).toBeUndefined();
    });

    it('should return 404 if post to update is not found', async () => {
      mockParams = { id: 'non-existent' };
      mockContext.req.json.mockResolvedValue(validPayload);
      vi.mocked(findBlogPostById).mockResolvedValue(null as any);

      const response = await updateBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.not_found', message: 'Blog post not found' },
        404
      );
      expect(response.status).toBe(404);
    });

    it('should return 422 if update returns null', async () => {
      mockParams = { id: 'post-123' };
      mockContext.req.json.mockResolvedValue(validPayload);
      vi.mocked(findBlogPostById).mockResolvedValue({ id: 'post-123' } as any);
      vi.mocked(updateBlogPostRecord).mockResolvedValue(null);

      const response = await updateBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.update', message: 'Blog post not updated' },
        422
      );
      expect(response.status).toBe(422);
    });

    it('should return 500 when input validation fails', async () => {
      mockParams = { id: 'post-123' };
      mockContext.req.json.mockResolvedValue({ isPublished: 'invalid' });

      const response = await updateBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'blog_posts.error.update',
          message: expect.any(String),
        }),
        500
      );
      expect(response.status).toBe(500);
    });
  });

  describe('deleteBlogPost', () => {
    it('should return 200 with deleted post on success', async () => {
      mockParams = { id: 'post-123' };
      const mockDeletedPost = { id: 'post-123', title: 'Deleted Post' };
      vi.mocked(deleteBlogPostRecord).mockResolvedValue(mockDeletedPost as any);

      const response = await deleteBlogPost(mockContext);

      expect(deleteBlogPostRecord).toHaveBeenCalledWith('post-123');
      expect(mockContext.json).toHaveBeenCalledWith(mockDeletedPost, 200);
      expect(response.status).toBe(200);
    });

    it('should return 422 if delete returns null', async () => {
      mockParams = { id: 'post-123' };
      vi.mocked(deleteBlogPostRecord).mockResolvedValue(null);

      const response = await deleteBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.delete', message: 'Blog post not deleted' },
        422
      );
      expect(response.status).toBe(422);
    });

    it('should return 500 when repository throws error during delete', async () => {
      mockParams = { id: 'post-123' };
      const errorMsg = 'Delete error';
      vi.mocked(deleteBlogPostRecord).mockRejectedValue(new Error(errorMsg));

      const response = await deleteBlogPost(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'blog_posts.error.delete', message: errorMsg },
        500
      );
      expect(response.status).toBe(500);
    });
  });
});

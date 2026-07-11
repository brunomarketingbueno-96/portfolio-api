import { describe, it, expect } from 'vitest';
import { blogPostSchema } from '../../schemas/blog-posts.schema.js';

describe('Blog Posts Zod Schema', () => {
  const validPayload = {
    coverImageUrl: 'https://example.com/image.jpg',
    isPublished: true,
    translations: [
      {
        language: 'en',
        slug: 'my-post',
        title: 'My Post Title',
        excerpt: 'This is a valid excerpt that is long enough.',
        content: 'This is a valid content that is long enough.',
      },
    ],
  };

  it('should validate a correct payload successfully', () => {
    const result = blogPostSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        ...validPayload,
        isPublished: true,
      });
    }
  });

  it('should fallback isPublished to false if omitted', () => {
    const { isPublished, ...payloadWithoutIsPublished } = validPayload;
    const result = blogPostSchema.safeParse(payloadWithoutIsPublished);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPublished).toBe(false);
    }
  });

  it('should allow empty coverImageUrl', () => {
    const payload = {
      ...validPayload,
      coverImageUrl: '',
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should allow omitted coverImageUrl', () => {
    const { coverImageUrl, ...payloadWithoutUrl } = validPayload;
    const result = blogPostSchema.safeParse(payloadWithoutUrl);
    expect(result.success).toBe(true);
  });

  it('should fail if coverImageUrl is not a valid url or doesn\'t start with http', () => {
    const payload = {
      ...validPayload,
      coverImageUrl: 'not-a-url',
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('blog_posts.error.image_url');
    }
  });

  it('should fail and block request if unrecognized keys are sent at root level', () => {
    const payload = {
      ...validPayload,
      extra: 'field',
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.code).toBe('unrecognized_keys');
    }
  });

  it('should fail if translations list is empty', () => {
    const payload = {
      ...validPayload,
      translations: [],
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('blog_posts.error.translations_required');
    }
  });

  it('should fail if translation fields do not meet validation constraints', () => {
    const payload = {
      ...validPayload,
      translations: [
        {
          language: 'e', // min 2
          slug: 'sl', // min 3
          title: 'ti', // min 3
          excerpt: 'short', // min 10
          content: 'short', // min 10
        },
      ],
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map(i => i.message);
      expect(messages).toContain('blog_posts.error.language');
      expect(messages).toContain('blog_posts.error.slug');
      expect(messages).toContain('blog_posts.error.title');
      expect(messages).toContain('blog_posts.error.excerpt');
      expect(messages).toContain('blog_posts.error.content');
    }
  });

  it('should fail and block request if unrecognized keys are sent inside translations', () => {
    const payload = {
      ...validPayload,
      translations: [
        {
          ...validPayload.translations[0],
          extraInTranslation: 'not-allowed',
        },
      ],
    };
    const result = blogPostSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.code).toBe('unrecognized_keys');
    }
  });
});

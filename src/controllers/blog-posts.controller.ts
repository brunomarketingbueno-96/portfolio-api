import { Context } from 'hono';

import {
  findAllBlogPosts,
  findBlogPostById,
  findBlogPostBySlugAndLang,
  createBlogPostRecord,
  updateBlogPostRecord,
  deleteBlogPostRecord,
} from '../repositories/blog-posts.repository.js';

import { blogPostSchema } from '../schemas/blog-posts.schema.js';

export const getBlogPosts = async (c: Context) => {
  try {
    const posts = await findAllBlogPosts(true);
    return c.json(posts, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.list', message: error.message }, 500);
  }
};

export const getBlogPostBySlug = async (c: Context) => {
  const { lang, slug } = c.req.param();

  try {
    const post = await findBlogPostBySlugAndLang(lang, slug);

    if (!post) return c.json({
      error: 'blog_posts.error.not_found', message: 'Blog post not found'
    }, 404);

    return c.json(post, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.get_by_slug', message: error.message }, 500);
  }
};

export const getAdminBlogPosts = async (c: Context) => {
  try {
    const posts = await findAllBlogPosts(false);
    return c.json(posts, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.list', message: error.message }, 500);
  }
};

export const getBlogPostById = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const post = await findBlogPostById(id);

    if (!post) return c.json({
      error: 'blog_posts.error.not_found', message: 'Blog post not found'
    }, 404);

    return c.json(post, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.get_by_id', message: error.message }, 500);
  }
};

export const createBlogPost = async (c: Context) => {
  try {
    const { translations, ...postData } = blogPostSchema.parse(await c.req.json());

    const newPostData = {
      ...postData,
      publishedAt: postData.isPublished ? new Date() : null,
    };

    const newPost = await createBlogPostRecord(newPostData, translations);

    if (!newPost) return c.json({
      error: 'blog_posts.error.create', message: 'Blog post not created'
    }, 422);

    return c.json(newPost, 201);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.create', message: error.message }, 500);
  }
};

export const updateBlogPost = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const { translations, ...postData } = blogPostSchema.parse(await c.req.json());

    const existingPost = await findBlogPostById(id);

    if (!existingPost) return c.json({
      error: 'blog_posts.error.not_found', message: 'Blog post not found'
    }, 404);

    const updatePayload: any = { ...postData };

    if (postData.isPublished === true && !existingPost.publishedAt) {
      updatePayload.publishedAt = new Date();
    }

    const updatedPost = await updateBlogPostRecord(id, updatePayload, translations);

    if (!updatedPost) return c.json({
      error: 'blog_posts.error.update', message: 'Blog post not updated'
    }, 422);

    return c.json(updatedPost, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.update', message: error.message }, 500);
  }
};

export const deleteBlogPost = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const deletedPost = await deleteBlogPostRecord(id);

    if (!deletedPost) return c.json({
      error: 'blog_posts.error.delete', message: 'Blog post not deleted'
    }, 422);

    return c.json(deletedPost, 200);

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.delete', message: error.message }, 500);
  }
};

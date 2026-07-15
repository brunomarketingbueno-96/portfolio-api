import { Context } from 'hono';
import { toTextStream } from 'ai';

import { AiService } from '../services/ai.service.js'
import { BlogPrompts } from '../prompts/blog.prompts.js'
import type { BlogPost, GenerateBlogPost } from '../schemas/blog-posts.schema.js';

import { DEFAULT_MODELS } from '../constants/index.js';

import {
  findAllBlogPosts,
  findBlogPostById,
  findBlogPostBySlugAndLang,
  createBlogPostRecord,
  updateBlogPostRecord,
  deleteBlogPostRecord,
} from '../repositories/blog-posts.repository.js';

import {
  findAiProviderById
} from '../repositories/ai-providers.repository.js';

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
    console.log('\n[createBlogPost] 🔵 Iniciando requisição de criação...');

    // 1. Loga o payload recebido antes de desestruturar
    const rawBody = await c.req.json<BlogPost>();
    console.log('[createBlogPost] Payload recebido:', JSON.stringify(rawBody, null, 2));

    const { translations, ...postData } = rawBody;

    const newPostData = {
      ...postData,
      publishedAt: postData.isPublished ? new Date() : null,
    };

    // 2. Loga como os dados ficaram montados para o banco
    console.log('[createBlogPost] Dados do Post formatados:', newPostData);
    console.log('[createBlogPost] Traduções extraídas:', translations);

    // 3. Marca o início da inserção no banco
    console.log('[createBlogPost] Chamando createBlogPostRecord...');
    const newPost = await createBlogPostRecord(newPostData, translations);

    if (!newPost) {
      console.warn('[createBlogPost] ⚠️ Falha na criação: createBlogPostRecord não retornou o post (422).');
      return c.json({
        error: 'blog_posts.error.create',
        message: 'Blog post not created'
      }, 422);
    }

    console.log('[createBlogPost] ✅ Post criado com sucesso!');
    return c.json(newPost, 201);

  } catch (error: any) {
    // 4. Loga o erro COMPLETO no terminal, incluindo onde ele aconteceu
    console.error('\n[createBlogPost] ❌ ERRO 500 CAPTURADO:');
    console.error(error); // Mostra o objeto do erro inteiro
    if (error.stack) {
      console.error('[createBlogPost] Stack Trace:', error.stack);
    }

    return c.json({
      error: 'blog_posts.error.create',
      message: error.message || 'Erro interno no servidor'
    }, 500);
  }
};

export const updateBlogPost = async (c: Context) => {
  const id = c.req.param('id');

  try {
    const { translations, ...postData } = await c.req.json<BlogPost>();

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

export const generateBlogPost = async (c: Context) => {
  try {
    const { prompt, postPartialData, providerId } = await c.req.json<GenerateBlogPost>();

    const aiProviderRecord = await findAiProviderById(providerId);
    if (!aiProviderRecord) {
      return c.json({
        error: 'blog_posts.error.provider_not_found',
        message: 'Provedor de IA não encontrado.'
      }, 404);
    }

    if (!aiProviderRecord.isActive) {
      return c.json({
        error: 'blog_posts.error.provider_inactive',
        message: 'O provedor de IA selecionado está desativado no painel.'
      }, 400);
    }

    const model = DEFAULT_MODELS[aiProviderRecord.provider];
    if (!model) {
      return c.json({
        error: 'blog_posts.error.invalid_model',
        message: 'Modelo padrão não definido para este provedor.'
      }, 400);
    }

    const systemPrompt = BlogPrompts.buildHtmlSystemPrompt(postPartialData);
    const userPrompt = prompt || BlogPrompts.getUserPrompt(postPartialData.language);

    const aiService = new AiService(aiProviderRecord.provider, model, aiProviderRecord.key);
    const result = await aiService.streamHtmlContent(systemPrompt, userPrompt);

    return new Response(toTextStream({ stream: result.stream }), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    return c.json({ error: 'blog_posts.error.generate', message: error.message }, 500);
  }
};

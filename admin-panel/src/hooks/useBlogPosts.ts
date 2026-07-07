import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BlogPostService } from '@/services/blogPostService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { blogPostSchema } from '../../../src/schemas/blog-posts.schema';

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const initialForm: BlogPostFormData = {
  coverImageUrl: '',
  isPublished: false,
  translations: [{ language: 'pt', slug: '', title: '', excerpt: '', content: '' }]
};

export function useBlogPosts(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialForm
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'translations'
  });

  const loadBlogPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await BlogPostService.getAll();
      setBlogPosts(data as BlogPost[]);
    } catch (error) {
      const err = error as ApiError;
      setGlobalError(err.error ? t(err.error) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadBlogPostForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await BlogPostService.getById(id);

      const cleanTranslations = data.translations?.length
        ? data.translations.map((tData) => ({
          language: tData.language,
          slug: tData.slug,
          title: tData.title,
          excerpt: tData.excerpt,
          content: tData.content
        }))
        : initialForm.translations;

      reset({
        coverImageUrl: data.coverImageUrl ?? '',
        isPublished: data.isPublished ?? false,
        translations: cleanTranslations,
      });

      setImagePreview(data.coverImageUrl || null);
    } catch (error) {
      const err = error as ApiError;
      setGlobalError(err.error ? t(err.error) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [reset, setImagePreview, t]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (options?.fetchList) loadBlogPosts();

    if (options?.editId) loadBlogPostForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadBlogPosts, loadBlogPostForEdit]);

  const deleteBlogPost = async (id: string) => {
    if (!window.confirm(t('blog_posts.action.confirm_delete'))) return;
    try {
      await BlogPostService.delete(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      const err = error as ApiError;
      alert(err.error ? t(err.error) : t('api.error.unknown'));
    }
  };

  const processFormSubmit = async (data: BlogPostFormData, id?: string) => {
    setGlobalError(null);
    try {
      let finalImageUrl = imagePreview || '';

      if (selectedFile) {
        // eslint-disable-next-line react-hooks/purity
        const fileId = id || Date.now().toString();

        finalImageUrl = await UploadService.uploadImage(selectedFile, 'blog-posts', `post-${fileId}`);
      }

      const payload = { ...data, coverImageUrl: finalImageUrl };

      if (id) {
        await BlogPostService.update(id, payload);
      } else {
        await BlogPostService.create(payload);
      }

      setSelectedFile(null);
      navigate('/blog-posts');
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));
    }
  };

  const createBlogPost = handleSubmit((data) => processFormSubmit(data));
  const updateBlogPost = (id: string) => handleSubmit((data) => processFormSubmit(data, id));

  return {
    blogPosts,
    loading,
    globalError,
    deleteBlogPost,
    createBlogPost,
    updateBlogPost,

    register,
    control,
    errors,
    isSubmitting,
    fields,
    appendTranslation: () => append({ language: 'en', slug: '', title: '', excerpt: '', content: '' }),
    removeTranslation: remove,

    imagePreview,
    handleFileChange
  };
}

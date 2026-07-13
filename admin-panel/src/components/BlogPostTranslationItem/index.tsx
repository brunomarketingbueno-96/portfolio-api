import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type UseFormRegister, type FieldErrors, type Control, Controller } from 'react-hook-form';
import type { NewBlogPost } from '@/typings/BlogPosts';

import Input from '@/components/Input';
import Select from '@/components/Select';
import FormError from '@/components/FormError';
import Textarea from '@/components/Textarea';
import RichTextEditor from '@/components/RichTextEditor';

interface BlogPostTranslationItemProps {
  index: number;
  register: UseFormRegister<NewBlogPost>;
  control: Control<NewBlogPost>;
  errors: FieldErrors<NewBlogPost>;
  removeTranslation: (index: number) => void;

  onGenerateAI: (prompt: string, index: number) => Promise<void>;
  isGenerating: boolean;
}

export default function BlogPostTranslationItem({
  index,
  register,
  control,
  errors,
  removeTranslation,
  onGenerateAI,
  isGenerating
}: BlogPostTranslationItemProps) {
  const { t } = useTranslation();


  const [aiPrompt, setAiPrompt] = useState('');

  return (
    <div className="bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl p-6 shadow-sm relative">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-zinc-700 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
          🌐 {t('blog_posts.form.translation_content', { defaultValue: 'Content' })} - {index + 1}
        </h3>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeTranslation(index)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            {t('buttons.remove', { defaultValue: 'Remove' })}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <Select
            id={`translations-${index}-language`}
            label={t('blog_posts.form.language', { defaultValue: 'Language' })}
            options={['pt', 'en', 'es']}
            translationGroup="languages"
            {...register(`translations.${index}.language` as const)}
          />
          <FormError error={!!errors?.translations?.[index]?.language} message={t(errors?.translations?.[index]?.language?.message as string)} />
        </div>

        <div className="md:col-span-4">
          <Input
            id={`translations-${index}-title`}
            label={t('blog_posts.form.title', { defaultValue: 'Title' })}
            placeholder={t('blog_posts.form.title_placeholder', { defaultValue: 'My Awesome Post' })}
            {...register(`translations.${index}.title` as const)}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </Input>
          <FormError error={!!errors?.translations?.[index]?.title} message={t(errors?.translations?.[index]?.title?.message as string)} />
        </div>

        <div className="md:col-span-4">
          <Input
            id={`translations-${index}-slug`}
            label={t('blog_posts.form.slug', { defaultValue: 'URL Slug' })}
            placeholder="my-awesome-post"
            {...register(`translations.${index}.slug` as const)}
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </Input>
          <FormError error={!!errors?.translations?.[index]?.slug} message={t(errors?.translations?.[index]?.slug?.message as string)} />
        </div>

        <div className="md:col-span-12">
          <Textarea
            id={`translations-${index}-excerpt`}
            label={t('blog_posts.form.excerpt', { defaultValue: 'Short Summary (SEO)' })}
            {...register(`translations.${index}.excerpt` as const)}
            rows={3}
            placeholder={t('blog_posts.form.excerpt_placeholder', { defaultValue: 'A brief description of this post for list views and SEO...' })}
          />
          <FormError error={!!errors?.translations?.[index]?.excerpt} message={t(errors?.translations?.[index]?.excerpt?.message as string)} />
        </div>

        <div className="md:col-span-12 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 -mb-2">
          <label className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
            ✨ Assistente de IA
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ex: Crie um artigo longo e persuasivo focado em dicas de vendas..."
              className="flex-1 px-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-zinc-900 dark:text-zinc-100 transition-shadow"
              disabled={isGenerating}
            />
            <button
              type="button"
              onClick={() => onGenerateAI && onGenerateAI(aiPrompt, index)}
              disabled={isGenerating || !aiPrompt.trim()}
              className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                'Gerar Conteúdo'
              )}
            </button>
          </div>
        </div>

        <div className="md:col-span-12">
          <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 ml-1 transition-colors duration-300">
            {t('blog_posts.form.content', { defaultValue: 'Content' })}
          </label>

          <Controller
            name={`translations.${index}.content`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <RichTextEditor
                value={value || ''}
                onChange={onChange}
              />
            )}
          />

          <FormError
            error={!!errors?.translations?.[index]?.content}
            message={t(errors?.translations?.[index]?.content?.message as string)}
          />
        </div>

      </div>
    </div>
  );
}

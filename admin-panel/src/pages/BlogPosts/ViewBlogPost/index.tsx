import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBlogPosts } from '@/hooks/useBlogPosts';

import Article from '@/components/Article';
import Background from '@/components/Background';
import ViewHeader from '@/components/ViewHeader';
import BackButton from '@/components/Buttons/BackButton';

export default function ViewBlogPost() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    globalError,
    fields,
    imagePreview,
    deleteBlogPost
  } = useBlogPosts({ editId: id });

  const [currentLang, setCurrentLang] = useState(i18n.language || 'pt');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const handleDelete = async () => {
    if (id) {
      await deleteBlogPost(id);
      navigate('/blog-posts');
    }
  };

  const activeTranslation = fields.find(field => field.language === currentLang);
  const availableLanguages = fields.map(field => field.language);

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      {loading ? (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : globalError ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <p className="text-red-500 mb-4">{globalError}</p>

          <BackButton to={{ pathname: '/blog-posts' }} label={t('blog_posts.buttons.back_to_posts', { defaultValue: 'Back to Posts' })} />
        </div>
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 relative z-10">

          <ViewHeader
            onBack={{ to: '/blog-posts', label: t('blog_posts.buttons.back_to_posts') }}
            onEdit={{ label: t('buttons.edit'), to: `/blog-posts/edit/${id}/` }}
            onDelete={{ action: handleDelete, label: t('buttons.delete') }}
          />

          {imagePreview && (
            <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-sm">
              <img
                src={imagePreview}
                alt="Capa do artigo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {!activeTranslation ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 text-center shadow-sm border border-gray-200 dark:border-zinc-700">
              <span className="text-4xl mb-4 block">🌍</span>
              <h2 className="text-xl font-medium text-gray-900 dark:text-zinc-100 mb-2">
                {t('blog_posts.page.view.translation_unavailable')}
              </h2>
              <p className="text-gray-500 dark:text-zinc-400 mb-6">
                {t('blog_posts.page.view.available_in')}
              </p>

              <div className="flex justify-center gap-3">
                {availableLanguages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setCurrentLang(lang)}
                    className="px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors uppercase text-sm font-bold"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Article
              title={activeTranslation.title}
              excerpt={activeTranslation.excerpt}
              content={activeTranslation.content}
            />
          )}

        </main>
      )}
    </div>
  );
}

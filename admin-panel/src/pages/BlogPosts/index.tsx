import { useTranslation } from 'react-i18next';

import { useBlogPosts } from '@/hooks/useBlogPosts';

import BlogPostCard from '@/components/BlogPostCard';
import Background from '@/components/Background';
import EmptyList from '@/components/EmptyList';
import PageLoader from '@/components/PageLoader';

import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';
import Heading from '@/components/Heading';

export default function BlogPosts() {
  const { t } = useTranslation();

  const {
    blogPosts,
    loading,
    globalError,
    deleteBlogPost,
  } = useBlogPosts({ fetchList: true });

  const renderListContent = () => {
    if (loading) {
      return (
        <PageLoader />
      );
    }

    if (blogPosts.length === 0 && !globalError) {
      return (
        <EmptyList
          icon="📰"
          title={t('blog_posts.page.list.empty_list_title', { defaultValue: 'No blog posts found.' })}
          description={t('blog_posts.page.list.empty_list_description', { defaultValue: 'Write your first post to see it here.' })}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {blogPosts.map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            onDelete={deleteBlogPost}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dark:bg-zinc-900 bg-gray-50 text-gray-800 dark:text-zinc-100 min-h-screen flex flex-col relative overflow-hidden">
      <Background />

      <main className="flex-1 px-8 py-8 w-full relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <BackButton to={{ pathname: '/panel' }} label={t('buttons.back_to_panel', { defaultValue: 'Back to panel' })} />
            <Heading level={1} icon="📝" title={t('blog_posts.page.list.title', { defaultValue: 'Blog Posts' })} />
          </div>
          <AddButton to={{ pathname: '/blog-posts/create' }} label={t('blog_posts.buttons.new_post', { defaultValue: 'New Post' })} />
        </div>

        {globalError && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-400 rounded-lg">
            <p className="font-bold">{t('blog_posts.list.error_title', { defaultValue: 'Error' })}</p>
            <p>{globalError}</p>
          </div>
        )}

        {renderListContent()}
      </main>
    </div>
  );
}

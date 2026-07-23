interface ArticleProps {
  title: string;
  excerpt?: string;
  content: string;
}

export default function Article({ title, excerpt, content }: ArticleProps) {
  return (
    <article className="bg-white dark:bg-zinc-900/80 rounded-xl p-6 md:p-10 shadow-sm border border-gray-200 dark:border-zinc-700">
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {title}
        </h1>
        {excerpt && (
          <p className="text-lg text-gray-600 dark:text-zinc-400 border-l-4 border-blue-500 pl-4 italic">
            {excerpt}
          </p>
        )}
      </header>

      <div
        className="
          w-full max-w-none wrap-break-word
          prose prose-lg dark:prose-invert
          prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-img:rounded-xl prose-img:shadow-md
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}

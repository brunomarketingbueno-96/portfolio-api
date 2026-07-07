export default function SubTitle({ content }: { content: string }) {
  return (
    <p className="text-sm text-gray-500 dark:text-zinc-400">
      {content}
    </p>
  );
};
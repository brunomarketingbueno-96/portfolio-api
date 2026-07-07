interface EmptyListProps {
  icon: React.ReactNode | string;
  title: string;
  description: string;
}

export default function EmptyList({ icon, title, description, }: EmptyListProps) {
  return (
    <div className="text-center py-20 bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 rounded-lg">
      <div className="text-gray-400 dark:text-zinc-500 text-5xl mb-4">{icon}</div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-50">
        {title}
      </h3>

      <p className="text-gray-500 dark:text-zinc-400 mt-1">
        {description}
      </p>

    </div>
  );
};

interface TextareaProps {
  id: string;
  label: string;
  placeholder: string;
  rows?: number;
}

export default function Textarea({ id, label, placeholder, rows = 2, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="ml-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        rows={rows}
        className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-500 resize-none"
        placeholder={placeholder}
      />
    </div>
  );
}
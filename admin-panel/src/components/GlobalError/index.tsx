interface GlobalErrorProps {
  error?: string | null;
  message: string;
}

export default function GlobalError({ error, message }: GlobalErrorProps) {
  return (
    error && (
      <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 text-red-700 dark:text-red-400 rounded-lg">
        <p className="font-bold">{message}</p >
        <p>{error}</p>
      </div >
    )
  )
}

import { Link } from "react-router-dom";

interface BackButtonProps {
  to: {
    pathname: string;
  };
  label: string;
  customClass?: string;
}

export default function BackButton({ to: { pathname }, label, customClass }: BackButtonProps) {
  return (
    <Link to={pathname}
      className={customClass || 'text-sm text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2 inline-flex items-center gap-1 transition-colors'}
    >
      ← {label}
    </Link >
  );
}

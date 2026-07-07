import { Link } from 'react-router-dom';

interface ViewButtonProps {
  to: {
    pathname: string;
  };
  title: string;
  customClass?: string;
}

export default function ViewButton({ to: { pathname }, title, customClass }: ViewButtonProps) {
  return (
    <Link
      to={pathname}
      className={customClass || "p-2 text-gray-600 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-900/20 rounded-md transition-colors"}
      title={title}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </Link>
  );
}

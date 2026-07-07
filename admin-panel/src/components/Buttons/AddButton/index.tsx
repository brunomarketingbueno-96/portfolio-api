import { Link } from 'react-router-dom';

interface AddButtonProps {
  to: {
    pathname: string;
  };
  label: string;
  customClass?: string;
}

export default function AddButton({ to: { pathname }, label, customClass }: AddButtonProps) {
  return (
    <Link
      to={pathname}
      className={`${customClass || 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm'}`}
      title={label}
    >
      <span>➕ {label}</span>
    </Link>
  );
}

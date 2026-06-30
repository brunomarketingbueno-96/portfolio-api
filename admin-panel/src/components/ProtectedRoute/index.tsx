import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import Header from '../Header';

import FullScreenLoader from '@/components/FullScreenLoader';

export default function ProtectedRoute() {
  const { checkingAuth, isAuthenticated } = useAuth();

  if (checkingAuth) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

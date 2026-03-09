import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/session';

interface Props {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
  const isAuth = useAuthStore((s) => s.isAuth);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

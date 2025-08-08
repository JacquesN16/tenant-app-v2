
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const accessToken = localStorage.getItem('accessToken');

  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

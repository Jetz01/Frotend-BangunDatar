import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!sessionStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

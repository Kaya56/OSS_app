// components/layout/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/auth';
import { hasAnyRole } from '../../utils/jwt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Role[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}) => {
  const { authState } = useAuth();
  const location = useLocation();

  // Afficher un spinner pendant le chargement initial
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Vérifier les rôles requis si spécifiés
  if (requiredRoles.length > 0) {
    const userRoles = authState.user.roles;
    const hasRequiredRole = hasAnyRole(userRoles, requiredRoles);

    if (!hasRequiredRole) {
      // Rediriger vers une page d'accès refusé ou le dashboard
      return <Navigate to="/access-denied" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
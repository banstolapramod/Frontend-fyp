import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requiredRole = null, redirectTo = '/login' }) {
  const { isAuthenticated, user, loading, isTokenValid } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if token is valid
  if (!isTokenValid()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    const redirectPath = getRedirectPathForRole(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export function PublicRoute({ children, redirectTo = null }) {
  const { isAuthenticated, user, loading, isTokenValid } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated with valid token and redirectTo is specified, redirect
  if (isAuthenticated && isTokenValid() && redirectTo) {
    const redirectPath = redirectTo === 'role-based' 
      ? getRedirectPathForRole(user?.role) 
      : redirectTo;
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

function getRedirectPathForRole(role) {
  switch (role) {
    case 'admin':
      return '/admin-panel';
    case 'vendor':
      return '/vendor-dashboard';
    case 'customer':
    default:
      return '/main';
  }
}

// Higher-order component for token-based authentication
export function withAuth(Component, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Hook for checking authentication status
export function useRequireAuth(requiredRole = null) {
  const { isAuthenticated, user, isTokenValid } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated || !isTokenValid()) {
      // Redirect to login
      window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard
      const redirectPath = getRedirectPathForRole(user?.role);
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, user, requiredRole, location.pathname, isTokenValid]);

  return isAuthenticated && isTokenValid() && (!requiredRole || user?.role === requiredRole);
}
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthRedirect({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, isTokenValid } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (loading) return;
    
    // If user is authenticated with a valid token, redirect to appropriate dashboard
    if (isAuthenticated && isTokenValid() && user) {
      console.log('🔄 User already logged in, redirecting based on role:', user.role);
      
      switch (user.role) {
        case 'admin':
          navigate('/admin-panel', { replace: true });
          break;
        case 'vendor':
          navigate('/vendor-dashboard', { replace: true });
          break;
        case 'customer':
        default:
          navigate('/main', { replace: true });
          break;
      }
    }
  }, [navigate, isAuthenticated, user, loading, isTokenValid]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
}
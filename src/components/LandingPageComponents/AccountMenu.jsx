import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  LogIn,
  Shield,
  Store,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { getUserData, clearUserData } from "../../utils/auth";

export function AccountMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  

  // Check authentication status when component mounts or isOpen changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = getUserData();
      
      if (userData && userData.token) {
        try {
          // Decode token to check if it's not expired
          const decoded = jwtDecode(userData.token);
          
          if (decoded.exp * 1000 > Date.now()) {
            setIsLoggedIn(true);
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name || 'User'
            });
            console.log('✅ User is logged in:', userData);
          } else {
            // Token expired
            clearUserData();
            setIsLoggedIn(false);
            setUser(null);
            console.log('❌ Token expired, user logged out');
          }
        } catch (error) {
          // Invalid token
          clearUserData();
          setIsLoggedIn(false);
          setUser(null);
          console.log('❌ Invalid token, user logged out');
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        console.log('❌ No user data found, user not logged in');
      }
    };

    if (isOpen) {
      checkAuthStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    // Clear all user data using utility function
    clearUserData();
    
    // Clear any API headers
    delete window.api?.defaults?.headers?.common?.['Authorization'];
    
    // Update state
    setIsLoggedIn(false);
    setUser(null);
    
    console.log('🚪 User logged out successfully - all data cleared');
    
    // Navigate to home and close menu
    navigate('/');
    onClose();
  };

  const getRoleIcon = () => {
    if (user?.role === 'admin') return <Shield className="w-4 h-4 text-blue-600" />;
    if (user?.role === 'vendor') return <Store className="w-4 h-4 text-green-600" />;
    return null;
  };

  const getRoleText = () => {
    if (user?.role === 'admin') return "Admin";
    if (user?.role === 'vendor') return "Vendor";
    return "Customer";
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return "/admin-dashboard";
    if (user?.role === 'vendor') return "/vendor-dashboard";
    return "/profile";
  };

  return (
    <>
      <div className="fixed inset-0 z-dropdown" onClick={onClose} />

      <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-dropdown overflow-hidden">
        {isLoggedIn ? (
          <>
            {/* User Info Header - Compact */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-left">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full inline-block mr-3 align-middle">
                  <User className="w-4 h-4 text-white mx-auto mt-2" />
                </div>
                <div className="inline-block align-middle">
                  <h4 className="text-gray-900 font-medium text-sm">{user?.name || 'User'}</h4>
                  <p className="text-gray-500 text-xs">{getRoleText()}</p>
                </div>
              </div>
            </div>

            {/* Menu Items - Dropdown Style */}
            <div className="py-1">
              <button
                onClick={() => handleNavigate("/profile")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
              >
                <User className="w-4 h-4 inline-block mr-3 text-gray-500" />
                My Profile
              </button>

              {(user?.role === 'admin' || user?.role === 'vendor') && (
                <button
                  onClick={() => handleNavigate(getDashboardPath())}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4 inline-block mr-3 text-gray-500" />
                  Dashboard
                </button>
              )}

              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={() => handleNavigate("/vendor-management")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Store className="w-4 h-4 inline-block mr-3 text-emerald-500" />
                    Vendor Management
                  </button>
                  <button
                    onClick={() => handleNavigate("/user-management")}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <User className="w-4 h-4 inline-block mr-3 text-blue-500" />
                    User Management
                  </button>
                </>
              )}

              <button
                onClick={() => handleNavigate("/orders")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
              >
                <Package className="w-4 h-4 inline-block mr-3 text-gray-500" />
                Orders
              </button>

              <button
                onClick={() => handleNavigate("/favorites")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
              >
                <Heart className="w-4 h-4 inline-block mr-3 text-gray-500" />
                Favorites
              </button>

              <button
                onClick={() => handleNavigate("/settings")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
              >
                <Settings className="w-4 h-4 inline-block mr-3 text-gray-500" />
                Settings
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors duration-150 text-sm text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 inline-block mr-3 text-red-500" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Logged Out State - Compact */}
            <div className="p-4">
              <h4 className="text-gray-900 font-medium text-sm mb-1">Welcome Back</h4>
              <p className="text-gray-600 text-xs mb-3">Sign in to your account</p>

              <div className="space-y-2">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-full px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
                >
                  Sign In
                </button>

                <button
                  onClick={() => handleNavigate("/register")}
                  className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-150 text-sm"
                >
                  Create Account
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100">
              <button
                onClick={() => handleNavigate("/track-order")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm text-gray-700 hover:text-gray-900"
              >
                <Package className="w-4 h-4 inline-block mr-3 text-gray-500" />
                Track Order
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

AccountMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
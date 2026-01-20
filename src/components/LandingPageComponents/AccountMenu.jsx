import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export function AccountMenu({ isOpen, onClose }) {
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        {isLoggedIn ? (
          <>
            {/* Logged In State */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">John Doe</p>
                  <p className="text-gray-500 text-sm">john@example.com</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={() => handleNavigate("/profile")}
                className="menu-btn"
              >
                <User className="w-5 h-5 text-gray-600" />
                My Profile
              </button>

              <button
                onClick={() => handleNavigate("/orders")}
                className="menu-btn"
              >
                <Package className="w-5 h-5 text-gray-600" />
                Orders
              </button>

              <button
                onClick={() => handleNavigate("/favorites")}
                className="menu-btn"
              >
                <Heart className="w-5 h-5 text-gray-600" />
                Favorites
              </button>

              <button
                onClick={() => handleNavigate("/settings")}
                className="menu-btn"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                Settings
              </button>
            </div>

            <div className="border-t border-gray-200 py-2">
              <button
                onClick={() => handleNavigate("/logout")}
                className="menu-btn text-red-600"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Logged Out State */}
            <div className="p-6">
              <h3 className="text-gray-900 mb-2">
                Welcome to Sneakers Spot
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Sign in to access your orders, favorites, and exclusive deals.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-full px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>

                <button
                  onClick={() => handleNavigate("/register")}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => handleNavigate("/track-order")}
                className="menu-btn"
              >
                <Package className="w-5 h-5 text-gray-600" />
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

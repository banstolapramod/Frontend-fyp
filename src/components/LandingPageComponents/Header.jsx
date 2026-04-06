import { ShoppingCart, Search, User, Menu, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchModal } from "./SearchModal";
import { AccountMenu } from "./AccountMenu";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export function Header() {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { count: wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close mobile menu when navigating
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              onClick={() => handleNavigation('/')}
              className="heading-5 text-gradient cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              Sneakers Spot
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 hover:shadow-md mx-2"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="body-small text-gray-600">Search</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:shadow-md"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>
              <AccountMenu isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
            </div>
            
            {/* Favourites */}
            <button
              onClick={() => navigate('/favourites')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:shadow-md group"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:shadow-md group"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <p className="absolute top-0 right-0 w-4 h-4 bg-green text-xs text-white rounded-full flex items-center justify-center text-xs font-medium animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </p>
              )}
            </button>
            
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals and Sidebars */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
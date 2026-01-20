import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { useState } from "react";
import { SearchModal } from "./SearchModal";
import { AccountMenu } from "./AccountMenu";
import { CartSidebar } from "./CartSidebar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-black">Sneakers Spot</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              New Releases
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Men
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Women
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Brands
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors">
              Sale
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Search</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>
              <AccountMenu isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-xs">
                3
              </span>
            </button>
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-left"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">
                New Releases
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">
                Men
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">
                Women
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">
                Brands
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">
                Sale
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Modals and Sidebars */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
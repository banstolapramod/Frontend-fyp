import { X, Search, TrendingUp } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
// import { ImageWithFallback } from "./figma/ImageWithFallback";

const trendingSearches = [
  "Air Jordan 1",
  "Yeezy 350",
  "Nike Dunk",
  "New Balance 550",
  "Air Max 97",
];

const recentProducts = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    brand: "Nike",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1684918652908-8c5b4a154781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  },
];

export function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-3xl mx-auto mt-20 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for sneakers, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {searchQuery === "" ? (
            <>
              {/* Trending Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="text-gray-900">Trending Searches</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              <div>
                <h3 className="text-gray-900 mb-4">Popular Products</h3>

                <div className="space-y-3">
                  {recentProducts.map((product) => (
                    <button
                      key={product.id}
                      className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      {/* Replace with ImageWithFallback if needed */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                      />

                      <div className="flex-1">
                        <p className="text-gray-900">{product.name}</p>
                        <p className="text-gray-500 text-sm">{product.brand}</p>
                      </div>

                      <p className="text-gray-900">${product.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Searching for "{searchQuery}"...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Results would appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { X, Search, TrendingUp, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const trendingSearches = [
  "Air Jordan 1",
  "Yeezy 350",
  "Nike Dunk",
  "New Balance 550",
  "Air Max 97",
];

// Complete product database for search
const allProducts = [
  { id: 1, name: "Air Jordan 1 Retro High OG", brand: "Nike", price: 329, category: "Basketball", image: "https://images.unsplash.com/photo-1684918652908-8c5b4a154781?w=400&h=400&fit=crop&q=80" },
  { id: 2, name: "Nike Dunk Low Retro", brand: "Nike", price: 189, category: "Lifestyle", image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?w=400&h=400&fit=crop&q=80" },
  { id: 3, name: "Adidas Yeezy Boost 350 V2", brand: "Adidas", price: 279, category: "Lifestyle", image: "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?w=400&h=400&fit=crop&q=80" },
  { id: 4, name: "New Balance 550 White Navy", brand: "New Balance", price: 149, category: "Lifestyle", image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?w=400&h=400&fit=crop&q=80" },
  { id: 5, name: "Nike Air Max 97", brand: "Nike", price: 219, category: "Running", image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?w=400&h=400&fit=crop&q=80" },
  { id: 6, name: "Jordan 4 Military Black", brand: "Nike", price: 389, category: "Basketball", image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop&q=80" },
  { id: 7, name: "Converse Chuck 70 High", brand: "Converse", price: 95, category: "Lifestyle", image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?w=400&h=400&fit=crop&q=80" },
  { id: 8, name: "Puma Suede Classic XXI", brand: "Puma", price: 119, category: "Lifestyle", image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?w=400&h=400&fit=crop&q=80" },
  { id: 9, name: "Adidas Ultraboost 22", brand: "Adidas", price: 190, category: "Running", image: "https://images.unsplash.com/photo-1620794341491-76be6eeb6946?w=400&h=400&fit=crop&q=80" },
  { id: 10, name: "Nike Air Force 1", brand: "Nike", price: 110, category: "Lifestyle", image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?w=400&h=400&fit=crop&q=80" },
  { id: 11, name: "Vans Old Skool", brand: "Vans", price: 70, category: "Lifestyle", image: "https://images.unsplash.com/photo-1608384177866-0bca0d225435?w=400&h=400&fit=crop&q=80" },
  { id: 12, name: "Reebok Classic Leather", brand: "Reebok", price: 85, category: "Lifestyle", image: "https://images.unsplash.com/photo-1705997696539-a4f44e80d9fb?w=400&h=400&fit=crop&q=80" }
];

export function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const categories = ["All", "Basketball", "Running", "Lifestyle"];
  const brands = ["All", "Nike", "Adidas", "New Balance", "Converse", "Puma", "Vans", "Reebok"];

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });

    setSearchResults(filtered);
  }, [searchQuery, selectedCategory, selectedBrand]);

  const handleProductClick = (product) => {
    console.log("Product clicked:", product);
    // Navigate to product detail page or add to cart
    onClose();
  };

  const handleTrendingClick = (search) => {
    setSearchQuery(search);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl mx-auto mt-20 rounded-xl shadow-2xl"
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

          {/* Filters */}
          {searchQuery && (
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>

              {(selectedCategory !== "All" || selectedBrand !== "All") && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedBrand("All");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {searchQuery === "" ? (
            <>
              {/* Trending Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="text-gray-900 font-semibold">Trending Searches</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(search)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 text-sm transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Products */}
              <div>
                <h3 className="text-gray-900 font-semibold mb-4">Popular Products</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allProducts.slice(0, 6).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border border-gray-100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          `;
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium truncate">{product.name}</p>
                        <p className="text-gray-500 text-sm">{product.brand}</p>
                      </div>

                      <p className="text-gray-900 font-bold">${product.price}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : searchResults.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{searchResults.length}</span> results for "{searchQuery}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border border-gray-100 hover:border-blue-300"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                            </svg>
                          </div>
                        `;
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">{product.brand}</p>
                        <span className="text-gray-300">•</span>
                        <p className="text-gray-500 text-sm">{product.category}</p>
                      </div>
                    </div>

                    <p className="text-gray-900 font-bold">${product.price}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">No results found</p>
              <p className="text-gray-500 text-sm">
                Try searching with different keywords or check the spelling
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

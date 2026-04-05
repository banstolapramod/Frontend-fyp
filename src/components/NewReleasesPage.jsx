import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, X, ChevronDown } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';
import { useCart } from '../context/CartContext';
import { getUserData } from '../utils/auth';

export default function NewReleasesPage() {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    size: 'all',
    sortBy: 'newest'
  });

  // Sample new releases data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const newReleases = [
        {
          id: 1,
          name: 'Air Jordan 1 Retro High OG',
          brand: 'Nike',
          price: 170,
          originalPrice: 200,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
          rating: 4.8,
          reviews: 234,
          sizes: [7, 8, 9, 10, 11, 12],
          releaseDate: '2024-02-15',
          isNew: true,
          discount: 15
        },
        {
          id: 2,
          name: 'Yeezy Boost 350 V2',
          brand: 'Adidas',
          price: 220,
          image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop',
          rating: 4.9,
          reviews: 456,
          sizes: [7, 8, 9, 10, 11],
          releaseDate: '2024-02-14',
          isNew: true
        },
        {
          id: 3,
          name: 'New Balance 550',
          brand: 'New Balance',
          price: 130,
          image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop',
          rating: 4.6,
          reviews: 189,
          sizes: [8, 9, 10, 11, 12],
          releaseDate: '2024-02-13',
          isNew: true
        },
        {
          id: 4,
          name: 'Nike Dunk Low Retro',
          brand: 'Nike',
          price: 110,
          originalPrice: 140,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
          rating: 4.7,
          reviews: 312,
          sizes: [7, 8, 9, 10, 11, 12, 13],
          releaseDate: '2024-02-12',
          isNew: true,
          discount: 21
        },
        {
          id: 5,
          name: 'Converse Chuck 70 High',
          brand: 'Converse',
          price: 85,
          image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop',
          rating: 4.5,
          reviews: 267,
          sizes: [7, 8, 9, 10, 11, 12],
          releaseDate: '2024-02-11',
          isNew: true
        },
        {
          id: 6,
          name: 'Puma RS-X',
          brand: 'Puma',
          price: 120,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop',
          rating: 4.4,
          reviews: 145,
          sizes: [8, 9, 10, 11],
          releaseDate: '2024-02-10',
          isNew: true
        },
        {
          id: 7,
          name: 'Vans Old Skool',
          brand: 'Vans',
          price: 70,
          originalPrice: 85,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
          rating: 4.6,
          reviews: 423,
          sizes: [7, 8, 9, 10, 11, 12],
          releaseDate: '2024-02-09',
          isNew: true,
          discount: 18
        },
        {
          id: 8,
          name: 'Reebok Club C 85',
          brand: 'Reebok',
          price: 90,
          image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop',
          rating: 4.5,
          reviews: 198,
          sizes: [8, 9, 10, 11, 12],
          releaseDate: '2024-02-08',
          isNew: true
        }
      ];
      
      setProducts(newReleases);
      setFilteredProducts(newReleases);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.priceRange === 'under100') return product.price < 100;
        if (filters.priceRange === '100-150') return product.price >= 100 && product.price <= 150;
        if (filters.priceRange === '150-200') return product.price >= 150 && product.price <= 200;
        if (filters.priceRange === 'over200') return product.price > 200;
        return true;
      });
    }

    // Brand filter
    if (filters.brand !== 'all') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Sort
    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    } else if (filters.sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: 'all',
      brand: 'all',
      size: 'all',
      sortBy: 'newest'
    });
  };

  const addToCart = async (product) => {
    const userData = getUserData();
    if (!userData?.token) {
      alert('Please log in to add items to cart');
      navigate('/login');
      return;
    }
    const result = await addToCartContext(product.product_id || product.id, 1);
    if (result.success) alert('✅ Added to cart!');
    else alert(`❌ ${result.error}`);
  };

  const addToWishlist = (product) => {
    console.log('Added to wishlist:', product);
    // Add wishlist logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">New Releases</h1>
          <p className="text-gray-300 text-lg">
            Discover the latest drops from top brands. Fresh styles, just for you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="block md:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4 inline-block mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="all">All Prices</option>
                    <option value="under100">Under $100</option>
                    <option value="100-150">$100 - $150</option>
                    <option value="150-200">$150 - $200</option>
                    <option value="over200">Over $200</option>
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="all">All Brands</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Converse">Converse</option>
                    <option value="Puma">Puma</option>
                    <option value="Vans">Vans</option>
                    <option value="Reebok">Reebok</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="md:pt-7">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4 inline-block mr-2" />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 mb-4">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading new releases...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gray-100" style={{ height: '288px' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x800/e5e7eb/6b7280?text=Sneaker';
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    {product.isNew && (
                      <span className="px-2 py-1 bg-black text-white text-xs font-semibold rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {product.discount && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                        -{product.discount}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => addToWishlist(product)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors mb-2 block"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                  <h3
                    className="text-sm font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mb-2">
                    <div className="inline-block">
                      <Star className="w-4 h-4 inline-block text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-700 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    {product.originalPrice ? (
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="w-4 h-4 inline-block mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, X } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';
import { getUserData } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function MenPage() {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    category: 'all',
    sortBy: 'newest'
  });

  useEffect(() => {
    setTimeout(() => {
      const menProducts = [
        {
          id: 101,
          name: 'Air Max 90',
          brand: 'Nike',
          price: 130,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 189,
          category: 'Running',
          sizes: [8, 9, 10, 11, 12, 13]
        },
        {
          id: 102,
          name: 'Ultraboost 22',
          brand: 'Adidas',
          price: 190,
          originalPrice: 220,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=800&fit=crop&q=80',
          rating: 4.8,
          reviews: 267,
          category: 'Running',
          sizes: [8, 9, 10, 11, 12],
          discount: 14
        },
        {
          id: 103,
          name: 'Classic Leather',
          brand: 'Reebok',
          price: 75,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5aFa0d9a2?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 145,
          category: 'Casual',
          sizes: [8, 9, 10, 11, 12]
        },
        {
          id: 104,
          name: 'Court Vision Low',
          brand: 'Nike',
          price: 70,
          image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&h=800&fit=crop&q=80',
          rating: 4.6,
          reviews: 234,
          category: 'Casual',
          sizes: [8, 9, 10, 11, 12, 13]
        },
        {
          id: 105,
          name: 'Stan Smith',
          brand: 'Adidas',
          price: 90,
          image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=800&fit=crop&q=80',
          rating: 4.9,
          reviews: 456,
          category: 'Casual',
          sizes: [8, 9, 10, 11, 12]
        },
        {
          id: 106,
          name: 'Fresh Foam 1080',
          brand: 'New Balance',
          price: 160,
          image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 178,
          category: 'Running',
          sizes: [8, 9, 10, 11, 12]
        },
        {
          id: 107,
          name: 'Suede Classic',
          brand: 'Puma',
          price: 80,
          originalPrice: 100,
          image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&h=800&fit=crop&q=80',
          rating: 4.6,
          reviews: 198,
          category: 'Casual',
          sizes: [8, 9, 10, 11, 12],
          discount: 20
        },
        {
          id: 108,
          name: 'Authentic',
          brand: 'Vans',
          price: 60,
          image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 312,
          category: 'Casual',
          sizes: [8, 9, 10, 11, 12]
        }
      ];
      
      setProducts(menProducts);
      setFilteredProducts(menProducts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.priceRange === 'under100') return product.price < 100;
        if (filters.priceRange === '100-150') return product.price >= 100 && product.price <= 150;
        if (filters.priceRange === '150-200') return product.price >= 150 && product.price <= 200;
        if (filters.priceRange === 'over200') return product.price > 200;
        return true;
      });
    }

    if (filters.brand !== 'all') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
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
      category: 'all',
      sortBy: 'newest'
    });
  };

  const addToCart = async (product) => {
    try {
      const userData = getUserData();
      if (!userData || !userData.token) {
        alert('Please log in to add items to cart');
        navigate('/login');
        return;
      }

      console.log('🛒 Adding to cart:', product);
      
      const result = await addToCartContext(product.product_id || product.id, 1);
      
      if (result.success) {
        alert('✅ Added to cart successfully!');
      } else {
        alert(`❌ Failed to add to cart: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert(`❌ Failed to add to cart: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Men's Sneakers</h1>
          <p className="text-blue-200 text-lg">
            Premium footwear designed for style and performance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="under100">Under $100</option>
                    <option value="100-150">$100 - $150</option>
                    <option value="150-200">$150 - $200</option>
                    <option value="over200">Over $200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Brands</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Puma">Puma</option>
                    <option value="Vans">Vans</option>
                    <option value="Reebok">Reebok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Running">Running</option>
                    <option value="Casual">Casual</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Training">Training</option>
                  </select>
                </div>

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

          <div className="text-gray-600 mb-4">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
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
                  
                  {product.discount && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                        -{product.discount}%
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                  <h3
                    className="text-sm font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  <div className="mb-2">
                    <Star className="w-4 h-4 inline-block text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-700 ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="mb-3">
                    {product.originalPrice ? (
                      <div>
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    )}
                  </div>

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

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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

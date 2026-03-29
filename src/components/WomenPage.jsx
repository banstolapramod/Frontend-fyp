import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, X } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';
import { getUserData } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function WomenPage() {
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
      const womenProducts = [
        {
          id: 201,
          name: 'Air Force 1 Shadow',
          brand: 'Nike',
          price: 120,
          image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&h=800&fit=crop&q=80',
          rating: 4.8,
          reviews: 345,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9, 10]
        },
        {
          id: 202,
          name: 'Superstar Platform',
          brand: 'Adidas',
          price: 100,
          originalPrice: 130,
          image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 289,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9],
          discount: 23
        },
        {
          id: 203,
          name: '327 Retro',
          brand: 'New Balance',
          price: 110,
          image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=800&fit=crop&q=80',
          rating: 4.6,
          reviews: 167,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9, 10]
        },
        {
          id: 204,
          name: 'Blazer Mid 77',
          brand: 'Nike',
          price: 110,
          image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop&q=80',
          rating: 4.9,
          reviews: 412,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9, 10]
        },
        {
          id: 205,
          name: 'Chuck Taylor All Star Lift',
          brand: 'Converse',
          price: 75,
          image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 298,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9]
        },
        {
          id: 206,
          name: 'Cali Sport',
          brand: 'Puma',
          price: 90,
          originalPrice: 110,
          image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop&q=80',
          rating: 4.6,
          reviews: 234,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9, 10],
          discount: 18
        },
        {
          id: 207,
          name: 'Old Skool Platform',
          brand: 'Vans',
          price: 75,
          image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 356,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9]
        },
        {
          id: 208,
          name: 'Club C Double',
          brand: 'Reebok',
          price: 85,
          image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 189,
          category: 'Casual',
          sizes: [5, 6, 7, 8, 9, 10]
        }
      ];
      
      setProducts(womenProducts);
      setFilteredProducts(womenProducts);
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
      
      const result = await addToCartContext(product.id, 1);
      
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

      <div className="bg-gradient-to-r from-pink-900 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Women's Sneakers</h1>
          <p className="text-pink-200 text-lg">
            Stylish and comfortable footwear for every occasion
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
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
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
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

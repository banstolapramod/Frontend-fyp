import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Filter, X, Tag } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';
import { getUserData } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function SalePage() {
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    discount: 'all',
    sortBy: 'discount'
  });

  useEffect(() => {
    setTimeout(() => {
      const saleProducts = [
        {
          id: 301,
          name: 'Air Max 270',
          brand: 'Nike',
          price: 95,
          originalPrice: 150,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 234,
          sizes: [8, 9, 10, 11, 12],
          discount: 37
        },
        {
          id: 302,
          name: 'NMD R1',
          brand: 'Adidas',
          price: 80,
          originalPrice: 130,
          image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop&q=80',
          rating: 4.6,
          reviews: 189,
          sizes: [8, 9, 10, 11],
          discount: 38
        },
        {
          id: 303,
          name: '574 Core',
          brand: 'New Balance',
          price: 60,
          originalPrice: 85,
          image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 156,
          sizes: [8, 9, 10, 11, 12],
          discount: 29
        },
        {
          id: 304,
          name: 'Cortez Classic',
          brand: 'Nike',
          price: 55,
          originalPrice: 75,
          image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop&q=80',
          rating: 4.8,
          reviews: 298,
          sizes: [8, 9, 10, 11, 12],
          discount: 27
        },
        {
          id: 305,
          name: 'Chuck Taylor Low',
          brand: 'Converse',
          price: 40,
          originalPrice: 60,
          image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&h=800&fit=crop&q=80&auto=format',
          rating: 4.6,
          reviews: 412,
          sizes: [7, 8, 9, 10, 11],
          discount: 33
        },
        {
          id: 306,
          name: 'Future Rider',
          brand: 'Puma',
          price: 65,
          originalPrice: 90,
          image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&h=800&fit=crop&q=80',
          rating: 4.4,
          reviews: 134,
          sizes: [8, 9, 10, 11],
          discount: 28
        },
        {
          id: 307,
          name: 'Sk8-Hi',
          brand: 'Vans',
          price: 50,
          originalPrice: 70,
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&h=800&fit=crop&q=80',
          rating: 4.7,
          reviews: 267,
          sizes: [8, 9, 10, 11, 12],
          discount: 29
        },
        {
          id: 308,
          name: 'Classic Leather Legacy',
          brand: 'Reebok',
          price: 45,
          originalPrice: 80,
          image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=800&fit=crop&q=80',
          rating: 4.5,
          reviews: 178,
          sizes: [8, 9, 10, 11, 12],
          discount: 44
        }
      ];
      
      setProducts(saleProducts);
      setFilteredProducts(saleProducts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.priceRange === 'under50') return product.price < 50;
        if (filters.priceRange === '50-75') return product.price >= 50 && product.price <= 75;
        if (filters.priceRange === '75-100') return product.price >= 75 && product.price <= 100;
        if (filters.priceRange === 'over100') return product.price > 100;
        return true;
      });
    }

    if (filters.brand !== 'all') {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    if (filters.discount !== 'all') {
      filtered = filtered.filter(product => {
        if (filters.discount === '20-30') return product.discount >= 20 && product.discount < 30;
        if (filters.discount === '30-40') return product.discount >= 30 && product.discount < 40;
        if (filters.discount === '40plus') return product.discount >= 40;
        return true;
      });
    }

    if (filters.sortBy === 'discount') {
      filtered.sort((a, b) => b.discount - a.discount);
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
      discount: 'all',
      sortBy: 'discount'
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

      <div className="bg-gradient-to-r from-red-900 to-orange-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Tag className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sale - Up to 50% Off</h1>
            <p className="text-red-200 text-lg">
              Limited time offers on premium sneakers. Don't miss out!
            </p>
          </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="under50">Under $50</option>
                    <option value="50-75">$50 - $75</option>
                    <option value="75-100">$75 - $100</option>
                    <option value="over100">Over $100</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <select
                    value={filters.discount}
                    onChange={(e) => handleFilterChange('discount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Discounts</option>
                    <option value="20-30">20% - 30%</option>
                    <option value="30-40">30% - 40%</option>
                    <option value="40plus">40% and above</option>
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
            Showing {filteredProducts.length} of {products.length} products on sale
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading sale items...</p>
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
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg">
                      SAVE {product.discount}%
                    </span>
                  </div>

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
                    <span className="text-xl font-bold text-red-600">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      You save ${product.originalPrice - product.price}
                    </div>
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
            <p className="text-gray-600 text-lg mb-4">No sale items found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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

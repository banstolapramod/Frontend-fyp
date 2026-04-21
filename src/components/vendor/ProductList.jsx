import { useState, useEffect } from 'react';
import { 
  Package, Search, Edit, Trash2, Plus, AlertCircle, RefreshCw
} from 'lucide-react';
import { getUserData } from '../../utils/auth';
import { formatPrice } from '../../utils/currency';
import ImageWithFallback from '../ImageWithFallback';
import './VendorStyles.css';

export default function ProductList({ onAddProduct, onEditProduct, externalSearch = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(externalSearch);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Sync external search from header bar
  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = getUserData();
      
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5001/api/products/vendor', {
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      console.log(`✅ Fetched ${data.products?.length || 0} products`);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingProduct(productId);
      const userData = getUserData();
      
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Remove product from local state
      setProducts(products.filter(p => (p.product_id || p.id) !== productId));
      alert(`✅ Product "${productName}" deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`❌ Failed to delete product: ${error.message}`);
    } finally {
      setDeletingProduct(null);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category_name && product.category_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-3 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Products</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock_quantity > 5).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.stock_quantity === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
          <span className="font-semibold">{products.length}</span> products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No Products Found' : 'No Products Yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? 'No products match your search criteria. Try adjusting your search terms.' 
              : 'Start building your inventory by adding your first product using the "Add Product" button above.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.product_id || product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Image — fixed square aspect ratio */}
              <div className="relative w-full" style={{ paddingTop: '75%' }}>
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={product.image_url ? 
                      (product.image_url.startsWith('http') ? 
                        product.image_url : 
                        `http://localhost:5001${product.image_url}`) : 
                      null}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    fallbackText="No Image"
                  />
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate flex-1">{product.name}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2 truncate">{product.brand} · {product.category_name || product.category || '—'}</p>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-emerald-600">{formatPrice(product.price)}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    product.stock_quantity > 5 
                      ? 'bg-green-100 text-green-700' 
                      : product.stock_quantity > 0 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {product.stock_quantity > 5 ? 'In Stock' : product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Out'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onEditProduct(product)}
                    className="flex-1 px-2 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.product_id || product.id, product.name)}
                    disabled={deletingProduct === (product.product_id || product.id)}
                    className="px-2 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingProduct === (product.product_id || product.id) ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
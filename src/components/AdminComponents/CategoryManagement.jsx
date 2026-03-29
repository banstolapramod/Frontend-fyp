import { useState, useEffect } from 'react';
import { 
  Filter, Plus, Edit, Trash2, AlertCircle, RefreshCw
} from 'lucide-react';
import { getUserData, isAdmin, getAuthHeaders } from '../../utils/auth';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check user role and get auth headers
      if (!isAdmin()) {
        throw new Error('Access denied. Admin privileges required.');
      }

      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('🔍 Fetching categories with auth:', {
        url: 'http://localhost:5001/api/categories',
        headers: getAuthHeaders(),
        userRole: userData.role,
        userEmail: userData.email
      });

      // Test basic connectivity first
      try {
        const testResponse = await fetch('http://localhost:5001/api/categories/test');
        console.log('🔍 Test endpoint status:', testResponse.status);
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log('✅ Backend is reachable:', testData);
        }
      } catch (testError) {
        console.error('❌ Backend connectivity test failed:', testError);
        throw new Error('Cannot connect to backend server. Make sure the server is running on http://localhost:5001');
      }

      const response = await fetch('http://localhost:5001/api/categories', {
        headers: getAuthHeaders()
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Try to get error details
        const contentType = response.headers.get('content-type');
        console.log('🔍 Response content-type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } else {
          // If it's not JSON, get the text to see what's being returned
          const errorText = await response.text();
          console.log('🔍 Non-JSON response:', errorText.substring(0, 200) + '...');
          throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}. This usually means the API endpoint doesn't exist.`);
        }
      }

      const data = await response.json();
      setCategories(data.categories || []);
      console.log(`✅ Admin ${userData.email} fetched ${data.categories?.length || 0} categories successfully`);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if the backend is running on http://localhost:5001');
      } else if (error.message.includes('NetworkError')) {
        setError('Network error. Please check your internet connection and backend server.');
      } else {
        setError(error.message);
      }
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', is_active: true });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      is_active: category.is_active
    });
    setShowModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    
    try {
      const userData = getUserData();
      const url = editingCategory 
        ? `http://localhost:5001/api/categories/${editingCategory.category_id}`
        : 'http://localhost:5001/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      alert(`✅ Category ${editingCategory ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
      alert(`❌ Failed to save category: ${error.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      alert(`✅ Category "${categoryName}" deleted successfully!`);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      alert(`❌ Failed to delete category: ${error.message}`);
    }
  };

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category status');
      }

      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error updating category status:', error);
      alert(`❌ Failed to update category status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Category Management</h2>
          <p className="text-gray-500 mt-1">Manage product categories for your store</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Categories</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchCategories}
                className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Yet</h3>
          <p className="text-gray-500 mb-6">Start organizing your products by creating your first category.</p>
          <button 
            onClick={handleAddCategory}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.category_id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                  )}
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      category.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {category.product_count || 0} products
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEditCategory(category)}
                  className="flex-1 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleToggleStatus(category.category_id, category.is_active)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  title={category.is_active ? 'Deactivate' : 'Activate'}
                >
                  {category.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.category_id, category.name)}
                  className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe this category (optional)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                  Active category
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
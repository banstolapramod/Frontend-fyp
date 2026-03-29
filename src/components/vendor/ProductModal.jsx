import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { getUserData } from '../../utils/auth';
import './VendorStyles.css';

export default function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    brand: '',
    size: '',
    color: '',
    stock_quantity: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const isEditing = !!product;

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
    
    if (product) {
      // For editing, we need to map category name back to category_id
      let categoryId = '';
      if (product.category) {
        // Reverse map category name to category_id
        const reverseCategoryMap = {
          'Sneakers': 1,
          'Running Shoes': 2,
          'Basketball Shoes': 3,
          'Casual Shoes': 4,
          'Boots': 5,
          'Sandals': 6,
          'Formal Shoes': 7,
          'Athletic Shoes': 8
        };
        categoryId = reverseCategoryMap[product.category] || '';
        console.log(`🔍 Mapped category "${product.category}" to category_id: ${categoryId}`);
      }
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category_id: categoryId,
        brand: product.brand || '',
        size: product.size || '',
        color: product.color || '',
        stock_quantity: product.stock_quantity || '',
        image_url: product.image_url || ''
      });

      // Set image preview for existing product
      if (product.image_url) {
        const fullImageUrl = product.image_url.startsWith('http') 
          ? product.image_url 
          : `http://localhost:5001${product.image_url}`;
        setImagePreview(fullImageUrl);
      }
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      
      // Use the public categories endpoint that doesn't require authentication
      const response = await fetch('http://localhost:5001/api/categories/public');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Categories fetched from backend:', data);
      
      // Set categories from backend response
      if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
        console.log(`✅ Loaded ${data.categories.length} categories from backend`);
        setError(''); // Clear any previous errors
      } else {
        console.warn('⚠️ No categories found in backend response');
        setCategories([]);
        setError('No categories available. Please ask an administrator to add product categories first.');
      }
      
    } catch (error) {
      console.error('❌ Error fetching categories from backend:', error);
      
      // Show error to user instead of using fallback
      setError(`Failed to load categories: ${error.message}. Please check if the backend server is running.`);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔍 Form field changed: ${name} = ${value} (type: ${typeof value})`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setError(''); // Clear any previous errors

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category_id || !formData.brand || !formData.stock_quantity) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price and stock quantity
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error('Price must be a valid positive number');
      }

      if (isNaN(parseInt(formData.stock_quantity)) || parseInt(formData.stock_quantity) < 0) {
        throw new Error('Stock quantity must be a valid non-negative number');
      }

      // Validate category_id
      if (isNaN(parseInt(formData.category_id)) || parseInt(formData.category_id) <= 0) {
        throw new Error('Please select a valid category');
      }

      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('Authentication required');
      }

      console.log('🔍 User data for product creation:', {
        hasToken: !!userData.token,
        userRole: userData.role,
        userEmail: userData.email,
        userId: userData.id
      });

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('stock_quantity', parseInt(formData.stock_quantity));
      formDataToSend.append('category_id', parseInt(formData.category_id));
      formDataToSend.append('brand', formData.brand);
      
      if (formData.size) formDataToSend.append('size', formData.size);
      if (formData.color) formDataToSend.append('color', formData.color);
      
      // Add image file if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
        console.log('🔍 Adding image file to form data:', selectedImage.name);
      }

      console.log('🔍 Sending product data with FormData');

      const url = isEditing 
        ? `http://localhost:5001/api/products/${product.product_id}`
        : 'http://localhost:5001/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${userData.token}`
          // Don't set Content-Type header - let browser set it for FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Product creation/update failed:', errorData);
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      const data = await response.json();
      console.log(`✅ Product ${isEditing ? 'updated' : 'created'}:`, data);
      
      alert(`✅ Product ${isEditing ? 'updated' : 'created'} successfully!`);
      onSave();
      
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const brands = [
    'Nike',
    'Adidas',
    'Jordan',
    'Puma',
    'New Balance',
    'Converse',
    'Vans',
    'Reebok',
    'Under Armour',
    'ASICS',
    'Other'
  ];

  return (
    <div className="fixed inset-0 modal-overlay flex items-center justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-3xl my-8 border border-gray-300 max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="form-container flex-1 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Product Name - Full Width */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description - Full Width */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium resize-none"
                placeholder="Describe your product in detail"
                required
              />
            </div>

            {/* Price and Stock - Flex Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Category and Brand - Flex Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories 
                      ? 'Loading categories...' 
                      : categories.length === 0 
                        ? 'No categories available' 
                        : 'Select Category'
                    }
                  </option>
                  {categories.map(category => (
                    <option key={category.category_id || category.name} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <p className="text-xs text-blue-600 mt-1 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                    Loading categories from server...
                  </p>
                )}
                {!loadingCategories && categories.length === 0 && (
                  <div className="text-xs text-amber-600 mt-1 p-2 bg-amber-50 rounded border border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">⚠️ No categories available</p>
                        <p className="text-amber-700">Ask an admin to add categories first, or try refreshing.</p>
                      </div>
                      <button
                        type="button"
                        onClick={fetchCategories}
                        className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 rounded text-xs hover:bg-amber-200 transition-colors font-medium"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Size and Color - Flex Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Size
                </label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  placeholder="e.g., 8, 9, 10, M, L, XL"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 font-medium"
                  placeholder="e.g., Black, White, Red"
                />
              </div>
            </div>

            {/* Image Upload - Full Width */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>
              
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all cursor-pointer flex items-center justify-center text-gray-600 hover:text-blue-600"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  {selectedImage ? selectedImage.name : 'Click to upload image or drag and drop'}
                </label>
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        document.getElementById('image-upload').value = '';
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
              </p>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t-2 border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
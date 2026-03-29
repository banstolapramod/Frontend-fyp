import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, DollarSign, TrendingUp, 
  Settings, LogOut, Menu, Search, Plus,
  BarChart3, ShoppingBag, Bell, Home, Store, Users, Grid, List
} from 'lucide-react';
import { getUserData, isVendor, clearUserData } from '../../utils/auth';
import ProductList from './ProductList';
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';
import './VendorStyles.css';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorName, setVendorName] = useState('Vendor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' or 'cards'

  // Check if user is vendor
  useEffect(() => {
    const userData = getUserData();
    
    if (!userData || !userData.token) {
      console.log('❌ No user data found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('🔍 User data found:', {
      role: userData.role,
      email: userData.email,
      vendorStatus: userData.vendorStatus
    });

    if (!isVendor()) {
      console.log('❌ User is not a vendor, role:', userData.role);
      alert('Access denied. Vendor only.');
      navigate('/');
      return;
    }

    // Check vendor approval status
    if (userData.vendorStatus === 'pending') {
      console.log('⏳ Vendor status is pending approval');
      // Show pending approval screen
      setActiveTab('pending');
    } else if (userData.vendorStatus === 'rejected') {
      console.log('❌ Vendor status is rejected');
      alert('Your vendor account has been rejected. Please contact support.');
      navigate('/');
      return;
    } else {
      console.log('✅ Vendor approved, showing dashboard');
    }

    setVendorName(userData.name || userData.email.split('@')[0]);
  }, [navigate]);

  const handleLogout = () => {
    clearUserData();
    navigate('/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    // ProductList component will automatically refresh its data
  };

  const stats = [
    { label: 'Total Products', value: '45', icon: Package, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', change: '+5%', changeColor: 'text-green-600' },
    { label: 'Total Orders', value: '128', icon: ShoppingCart, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', change: '+12%', changeColor: 'text-green-600' },
    { label: 'Revenue', value: '$8,450', icon: DollarSign, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', change: '+18%', changeColor: 'text-green-600' },
    { label: 'Customers', value: '89', icon: Users, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', change: '+8%', changeColor: 'text-green-600' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'profile', label: 'Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Pending approval screen
  if (activeTab === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Approval</h2>
          <p className="text-gray-600 mb-6">
            Your vendor account is currently under review. Please wait for admin approval before you can access the vendor dashboard.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold"
            >
              Check Status
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Left Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-white">Sneakers Spot</h1>
                  <p className="text-xs text-gray-400">Vendor Panel</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-6 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${!sidebarOpen && 'justify-center'}`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${sidebarOpen ? 'mr-3' : ''}`} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-800">
            {sidebarOpen && (
              <div className="bg-gray-800 rounded-lg p-3 mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{vendorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{vendorName}</p>
                    <p className="text-xs text-gray-400">Vendor</p>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <LogOut className={`w-5 h-5 ${sidebarOpen ? 'mr-2' : ''}`} />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-96 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="dashboard-container">
            {activeTab === 'dashboard' && <DashboardContent stats={stats} />}
            {activeTab === 'products' && (
              <ProductsContent 
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
              />
            )}
            {activeTab === 'orders' && <OrdersContent />}
            {activeTab === 'customers' && <CustomersContent />}
            {activeTab === 'profile' && <ProfileContent />}
            {activeTab === 'settings' && <SettingsContent />}
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

// Dashboard Content Component
function DashboardContent({ stats }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome to your store! 🏪</h2>
        <p className="text-emerald-100">Manage your products, track orders, and grow your business.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className={`w-4 h-4 ${stat.changeColor}`} />
                <span className={`text-sm font-bold ${stat.changeColor}`}>{stat.change}</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500 mt-1">Latest orders from your customers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#ORD-{2000 + i}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Customer {i}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Air Jordan {i}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${150 + i * 20}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                      Processing
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Products Content Component
function ProductsContent({ onAddProduct, onEditProduct }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  return (
    <div className="content-container space-y-6">
      {/* View Toggle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('table')}
              className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
            >
              <List className="w-4 h-4" />
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`view-toggle-button ${viewMode === 'cards' ? 'active' : ''}`}
            >
              <Grid className="w-4 h-4" />
              Card View
            </button>
          </div>

          <button 
            onClick={onAddProduct}
            className="vendor-button px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Render appropriate view */}
      <div className="content-container">
        {viewMode === 'table' ? (
          <ProductTable 
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
          />
        ) : (
          <ProductList 
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
          />
        )}
      </div>
    </div>
  );
}

// Orders Content Component
function OrdersContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-12">
          Order management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}

// Customers Content Component
function CustomersContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-500 mt-1">View and manage your customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-12">
          Customer management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}

// Profile Content Component
function ProfileContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Store Profile</h2>
        <p className="text-gray-500 mt-1">Manage your store information and settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-12">
          Store profile management functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}

// Settings Content Component
function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Configure your store preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <p className="text-gray-500 text-center py-12">
          Settings functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}
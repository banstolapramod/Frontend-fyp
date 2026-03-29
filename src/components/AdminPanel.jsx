import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, 
  Settings, LogOut, Menu, Search, Plus, Edit, Trash2,
  Eye, BarChart3, ShoppingBag, Bell, Home, Store, Filter
} from 'lucide-react';
import VendorManagement from './AdminComponents/VendorManagement';
import UserManagement from './AdminComponents/UserManagement';
import CategoryManagement from './AdminComponents/CategoryManagement';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminName, setAdminName] = useState('Admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // Check role from localStorage first
    if (userRole !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    // Set admin name from localStorage or fallback to token decode
    if (userName) {
      setAdminName(userName);
    } else if (userEmail) {
      setAdminName(userEmail.split('@')[0]);
    } else {
      // Fallback to token decode if localStorage doesn't have user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'admin') {
          alert('Access denied. Admin only.');
          navigate('/');
          return;
        }
        setAdminName(payload.name || payload.email.split('@')[0]);
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('vendorStatus');
    
    navigate('/login');
  };

  const stats = [
    { label: 'Total Users', value: '2,543', icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600', change: '+12%', changeColor: 'text-green-600' },
    { label: 'Total Products', value: '1,234', icon: Package, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600', change: '+8%', changeColor: 'text-green-600' },
    { label: 'Total Orders', value: '5,678', icon: ShoppingCart, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', iconColor: 'text-purple-600', change: '+23%', changeColor: 'text-green-600' },
    { label: 'Revenue', value: '$45,678', icon: DollarSign, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50', iconColor: 'text-amber-600', change: '+15%', changeColor: 'text-green-600' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Filter },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-lg font-bold text-white">Sneakers Spot</h1>
                  <p className="text-xs text-gray-400">Admin Panel</p>
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
                      ? 'bg-blue-600 text-white'
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
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{adminName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{adminName}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
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
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-96 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
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
        <main className="flex-1 p-8 overflow-auto">
          {activeTab === 'dashboard' && <DashboardContent stats={stats} />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'vendors' && <VendorManagement />}
          {activeTab === 'products' && <ProductsContent />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'orders' && <OrdersContent />}
          {activeTab === 'settings' && <SettingsContent />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent({ stats }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="text-blue-100">Here's what's happening with your store today.</p>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500 mt-1">Latest transactions from your store</p>
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#ORD-{1000 + i}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Customer {i}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">Nike Air Max</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${120 + i * 10}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Completed
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
function ProductsContent() {
  const [vendorFilter, setVendorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const allProducts = [
    { id: 1, name: 'Air Max 90', brand: 'Nike', price: 130, stock: 45, status: 'In Stock', image: '👟', vendor: 'Jane\'s Sneakers', vendorId: 1 },
    { id: 2, name: 'Ultraboost 22', brand: 'Adidas', price: 190, stock: 23, status: 'In Stock', image: '👟', vendor: 'Jane\'s Sneakers', vendorId: 1 },
    { id: 3, name: 'Fresh Foam', brand: 'New Balance', price: 160, stock: 0, status: 'Out of Stock', image: '👟', vendor: 'Charlie\'s Kicks', vendorId: 2 },
    { id: 4, name: 'Chuck Taylor', brand: 'Converse', price: 75, stock: 67, status: 'In Stock', image: '👟', vendor: 'Charlie\'s Kicks', vendorId: 2 },
    { id: 5, name: 'Old Skool', brand: 'Vans', price: 70, stock: 12, status: 'Low Stock', image: '👟', vendor: 'Premium Sneakers', vendorId: 5 },
    { id: 6, name: 'Jordan 1 High', brand: 'Nike', price: 170, stock: 34, status: 'In Stock', image: '👟', vendor: 'Premium Sneakers', vendorId: 5 },
    { id: 7, name: 'Yeezy Boost', brand: 'Adidas', price: 220, stock: 8, status: 'Low Stock', image: '👟', vendor: 'Jane\'s Sneakers', vendorId: 1 },
    { id: 8, name: 'Classic Leather', brand: 'Reebok', price: 85, stock: 56, status: 'In Stock', image: '👟', vendor: 'Mike\'s Sports', vendorId: 4 }
  ];

  const vendors = ['All', 'Jane\'s Sneakers', 'Charlie\'s Kicks', 'Premium Sneakers', 'Mike\'s Sports'];

  const filteredProducts = allProducts.filter(product => {
    const matchesVendor = vendorFilter === 'All' || product.vendor === vendorFilter;
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
    return matchesVendor && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">Manage inventory organized by vendor</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">Vendor:</span>
            <select 
              value={vendorFilter} 
              onChange={(e) => setVendorFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {vendors.map(vendor => (
                <option key={vendor}>{vendor}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option>All</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{allProducts.length}</span> products
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: #{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Store className="w-4 h-4 text-emerald-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{product.vendor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{product.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

// Orders Content Component
function OrdersContent() {
  const orders = [
    { id: 1001, customer: 'John Doe', product: 'Air Max 90', amount: 130, status: 'Completed', date: '2024-02-15' },
    { id: 1002, customer: 'Jane Smith', product: 'Ultraboost 22', amount: 190, status: 'Processing', date: '2024-02-14' },
    { id: 1003, customer: 'Bob Johnson', product: 'Fresh Foam', amount: 160, status: 'Shipped', date: '2024-02-13' },
    { id: 1004, customer: 'Alice Brown', product: 'Chuck Taylor', amount: 75, status: 'Pending', date: '2024-02-12' },
    { id: 1005, customer: 'Charlie Wilson', product: 'Old Skool', amount: 70, status: 'Completed', date: '2024-02-11' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">#ORD-{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
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

// Settings Content Component
function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your application settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">General Settings</h3>
              <p className="text-xs text-gray-500">Configure basic application settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Site Name</label>
              <input 
                type="text" 
                defaultValue="Sneakers Spot" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
              <input 
                type="email" 
                defaultValue="admin@sneakersspot.com" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                defaultValue="+1 (555) 123-4567" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
            </div>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
              Save Changes
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">Security</h3>
              <p className="text-xs text-gray-500">Update your password and security settings</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
              />
            </div>
            <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">Manage notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">Order Updates</p>
                <p className="text-xs text-gray-500">Get notified about new orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-gray-900">Low Stock Alerts</p>
                <p className="text-xs text-gray-500">Alert when products are low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-900">System Information</h3>
              <p className="text-xs text-gray-500">Application details and version</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Version</span>
              <span className="text-sm font-semibold text-gray-900">v2.1.0</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Last Updated</span>
              <span className="text-sm font-semibold text-gray-900">Feb 11, 2026</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-semibold text-gray-900">PostgreSQL</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
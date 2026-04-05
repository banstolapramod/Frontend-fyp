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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const STATUS_CONFIG = {
    pending:    { label: 'Pending',    bg: '#fef9c3', color: '#854d0e' },
    processing: { label: 'Processing', bg: '#dbeafe', color: '#1e40af' },
    shipped:    { label: 'Shipped',    bg: '#e0f2fe', color: '#0369a1' },
    delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#15803d' },
    cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#b91c1c' },
  };

  const PAYMENT_CONFIG = {
    pending: { label: 'Pending', bg: '#fef9c3', color: '#854d0e' },
    paid:    { label: 'Paid',    bg: '#dcfce7', color: '#15803d' },
    failed:  { label: 'Failed',  bg: '#fee2e2', color: '#b91c1c' },
  };

  const Badge = ({ status, config }) => {
    const cfg = config[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
  };

  const authHeaders = () => {
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    return { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' };
  };

  useEffect(() => {
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    fetch('http://localhost:5001/api/orders/vendor', {
      headers: { 'Authorization': `Bearer ${userData.token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);
    if (orderDetails[orderId]) return;
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    const res = await fetch(`http://localhost:5001/api/orders/vendor/${orderId}`, {
      headers: { 'Authorization': `Bearer ${userData.token}` }
    });
    const d = await res.json();
    if (d.success) setOrderDetails(prev => ({ ...prev, [orderId]: d.order }));
  };

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    try {
      const res = await fetch(`http://localhost:5001/api/orders/vendor/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const d = await res.json();
      if (d.success) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, order_status: status } : o));
        setOrderDetails(prev => prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], order_status: status } } : prev);
      } else alert(`❌ ${d.error}`);
    } catch (e) { alert(`❌ ${e.message}`); }
    finally { setUpdatingId(null); }
  };

  const updatePaymentStatus = async (orderId, payment_status) => {
    setUpdatingId(orderId + '_pay');
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    try {
      const res = await fetch(`http://localhost:5001/api/orders/vendor/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status })
      });
      const d = await res.json();
      if (d.success) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, payment_status } : o));
        setOrderDetails(prev => prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], payment_status } } : prev);
      } else alert(`❌ ${d.error}`);
    } catch (e) { alert(`❌ ${e.message}`); }
    finally { setUpdatingId(null); }
  };
  const imgSrc = (item) => {
    if (!item.image_url) return null;
    return item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`;
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.order_status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-500 mt-1">Track and manage customer orders for your products</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: filterStatus === s ? '#111' : '#f3f4f6', color: filterStatus === s ? '#fff' : '#374151' }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto" />
          <p className="text-gray-500 mt-3">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-lg">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const isOpen = expandedId === order.order_id;
            const detail = orderDetails[order.order_id];
            const isUpdating = updatingId === order.order_id;

            return (
              <div key={order.order_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(order.order_id)}
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 font-mono">#{order.order_id.slice(0, 8).toUpperCase()}</span>
                      <Badge status={order.order_status} config={STATUS_CONFIG} />
                      <Badge status={order.payment_status} config={PAYMENT_CONFIG} />
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                      <span>👤 {order.customer_name || order.full_name}</span>
                      <span>📧 {order.customer_email || order.email}</span>
                      <span>📅 {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{order.payment_method === 'cod' ? '💵 COD' : '💳 Card'}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">${parseFloat(order.total_price).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{isOpen ? '▲ Hide' : '▼ Details'}</p>
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5">
                    {!detail ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Items */}
                        <div className="lg:col-span-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</p>
                          <div className="space-y-2">
                            {detail.items.map((item, i) => (
                              <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                  {imgSrc(item) ? <img src={imgSrc(item)} alt={item.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-400 m-3" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.brand} · Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-bold text-gray-900">${parseFloat(item.subtotal).toFixed(2)}</p>
                                  <p className="text-xs text-gray-400">${parseFloat(item.price_per_unit).toFixed(2)} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right panel */}
                        <div className="space-y-4">
                          {/* Customer & Address */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer & Delivery</p>
                            {[
                              ['Name', detail.full_name],
                              ['Email', detail.customer_email || detail.email],
                              ['Phone', detail.phone],
                              ['Address', detail.address_line],
                              ['City', detail.city],
                              ['State', detail.state],
                              ['ZIP', detail.zip],
                              ['Country', detail.country],
                            ].map(([label, value]) => value ? (
                              <div key={label} className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-400">{label}</span>
                                <span className="font-semibold text-gray-800 text-right max-w-[60%] truncate">{value}</span>
                              </div>
                            ) : null)}
                          </div>

                          {/* Status actions */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Order Status</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { status: 'processing', label: 'Processing', color: '#1e40af', bg: '#dbeafe' },
                                { status: 'shipped',    label: 'Shipped',    color: '#0369a1', bg: '#e0f2fe' },
                                { status: 'delivered',  label: 'Delivered',  color: '#15803d', bg: '#dcfce7' },
                                { status: 'cancelled',  label: 'Cancelled',  color: '#b91c1c', bg: '#fee2e2' },
                              ].map(({ status, label, color, bg }) => (
                                <button
                                  key={status}
                                  onClick={() => updateStatus(order.order_id, status)}
                                  disabled={isUpdating || detail.order_status === status}
                                  style={{ padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: detail.order_status === status ? 'default' : 'pointer', background: detail.order_status === status ? bg : '#fff', color: detail.order_status === status ? color : '#374151', border: `1px solid ${detail.order_status === status ? color : '#e5e7eb'}`, opacity: isUpdating ? 0.6 : 1 }}
                                >
                                  {isUpdating === order.order_id ? '...' : label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Payment status actions */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Payment Status</p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { status: 'pending', label: 'Pending', color: '#854d0e', bg: '#fef9c3' },
                                { status: 'paid',    label: 'Paid',    color: '#15803d', bg: '#dcfce7' },
                                { status: 'failed',  label: 'Failed',  color: '#b91c1c', bg: '#fee2e2' },
                              ].map(({ status, label, color, bg }) => (
                                <button
                                  key={status}
                                  onClick={() => updatePaymentStatus(order.order_id, status)}
                                  disabled={updatingId === order.order_id + '_pay' || detail.payment_status === status}
                                  style={{ padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: detail.payment_status === status ? 'default' : 'pointer', background: detail.payment_status === status ? bg : '#fff', color: detail.payment_status === status ? color : '#374151', border: `1px solid ${detail.payment_status === status ? color : '#e5e7eb'}`, opacity: updatingId === order.order_id + '_pay' ? 0.6 : 1 }}
                                >
                                  {updatingId === order.order_id + '_pay' ? '...' : label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Customers Content Component
function CustomersContent() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const STATUS_CONFIG = {
    pending:    { label: 'Pending',    bg: '#fef9c3', color: '#854d0e' },
    processing: { label: 'Processing', bg: '#dbeafe', color: '#1e40af' },
    shipped:    { label: 'Shipped',    bg: '#e0f2fe', color: '#0369a1' },
    delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#15803d' },
    cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#b91c1c' },
  };

  const Badge = ({ status, config }) => {
    const cfg = config[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
    return <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
  };

  useEffect(() => {
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    fetch('http://localhost:5001/api/orders/vendor/customers', {
      headers: { 'Authorization': `Bearer ${userData.token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.customers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openCustomer = async (customer) => {
    setSelected(customer);
    setDetail(null);
    setLoadingDetail(true);
    const { getUserData } = require('../../utils/auth');
    const userData = getUserData();
    try {
      const res = await fetch(`http://localhost:5001/api/orders/vendor/customers/${customer.user_id}`, {
        headers: { 'Authorization': `Bearer ${userData.token}` }
      });
      const d = await res.json();
      if (d.success) setDetail(d);
    } catch (e) { console.error(e); }
    finally { setLoadingDetail(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-500 mt-1">Customers who have ordered your products</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto" />
          <p className="text-gray-500 mt-3">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-lg">No customers yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.4fr' : '1fr', gap: 20 }}>

          {/* Customer list */}
          <div className="space-y-3">
            {customers.map(c => (
              <div
                key={c.user_id}
                onClick={() => openCustomer(c)}
                className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${selected?.user_id === c.user_id ? 'border-emerald-500 shadow-md' : 'border-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{c.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{c.total_orders} orders</p>
                    <p className="text-xs text-emerald-600 font-semibold">${parseFloat(c.total_spent || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>Member since {formatDate(c.member_since)}</span>
                  <span>Last order: {formatDate(c.last_order_date)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Customer detail panel */}
          {selected && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg,#064e3b,#065f46)', padding: '24px 24px 20px' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>{selected.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{selected.name}</p>
                      <p style={{ color: '#a7f3d0', fontSize: 13 }}>{selected.email}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 13 }}>✕</button>
                </div>
                <div className="flex gap-4">
                  {[
                    ['Orders', selected.total_orders],
                    ['Spent', `$${parseFloat(selected.total_spent || 0).toFixed(2)}`],
                    ['Since', formatDate(selected.member_since)],
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
                      <p style={{ color: '#a7f3d0', fontSize: 11, margin: '0 0 2px' }}>{label}</p>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orders list */}
              <div style={{ padding: 20, maxHeight: 420, overflowY: 'auto' }}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order History</p>
                {loadingDetail ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                  </div>
                ) : detail?.orders?.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No orders found.</p>
                ) : (
                  <div className="space-y-2">
                    {detail?.orders?.map(order => (
                      <div key={order.order_id} style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 14px' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>
                            #{order.order_id.slice(0, 8).toUpperCase()}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>
                            ${parseFloat(order.total_price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge status={order.order_status} config={STATUS_CONFIG} />
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{formatDate(order.created_at)}</span>
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{order.payment_method === 'cod' ? '💵 COD' : '💳 Card'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
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
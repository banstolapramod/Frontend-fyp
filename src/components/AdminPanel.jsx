import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, 
  Settings, LogOut, Menu, Search, Plus, Edit, Trash2,
  Eye, BarChart3, ShoppingBag, Bell, Home, Store, Filter, Star
} from 'lucide-react';
import VendorManagement from './AdminComponents/VendorManagement';
import UserManagement from './AdminComponents/UserManagement';
import CategoryManagement from './AdminComponents/CategoryManagement';
import { formatPrice } from '../utils/currency';

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
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payouts', label: 'Payouts', icon: DollarSign }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 flex-shrink-0 flex flex-col h-screen sticky top-0 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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

              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
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
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'vendors' && <VendorManagement />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'payouts' && <PayoutsContent />}
        </main>
      </div>
    </div>
  );
}

// Dashboard Content Component
function DashboardContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    Promise.all([
      fetch('http://localhost:5001/api/admin/dashboard-stats', { headers }).then(r => r.json()),
      fetch('http://localhost:5001/api/orders/admin/all', { headers }).then(r => r.json()),
    ]).then(([s, o]) => {
      if (s.users || s.vendors) setStats(s);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    pending:    'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-sky-100 text-sky-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  };

  const cards = [
    { label: 'Total Users',      value: stats?.users?.total ?? '—',              icon: Users,       bg: 'bg-blue-50',    color: 'text-blue-600',    sub: `${stats?.users?.customers ?? 0} customers` },
    { label: 'Total Products',   value: stats?.products?.total ?? '—',           icon: Package,     bg: 'bg-emerald-50', color: 'text-emerald-600', sub: `${stats?.products?.totalStock ?? 0} in stock` },
    { label: 'Total Orders',     value: stats?.orders?.total ?? '—',             icon: ShoppingBag, bg: 'bg-purple-50',  color: 'text-purple-600',  sub: `${stats?.orders?.pending ?? 0} pending` },
    { label: 'Total Revenue',    value: stats?.orders ? formatPrice(stats?.orders.revenue) : '—', icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-600', sub: `${stats?.orders?.delivered ?? 0} delivered` },
    { label: 'Active Vendors',   value: stats?.vendors?.approved ?? '—',         icon: Store,       bg: 'bg-teal-50',    color: 'text-teal-600',    sub: `${stats?.vendors?.pending ?? 0} pending approval` },
  ];

  return (
    <div className="space-y-8 px-2">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl px-1">
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100">Here's what's happening with your store today.</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className={`${c.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <c.icon className={`w-6 h-6 ${c.color}`} />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-1">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Products Content Component
function ProductsContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001/api/products/public?limit=100')
      .then(r => r.json())
      .then(d => { if (d.products) setProducts(d.products); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-500 mt-1">All products across all vendors</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing {filtered.length} of {products.length} products</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.product_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {p.image_url ? <img src={p.image_url.startsWith('http') ? p.image_url : `http://localhost:5001${p.image_url}`} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-5 h-5 text-gray-400 m-2.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{p.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.product_id.slice(0,8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.brand}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.category || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.stock_quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.stock_quantity > 10 ? 'bg-green-100 text-green-700' : p.stock_quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock_quantity > 10 ? 'In Stock' : p.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Remove "${p.name}"?`)) return;
                          const token = localStorage.getItem('token');
                          const res = await fetch(`http://localhost:5001/api/orders/admin/products/${p.product_id}`, {
                            method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
                          });
                          const d = await res.json();
                          if (d.success) setProducts(prev => prev.filter(x => x.product_id !== p.product_id));
                          else alert(`❌ ${d.error}`);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No products found</div>}
        </div>
      )}
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

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const STATUS_COLORS = {
    pending:    'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-sky-100 text-sky-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
  };
  const PAY_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    paid:    'bg-green-100 text-green-700',
    failed:  'bg-red-100 text-red-700',
  };

  useEffect(() => {
    fetch('http://localhost:5001/api/orders/admin/all', { headers })
      .then(r => r.json())
      .then(d => { if (d.orders) setOrders(d.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);
    if (orderDetails[orderId]) return;
    const res = await fetch(`http://localhost:5001/api/orders/${orderId}`, { headers });
    const d = await res.json();
    if (d.success) setOrderDetails(prev => ({ ...prev, [orderId]: d.order }));
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingId(orderId + '_status');
    const res = await fetch(`http://localhost:5001/api/orders/admin/${orderId}/status`, {
      method: 'PATCH', headers, body: JSON.stringify({ status })
    });
    const d = await res.json();
    if (d.success) {
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, order_status: status } : o));
      setOrderDetails(prev => prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], order_status: status } } : prev);
    } else alert(`❌ ${d.error}`);
    setUpdatingId(null);
  };

  const updatePaymentStatus = async (orderId, payment_status) => {
    setUpdatingId(orderId + '_pay');
    const res = await fetch(`http://localhost:5001/api/orders/admin/${orderId}/payment-status`, {
      method: 'PATCH', headers, body: JSON.stringify({ payment_status })
    });
    const d = await res.json();
    if (d.success) {
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, payment_status } : o));
      setOrderDetails(prev => prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], payment_status } } : prev);
    } else alert(`❌ ${d.error}`);
    setUpdatingId(null);
  };

  const formatDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-500 mt-1">Full control over all platform orders</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No orders yet</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const isOpen = expandedId === order.order_id;
            const detail = orderDetails[order.order_id];
            return (
              <div key={order.order_id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Row */}
                <div onClick={() => toggleExpand(order.order_id)} className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 font-mono">#{order.order_id.slice(0,8).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-700'}`}>{order.order_status}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${PAY_COLORS[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>{order.payment_status}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                      <span>👤 {order.full_name || '—'}</span>
                      <span>📅 {formatDate(order.created_at)}</span>
                      <span>{order.item_count} items</span>
                      <span>{order.payment_method === 'cod' ? '💵 COD' : '💳 Card'}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">{formatPrice(order.total_price)}</p>
                    <p className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</p>
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="border-t border-gray-100 p-5">
                    {!detail ? (
                      <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="lg:col-span-2">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                          <div className="space-y-2">
                            {detail.items?.map((item, i) => (
                              <div key={i} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                  {item.image_url && <img src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.brand} · Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{formatPrice(item.subtotal)}</p>
                              </div>
                            ))}
                          </div>
                          {/* Delivery info */}
                          <div className="mt-4 bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery</p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                              {[['Name', detail.full_name], ['Email', detail.email], ['Phone', detail.phone], ['Address', detail.address_line], ['City', detail.city], ['Country', detail.country]].map(([l, v]) => v ? (
                                <div key={l} className="flex justify-between"><span className="text-gray-400">{l}</span><span className="font-semibold text-gray-800">{v}</span></div>
                              ) : null)}
                            </div>
                          </div>
                        </div>

                        {/* Admin controls */}
                        <div className="space-y-4">
                          {/* Order status */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Status</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { s: 'processing', label: 'Processing', color: '#1e40af', bg: '#dbeafe' },
                                { s: 'shipped',    label: 'Shipped',    color: '#0369a1', bg: '#e0f2fe' },
                                { s: 'delivered',  label: 'Delivered',  color: '#15803d', bg: '#dcfce7' },
                                { s: 'cancelled',  label: 'Cancelled',  color: '#b91c1c', bg: '#fee2e2' },
                              ].map(({ s, label, color, bg }) => (
                                <button key={s} onClick={() => updateOrderStatus(order.order_id, s)}
                                  disabled={updatingId === order.order_id + '_status' || detail.order_status === s}
                                  style={{ padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: detail.order_status === s ? 'default' : 'pointer', background: detail.order_status === s ? bg : '#fff', color: detail.order_status === s ? color : '#374151', border: `1px solid ${detail.order_status === s ? color : '#e5e7eb'}` }}>
                                  {updatingId === order.order_id + '_status' ? '...' : label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Payment status — admin only */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Status <span className="text-blue-500 normal-case font-normal">(Admin only)</span></p>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { s: 'pending', label: 'Pending', color: '#854d0e', bg: '#fef9c3' },
                                { s: 'paid',    label: 'Paid',    color: '#15803d', bg: '#dcfce7' },
                                { s: 'failed',  label: 'Failed',  color: '#b91c1c', bg: '#fee2e2' },
                              ].map(({ s, label, color, bg }) => (
                                <button key={s} onClick={() => updatePaymentStatus(order.order_id, s)}
                                  disabled={updatingId === order.order_id + '_pay' || detail.payment_status === s}
                                  style={{ padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: detail.payment_status === s ? 'default' : 'pointer', background: detail.payment_status === s ? bg : '#fff', color: detail.payment_status === s ? color : '#374151', border: `1px solid ${detail.payment_status === s ? color : '#e5e7eb'}` }}>
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

// Reviews Content Component
function ReviewsContent() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch all reviews via a direct DB query through admin endpoint
    fetch('http://localhost:5001/api/reviews/admin/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => { if (d.reviews) setReviews(d.reviews); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5001/api/reviews/admin/${reviewId}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    });
    const d = await res.json();
    if (d.success) setReviews(prev => prev.filter(r => r.review_id !== reviewId));
    else alert(`❌ ${d.error}`);
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Review Moderation</h2>
        <p className="text-gray-500 mt-1">Monitor and remove inappropriate reviews</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No reviews yet</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['User', 'Product', 'Rating', 'Comment', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map(r => (
                  <tr key={r.review_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{r.user_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{r.product_name}</td>
                    <td className="px-6 py-4 text-sm text-amber-500 font-bold">{stars(r.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{r.comment || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(r.review_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete review">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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

// Payouts Content Component
function PayoutsContent() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetail, setVendorDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('http://localhost:5001/api/payouts/admin/summary', { headers })
      .then(r => r.json())
      .then(d => { if (d.success) setSummary(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openVendor = async (vendor) => {
    setSelectedVendor(vendor);
    setVendorDetail(null);
    setMsg('');
    setPayAmount('');
    setPayNote('');
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://localhost:5001/api/payouts/admin/vendor/${vendor.vendor_id}`, { headers });
      const d = await res.json();
      if (d.success) setVendorDetail(d);
    } catch (e) { console.error(e); }
    finally { setLoadingDetail(false); }
  };

  const handlePay = async () => {
    if (!payAmount || parseFloat(payAmount) <= 0) { setMsg('❌ Enter a valid amount'); return; }
    setPaying(true); setMsg('');
    try {
      const res = await fetch(`http://localhost:5001/api/payouts/admin/pay/${selectedVendor.vendor_id}`, {
        method: 'POST', headers,
        body: JSON.stringify({ amount: parseFloat(payAmount), note: payNote })
      });
      const d = await res.json();
      if (d.success) {
        setMsg(`✅ ${d.message}`);
        setPayAmount(''); setPayNote('');
        // Refresh both
        openVendor(selectedVendor);
        fetch('http://localhost:5001/api/payouts/admin/summary', { headers })
          .then(r => r.json()).then(d => { if (d.success) setSummary(d); });
      } else setMsg(`❌ ${d.error}`);
    } catch (e) { setMsg(`❌ ${e.message}`); }
    finally { setPaying(false); }
  };

  const fmt = (n) => 'Rs. ' + (parseFloat(n || 0) * 100).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Payouts</h1>
        <p className="text-gray-500 mt-1">Track earnings and record manual payouts to vendors</p>
      </div>

      {/* Platform summary */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Platform Commission (10%)', value: fmt(summary.platform_revenue), bg: 'bg-purple-50', color: 'text-purple-600' },
            { label: 'Total Pending Payouts', value: fmt(summary.total_pending_payouts), bg: 'bg-amber-50', color: 'text-amber-600' },
            { label: 'Active Vendors', value: summary.vendors?.length || 0, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          ].map(({ label, value, bg, color }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 border border-gray-100`}>
              <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedVendor ? '1fr 1.4fr' : '1fr', gap: 20 }}>

        {/* Vendor list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-700">Vendors</p>
          </div>
          <div className="divide-y divide-gray-50">
            {summary?.vendors?.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">No approved vendors yet</p>
            )}
            {summary?.vendors?.map(v => (
              <div
                key={v.vendor_id}
                onClick={() => openVendor(v)}
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedVendor?.vendor_id === v.vendor_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {v.vendor_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{v.vendor_name}</p>
                  <p className="text-xs text-gray-400 truncate">{v.vendor_email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{fmt(v.net_earnings)}</p>
                  <p className={`text-xs font-semibold ${v.pending_payout > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {v.pending_payout > 0 ? `${fmt(v.pending_payout)} owed` : 'Settled'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor detail panel */}
        {selectedVendor && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#1e40af)', padding: '20px 24px' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                    {selectedVendor.vendor_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{selectedVendor.vendor_name}</p>
                    <p className="text-blue-200 text-xs">{selectedVendor.vendor_email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVendor(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '5px 10px', color: '#fff', cursor: 'pointer', fontSize: 13 }}>✕</button>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto" style={{ maxHeight: 520 }}>
              {loadingDetail ? (
                <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
              ) : vendorDetail ? (
                <>
                  {/* Earnings breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Earnings Breakdown</p>
                    {[
                      ['Gross Revenue (delivered orders)', fmt(vendorDetail.earnings.gross_revenue), 'text-gray-900'],
                      [`Platform Commission (${(vendorDetail.earnings.commission_rate * 100).toFixed(0)}%)`, `- ${fmt(vendorDetail.earnings.commission_amount)}`, 'text-red-600'],
                      ['Net Earnings', fmt(vendorDetail.earnings.net_earnings), 'text-emerald-700 font-bold'],
                      ['Total Paid Out', `- ${fmt(vendorDetail.earnings.total_paid)}`, 'text-blue-600'],
                      ['Pending Payout', fmt(vendorDetail.earnings.pending_payout), vendorDetail.earnings.pending_payout > 0 ? 'text-amber-600 font-bold' : 'text-green-600 font-bold'],
                    ].map(([label, value, cls]) => (
                      <div key={label} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{label}</span>
                        <span className={cls}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Record payout */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-3">Record Manual Payout</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Amount ($)</label>
                        <input
                          type="number" min="0" step="0.01"
                          value={payAmount}
                          onChange={e => setPayAmount(e.target.value)}
                          placeholder={`Max: ${fmt(vendorDetail.earnings.pending_payout)}`}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Note (optional)</label>
                        <input
                          type="text"
                          value={payNote}
                          onChange={e => setPayNote(e.target.value)}
                          placeholder="e.g. Bank transfer ref #12345"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {msg && <p className="text-sm font-medium">{msg}</p>}
                      <button
                        onClick={handlePay}
                        disabled={paying || vendorDetail.earnings.pending_payout <= 0}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paying ? 'Recording...' : vendorDetail.earnings.pending_payout <= 0 ? 'No Pending Payout' : 'Mark as Paid'}
                      </button>
                    </div>
                  </div>

                  {/* Payout history */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payout History</p>
                    {vendorDetail.payouts.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">No payouts recorded yet</p>
                    ) : (
                      <div className="space-y-2">
                        {vendorDetail.payouts.map(p => (
                          <div key={p.payout_id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{fmt(p.amount)}</p>
                              <p className="text-xs text-gray-400">{fmtDate(p.created_at)}{p.note ? ` · ${p.note}` : ''}</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Paid</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

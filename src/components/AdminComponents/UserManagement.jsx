import { useState, useEffect } from 'react';
import {
  Users, User, Shield, Search, Filter,
  Edit, Trash2, Eye, Calendar, Mail, Crown, AlertCircle, RefreshCw, X, Save
} from 'lucide-react';
import { getUserData, isAdmin, getAuthHeaders } from '../../utils/auth';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUser, setDeletingUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!isAdmin()) throw new Error('Access denied. Admin privileges required.');
      const userData = getUserData();
      if (!userData || !userData.token) throw new Error('No authentication token found. Please login again.');
      const response = await fetch('http://localhost:5001/api/admin/users', { headers: getAuthHeaders() });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || (user.is_active ? 'Active' : 'Inactive') === statusFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const cfg = {
      admin:    { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown,  label: 'Admin' },
      vendor:   { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Shield, label: 'Vendor' },
      customer: { bg: 'bg-blue-100',   text: 'text-blue-700',   icon: User,   label: 'Customer' },
    };
    const c = cfg[role] || cfg.customer;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${c.bg} ${c.text} flex items-center space-x-1 w-fit`}>
        <c.icon className="w-3 h-3" />
        <span>{c.label}</span>
      </span>
    );
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return;
    try {
      setDeletingUser(userId);
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'DELETE', headers: getAuthHeaders()
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete user');
      }
      setUsers(prev => prev.filter(u => (u.user_id || u.id) !== userId));
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setDeletingUser(null);
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSavingEdit(true);
    try {
      const response = await fetch(`http://localhost:5001/api/admin/users/${editUser.user_id || editUser.id}`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update user');
      }
      setUsers(prev => prev.map(u =>
        (u.user_id || u.id) === (editUser.user_id || editUser.id) ? { ...u, ...editForm } : u
      ));
      setEditUser(null);
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Users</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button onClick={fetchUsers} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" /><span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all user accounts and permissions</p>
        </div>
        <button onClick={fetchUsers} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">
          <RefreshCw className="w-4 h-4" /><span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Customers', count: users.filter(u => u.role === 'customer').length, icon: User,   bg: 'bg-blue-50',    color: 'text-blue-600' },
          { label: 'Vendors',   count: users.filter(u => u.role === 'vendor').length,   icon: Shield, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Admins',    count: users.filter(u => u.role === 'admin').length,    icon: Crown,  bg: 'bg-purple-50',  color: 'text-purple-600' },
          { label: 'Total',     count: users.length,                                    icon: Users,  bg: 'bg-gray-50',    color: 'text-gray-600' },
        ].map(({ label, count, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center">
            <div className={`p-3 ${bg} rounded-lg`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Role:</span>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All</option><option>Customer</option><option>Vendor</option><option>Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All</option><option>Active</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Showing <span className="font-semibold text-gray-700">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold text-gray-700">{users.length}</span> users
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => {
                const uid = user.user_id || user.id;
                return (
                  <tr key={uid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                          user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                          user.role === 'vendor' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                          'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{uid?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />{user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewUser(user)} title="View"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(user)} title="Edit"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteUser(uid, user.name)} disabled={deletingUser === uid} title="Delete"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40">
                          {deletingUser === uid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">User Details</h2>
              <button onClick={() => setViewUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                  viewUser.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                  viewUser.role === 'vendor' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                  'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {viewUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{viewUser.name}</p>
                  {getRoleBadge(viewUser.role)}
                </div>
              </div>
              {[
                ['Email', viewUser.email],
                ['User ID', viewUser.user_id || viewUser.id],
                ['Joined', new Date(viewUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
                ...(viewUser.role === 'vendor' ? [['Vendor Status', viewUser.vendor_status || '—']] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-800 text-right max-w-xs truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} disabled={savingEdit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {savingEdit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

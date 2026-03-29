import { useState, useEffect } from 'react';
import { 
  Users, User, Shield, Search, Filter, Plus, 
  Edit, Trash2, Eye, Calendar, Mail, Crown, AlertCircle, RefreshCw
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

  // Fetch users from API
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
      
      // Check user role and get auth headers
      if (!isAdmin()) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch('http://localhost:5001/api/admin/users', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data.users || []);
      
      console.log(`✅ Admin ${userData.email} fetched ${data.users?.length || 0} users successfully`);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on role, status, and search
  const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || (user.is_active ? 'Active' : 'Inactive') === statusFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown, label: 'Admin' },
      vendor: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: Shield, label: 'Vendor' },
      customer: { bg: 'bg-blue-100', text: 'text-blue-700', icon: User, label: 'Customer' }
    };
    
    const config = roleConfig[role] || roleConfig.customer;
    const IconComponent = config.icon;
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} flex items-center space-x-1 w-fit`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center w-fit ${
        isActive 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const handleDeleteUser = async (userId, userName) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setDeletingUser(userId);
      
      if (!isAdmin()) {
        alert('❌ Access denied. Admin privileges required.');
        return;
      }

      const userData = getUserData();
      if (!userData || !userData.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      const data = await response.json();
      console.log(`✅ Admin ${userData.email} deleted user ${userId}:`, data);
      
      // Remove user from local state
      setUsers(users.filter(u => u.user_id !== userId));
      
      alert(`✅ User "${userName}" has been deleted successfully`);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(`❌ Failed to delete user: ${error.message}`);
    } finally {
      setDeletingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner-professional"></div>
          <p className="mt-3 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-professional-heading text-gray-900">User Management</h1>
            <p className="text-professional-subheading mt-2">
              Manage customer accounts and user permissions
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Users</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchUsers}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-professional-heading text-gray-900">User Management</h1>
          <p className="text-professional-subheading mt-2">
            Manage customer accounts and user permissions
          </p>
        </div>
        <button className="btn-professional bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'customer').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'vendor').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-professional border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Role:</span>
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-professional py-2 px-3 text-sm"
              >
                <option>All</option>
                <option>Customer</option>
                <option>Vendor</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-professional py-2 px-3 text-sm"
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-professional pl-9 pr-4 py-2 w-64 text-sm"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
          <span className="font-semibold">{users.length}</span> users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-professional border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                        user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        user.role === 'vendor' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.user_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user.is_active)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.user_id, user.name)}
                        disabled={deletingUser === user.user_id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        title="Delete User"
                      >
                        {deletingUser === user.user_id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
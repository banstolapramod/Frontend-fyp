import { useState, useEffect } from 'react';
import { 
  Store, CheckCircle, XCircle, Eye, Edit, Filter, 
  Plus, Search, Calendar, Mail, AlertCircle, RefreshCw
} from 'lucide-react';
import { getUserData, isAdmin, getAuthHeaders } from '../../utils/auth';

export default function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0, total: 0 });

  useEffect(() => {
    if (!isAdmin()) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    fetchVendors();
  }, []);

  // Update stats when vendors change
  useEffect(() => {
    updateStats();
  }, [vendors]);

  const updateStats = () => {
    setStats({
      approved: vendors.filter(v => v.vendor_status === 'approved').length,
      pending: vendors.filter(v => v.vendor_status === 'pending').length,
      rejected: vendors.filter(v => v.vendor_status === 'rejected').length,
      total: vendors.length
    });
  };

  const fetchVendors = async () => {
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

      console.log("🔍 Making request with user data:", {
        role: userData.role,
        email: userData.email,
        tokenPreview: userData.token.substring(0, 20) + '...'
      });

      const response = await fetch('http://localhost:5001/api/admin/vendors', {
        headers: getAuthHeaders()
      });
      
      console.log("🔍 Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Error response:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setVendors(data.vendors || []);
      
      console.log(`✅ Admin ${userData.email} fetched ${data.vendors?.length || 0} vendors successfully`);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setError(error.message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (vendorId, newStatus) => {
    try {
      // Check user role before allowing status change
      if (!isAdmin()) {
        alert('❌ Access denied. Admin privileges required.');
        return;
      }

      console.log("🔍 handleStatusChange - vendorId:", vendorId, "type:", typeof vendorId);
      console.log("🔍 handleStatusChange - newStatus:", newStatus);

      setUpdatingStatus(vendorId);
      const userData = getUserData();
      
      if (!userData || !userData.token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const url = `http://localhost:5001/api/admin/vendors/${vendorId}/status`;
      console.log("🔍 Making request to:", url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      console.log("🔍 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("❌ Error response:", errorData);
        throw new Error(errorData.error || `Failed to update vendor status`);
      }

      const data = await response.json();
      console.log(`✅ Admin ${userData.email} updated vendor ${vendorId} status to ${newStatus}:`, data);
      
      // Update local state
      setVendors(vendors.map(v => 
        (v.id || v.user_id) === vendorId ? { ...v, vendor_status: newStatus } : v
      ));
      
      // Show success message
      const statusText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
      alert(`✅ Vendor status updated to ${statusText}`);
      
    } catch (error) {
      console.error('Error updating vendor status:', error);
      alert(`❌ Failed to update status: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Filter vendors based on status and search
  const filteredVendors = vendors.filter(vendor => {
    const matchesStatus = statusFilter === 'All' || vendor.vendor_status === statusFilter.toLowerCase();
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner-professional"></div>
          <p className="mt-3 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-professional-heading text-gray-900">Vendor Management</h1>
            <p className="text-professional-subheading mt-2">
              Manage vendor accounts and approve new vendor registrations
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Vendors</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button 
                onClick={fetchVendors}
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
          <h1 className="text-professional-heading text-gray-900">Vendor Management</h1>
          <p className="text-professional-subheading mt-2">
            Manage vendor accounts and approve new vendor registrations
          </p>
        </div>
        <button className="btn-professional bg-emerald-600 text-white hover:bg-emerald-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-professional p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-professional border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 13, outline: 'none', background: '#fff', cursor: 'pointer' }}
              >
                <option value="All">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            {/* Quick filter buttons */}
            <div className="flex items-center gap-2">
              {['All', 'Approved', 'Pending', 'Rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: statusFilter === s
                      ? s === 'Approved' ? '#dcfce7' : s === 'Pending' ? '#fef9c3' : s === 'Rejected' ? '#fee2e2' : '#111'
                      : '#f3f4f6',
                    color: statusFilter === s
                      ? s === 'Approved' ? '#15803d' : s === 'Pending' ? '#854d0e' : s === 'Rejected' ? '#b91c1c' : '#fff'
                      : '#6b7280'
                  }}
                >
                  {s} {s !== 'All' && `(${stats[s.toLowerCase()]})`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, width: 260, outline: 'none' }}
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredVendors.length}</span> of{' '}
          <span className="font-semibold">{vendors.length}</span> vendors
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-xl shadow-professional border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
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
              {filteredVendors.map((vendor) => {
                const vid = vendor.id || vendor.user_id;
                return (
                <tr key={vid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {vendor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{vendor.name}</p>
                        <p className="text-xs text-gray-500">ID: {vid?.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {vendor.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(vendor.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(vendor.vendor_status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {vendor.vendor_status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(vid, 'approved')}
                            disabled={updatingStatus === vid}
                            className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-medium flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === vid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            <span>Approve</span>
                          </button>
                          <button 
                            onClick={() => handleStatusChange(vid, 'rejected')}
                            disabled={updatingStatus === vid}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingStatus === vid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {vendor.vendor_status === 'approved' && (
                        <button 
                          onClick={() => handleStatusChange(vid, 'rejected')}
                          disabled={updatingStatus === vid}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === vid ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Reject'}
                        </button>
                      )}
                      {vendor.vendor_status === 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(vid, 'approved')}
                          disabled={updatingStatus === vid}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updatingStatus === vid ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Approve'}
                        </button>
                      )}
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No vendors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
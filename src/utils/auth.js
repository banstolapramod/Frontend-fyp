// Authentication utility functions

/**
 * Get user data from localStorage
 * @returns {Object|null} User data object or null if not logged in
 */
export const getUserData = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const vendorStatus = localStorage.getItem('vendorStatus');

  if (!token || !userRole) {
    return null;
  }

  return {
    token,
    role: userRole,
    email: userEmail,
    name: userName,
    id: userId,
    vendorStatus
  };
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

/**
 * Check if user has admin role
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin';
};

/**
 * Check if user has vendor role
 * @returns {boolean} True if user is vendor
 */
export const isVendor = () => {
  return localStorage.getItem('userRole') === 'vendor';
};

/**
 * Check if user has customer role
 * @returns {boolean} True if user is customer
 */
export const isCustomer = () => {
  return localStorage.getItem('userRole') === 'customer';
};

/**
 * Get user role
 * @returns {string|null} User role or null if not logged in
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

/**
 * Get authentication token
 * @returns {string|null} JWT token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Clear all user data from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('vendorStatus');
};

/**
 * Store user data in localStorage
 * @param {Object} userData - User data object
 * @param {string} userData.token - JWT token
 * @param {Object} userData.user - User object
 */
export const storeUserData = (userData) => {
  const { token, user } = userData;
  
  localStorage.setItem('token', token);
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userId', user.id);
  
  if (user.vendor_status) {
    localStorage.setItem('vendorStatus', user.vendor_status);
  }
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization
 */
export const getAuthHeaders = () => {
  const token = getToken();
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
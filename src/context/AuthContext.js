import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext();

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };

    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    loading: true,
    isAuthenticated: false,
    user: null,
    token: null,
    error: null
  });

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          return;
        }

        // Check if token is expired
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired, clearing storage');
            localStorage.clear();
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
            return;
          }
        } catch (decodeError) {
          console.error('Invalid token format, clearing storage');
          localStorage.clear();
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
          return;
        }

        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Try to get user data from localStorage first (faster)
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        const vendorStatus = localStorage.getItem('vendorStatus');
        
        if (userRole && userEmail) {
          const userData = {
            role: userRole,
            email: userEmail,
            name: userName,
            id: userId,
            vendor_status: vendorStatus
          };
          
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: {
              user: userData,
              token
            }
          });
        } else {
          // No localStorage data, clear everything
          console.log('No user data in localStorage, clearing');
          localStorage.clear();
          delete api.defaults.headers.common['Authorization'];
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.clear();
        delete api.defaults.headers.common['Authorization'];
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Store additional user data for backward compatibility
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);
      if (user.vendor_status) {
        localStorage.setItem('vendorStatus', user.vendor_status);
      }
      
      // Set token in API headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set token in API headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear all localStorage
    localStorage.clear();
    
    // Remove token from API headers
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data.user
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Update failed' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Password change failed' 
      };
    }
  };

  // Helper functions
  const isAdmin = () => state.user?.role === 'admin';
  const isVendor = () => state.user?.role === 'vendor';
  const isCustomer = () => state.user?.role === 'customer';

  const getRedirectPath = (user) => {
    switch (user?.role) {
      case 'admin':
        return '/admin-panel';
      case 'vendor':
        return '/vendor-dashboard';
      case 'customer':
      default:
        return '/main';
    }
  };

  // Check if token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // Get token expiration time
  const getTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isVendor,
    isCustomer,
    getRedirectPath,
    isTokenValid,
    getTokenExpiration
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
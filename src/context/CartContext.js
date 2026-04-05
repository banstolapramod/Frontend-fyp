import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserData } from '../utils/auth';

const CartContext = createContext();
const API = 'http://localhost:5001/api/cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const userData = getUserData();
    return userData?.token
      ? { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' }
      : null;
  };

  // Load cart from API when user is logged in
  const fetchCart = useCallback(async () => {
    const headers = authHeaders();
    if (!headers) { setItems([]); return; }
    try {
      setLoading(true);
      const res = await fetch(API, { headers });
      const data = await res.json();
      if (data.success) setItems(data.items || []);
    } catch (e) {
      console.error('Failed to fetch cart:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // Add item — calls POST /api/cart/add, then refreshes cart
  const addToCart = async (productId, quantity = 1) => {
    const headers = authHeaders();
    if (!headers) return { success: false, error: 'Please log in to add items to cart' };
    try {
      const res = await fetch(`${API}/add`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ product_id: productId, quantity })
      });
      const data = await res.json();
      if (data.success) {
        await fetchCart(); // refresh from DB
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to add to cart' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const headers = authHeaders();
    if (!headers) return;
    try {
      await fetch(`${API}/update`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ product_id: productId, quantity })
      });
      await fetchCart();
    } catch (e) {
      console.error('Update cart error:', e);
    }
  };

  // Remove item
  const removeFromCart = async (productId) => {
    const headers = authHeaders();
    if (!headers) return;
    try {
      await fetch(`${API}/remove/${productId}`, { method: 'DELETE', headers });
      setItems(prev => prev.filter(i => i.product_id !== productId));
    } catch (e) {
      console.error('Remove cart error:', e);
    }
  };

  // Clear cart
  const clearCart = async () => {
    const headers = authHeaders();
    if (!headers) return;
    try {
      await fetch(`${API}/clear`, { method: 'DELETE', headers });
      setItems([]);
    } catch (e) {
      console.error('Clear cart error:', e);
    }
  };

  const getCartTotal = () =>
    items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  const getCartItemCount = () =>
    items.reduce((count, i) => count + i.quantity, 0);

  const isInCart = (productId) =>
    items.some(i => i.product_id === productId);

  const getCartItem = (productId) =>
    items.find(i => i.product_id === productId);

  return (
    <CartContext.Provider value={{
      items, loading, error,
      addToCart, updateQuantity, removeFromCart, clearCart,
      getCartTotal, getCartItemCount, isInCart, getCartItem, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export default CartContext;

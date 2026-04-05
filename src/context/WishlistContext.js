import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserData } from '../utils/auth';

const WishlistContext = createContext();
const API = 'http://localhost:5001/api/wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [productIds, setProductIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const authHeaders = () => {
    const userData = getUserData();
    return userData?.token
      ? { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' }
      : null;
  };

  const fetchWishlist = useCallback(async () => {
    const headers = authHeaders();
    if (!headers) { setItems([]); setProductIds(new Set()); return; }
    try {
      setLoading(true);
      const res = await fetch(API, { headers });
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
        setProductIds(new Set(data.productIds || []));
      }
    } catch (e) {
      console.error('Failed to fetch wishlist:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    const headers = authHeaders();
    if (!headers) return { success: false, error: 'Please log in to save favourites' };
    try {
      const res = await fetch(`${API}/toggle`, {
        method: 'POST', headers,
        body: JSON.stringify({ product_id: productId })
      });
      const data = await res.json();
      if (data.success) {
        if (data.action === 'added') {
          setProductIds(prev => new Set([...prev, productId]));
        } else {
          setProductIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
          setItems(prev => prev.filter(i => i.product_id !== productId));
        }
        return { success: true, action: data.action };
      }
      return { success: false, error: data.error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const isFavourite = (productId) => productIds.has(productId);

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, isFavourite, fetchWishlist, count: productIds.size }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}

export default WishlistContext;

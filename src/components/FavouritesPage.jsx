import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Package, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';

export default function FavouritesPage() {
  const navigate = useNavigate();
  const { items, loading, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const imgSrc = (item) => {
    if (!item.image_url) return null;
    return item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`;
  };

  const handleAddToCart = async (item) => {
    const result = await addToCart(item.product_id, 1);
    if (result.success) alert('✅ Added to cart!');
    else alert(`❌ ${result.error}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#d1d5db' }}>|</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Heart size={22} fill="#ef4444" color="#ef4444" />
            Favourites
            {items.length > 0 && (
              <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>({items.length})</span>
            )}
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
            <Heart size={72} color="#fca5a5" />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>No favourites yet</h2>
            <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Click the heart icon on any product to save it here.</p>
            <button onClick={() => navigate('/')} style={{ marginTop: 8, padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {items.map((item) => (
              <div key={item.product_id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}>
                {/* Image */}
                <div
                  onClick={() => navigate(`/product/${item.product_id}`)}
                  style={{ position: 'relative', height: 220, background: '#f3f4f6', cursor: 'pointer', overflow: 'hidden' }}
                >
                  {imgSrc(item) ? (
                    <img src={imgSrc(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={48} color="#d1d5db" />
                    </div>
                  )}
                  {/* Remove from favourites */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(item.product_id); }}
                    style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                  >
                    <Heart size={16} fill="#ef4444" color="#ef4444" />
                  </button>
                </div>

                {/* Info */}
                <div style={{ padding: '16px 18px' }}>
                  <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{item.brand}</p>
                  <p
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 4px', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {item.name}
                  </p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>{item.category}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>{formatPrice(item.price)}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 8px', borderRadius: 999, background: item.stock_quantity > 0 ? '#f0fdf4' : '#fef2f2', color: item.stock_quantity > 0 ? '#16a34a' : '#dc2626' }}>
                      {item.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.stock_quantity === 0}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 0', background: item.stock_quantity === 0 ? '#e5e7eb' : '#111', color: item.stock_quantity === 0 ? '#9ca3af' : '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: item.stock_quantity === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

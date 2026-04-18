import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ShoppingCart, Heart } from 'lucide-react';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getUserData } from '../utils/auth';
import { formatPrice } from '../utils/currency';

export default function BrandPage() {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  // Capitalise for display: "nike" → "Nike"
  const displayName = brandName
    ? brandName.charAt(0).toUpperCase() + brandName.slice(1)
    : '';

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/api/products/public?brand=${encodeURIComponent(brandName)}&limit=100`)
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [brandName]);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    setAddingId(productId);
    const result = await addToCart(productId, 1);
    setAddingId(null);
    if (!result.success) alert(`❌ ${result.error}`);
  };

  const handleToggleFav = async (e, productId) => {
    e.stopPropagation();
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    await toggleWishlist(productId);
  };

  const imgSrc = (p) => {
    if (!p.image_url) return null;
    return p.image_url.startsWith('http') ? p.image_url : `http://localhost:5001${p.image_url}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg,#111 0%,#374151 100%)', padding: '48px 24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/brands')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 20 }}
          >
            <ArrowLeft size={15} /> All Brands
          </button>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px' }}>{displayName}</h1>
          <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: '#e5e7eb', borderRadius: 18, height: 320, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Package size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>No products found</h2>
            <p style={{ color: '#6b7280', margin: '0 0 24px' }}>
              No {displayName} products are listed yet.
            </p>
            <button
              onClick={() => navigate('/brands')}
              style={{ padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              Browse All Brands
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {products.map(product => {
              const fav = isFavourite(product.product_id);
              const isAdding = addingId === product.product_id;
              return (
                <div
                  key={product.product_id}
                  onClick={() => navigate(`/product/${product.product_id}`)}
                  style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 200, background: '#f3f4f6', overflow: 'hidden' }}>
                    {imgSrc(product) ? (
                      <img src={imgSrc(product)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={44} color="#d1d5db" />
                      </div>
                    )}
                    <button
                      onClick={e => handleToggleFav(e, product.product_id)}
                      style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 2 }}
                    >
                      <Heart size={16} fill={fav ? '#ef4444' : 'none'} color={fav ? '#ef4444' : '#9ca3af'} />
                    </button>
                    {product.stock_quantity === 0 && (
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#fee2e2', color: '#b91c1c', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{product.brand}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>{product.category}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>{formatPrice(product.price)}</span>
                      <button
                        onClick={e => handleAddToCart(e, product.product_id)}
                        disabled={isAdding || product.stock_quantity === 0}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: product.stock_quantity === 0 ? '#e5e7eb' : '#111', color: product.stock_quantity === 0 ? '#9ca3af' : '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ShoppingCart size={14} />
                        {isAdding ? '...' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

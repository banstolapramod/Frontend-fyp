import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Package, ShoppingCart, Star, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getUserData } from '../utils/auth';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';

export default function VendorProfilePage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/api/products/vendor-profile/${vendorId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setVendor(data.vendor);
          setProducts(data.products);
          setStats(data.stats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [vendorId]);

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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ width: 44, height: 44, border: '3px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!vendor) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Store size={64} color="#d1d5db" />
      <p style={{ color: '#6b7280', fontSize: 18 }}>Vendor not found</p>
      <button onClick={() => navigate(-1)} style={{ padding: '10px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Go Back</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #111 0%, #374151 100%)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '6px 12px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 24 }}>
            <ArrowLeft size={15} /> Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '3px solid rgba(255,255,255,0.2)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 32 }}>{vendor.name?.charAt(0).toUpperCase()}</span>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0 }}>{vendor.name}</h1>
                <span style={{ background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>Verified Seller</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 12px' }}>{vendor.email}</p>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
                <span style={{ color: '#9ca3af', fontSize: 13, marginLeft: 4 }}>Trusted Seller</span>
              </div>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  [stats.total_products, 'Products'],
                  [stats.in_stock, 'In Stock'],
                  [new Date(vendor.created_at).getFullYear(), 'Member Since'],
                ].map(([val, label]) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 16px', textAlign: 'center' }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: 0 }}>{val}</p>
                    <p style={{ color: '#9ca3af', fontSize: 11, margin: '2px 0 0' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>
            All Products <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>({filtered.length})</span>
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              style={{ paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 14, outline: 'none', width: 240, background: '#fff' }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Package size={56} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#6b7280', fontSize: 16 }}>No products found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {filtered.map(product => {
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
                    {/* Heart */}
                    <button
                      onClick={e => handleToggleFav(e, product.product_id)}
                      style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 2 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={fav ? '#ef4444' : 'none'} stroke={fav ? '#ef4444' : '#9ca3af'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {/* Stock badge */}
                    {product.stock_quantity === 0 && (
                      <div style={{ position: 'absolute', top: 10, left: 10, background: '#fee2e2', color: '#b91c1c', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>Out of Stock</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{product.brand}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>{product.category}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>${parseFloat(product.price).toFixed(2)}</span>
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

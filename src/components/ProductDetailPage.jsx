import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Package, Star, Store, Shield, Truck } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isFavourite } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const favourite = product ? isFavourite(product.product_id) : false;

  const handleToggleFavourite = async () => {
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    await toggleWishlist(product.product_id);
  };

  useEffect(() => {
    fetch(`http://localhost:5001/api/products/public/${productId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProduct(data.product);
        else setError(data.error || 'Product not found');
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }
    setAddingToCart(true);
    try {
      const result = await addToCart(productId, quantity);
      if (result.success) alert('✅ Added to cart!');
      else alert(`❌ ${result.error}`);
    } catch (e) {
      alert(`❌ ${e.message}`);
    } finally {
      setAddingToCart(false);
    }
  };

  const imageUrl = product?.image_url
    ? product.image_url.startsWith('http') ? product.image_url : `http://localhost:5001${product.image_url}`
    : null;

  const stockColor = product?.stock_quantity > 10 ? '#16a34a' : product?.stock_quantity > 0 ? '#d97706' : '#dc2626';
  const stockBg   = product?.stock_quantity > 10 ? '#f0fdf4' : product?.stock_quantity > 0 ? '#fffbeb' : '#fef2f2';
  const stockText = product?.stock_quantity > 10 ? 'In Stock' : product?.stock_quantity > 0 ? `Only ${product.stock_quantity} left` : 'Out of Stock';

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f9fafb' }}>
      <Package size={64} color="#d1d5db" />
      <p style={{ color: '#6b7280', fontSize: 18 }}>{error}</p>
      <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>

      {/* Sticky top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontWeight: 500, fontSize: 15 }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <span style={{ color: '#d1d5db' }}>|</span>
          <span style={{ color: '#9ca3af', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>

          {/* LEFT column — image + details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Image */}
            <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 420, background: 'linear-gradient(135deg,#f3f4f6,#e5e7eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={72} color="#d1d5db" />
                </div>
              )}
            </div>

            {/* Details card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ fontWeight: 600, fontSize: 16, color: '#111', marginBottom: 16 }}>Product Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                {[
                  ['Brand', product.brand],
                  ['Category', product.category],
                  ['Size', product.size || '—'],
                  ['Color', product.color || '—'],
                  ['Stock', `${product.stock_quantity} units`],
                  ['Condition', 'New'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{value}</p>
                  </div>
                ))}
              </div>
              {product.description && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 8 }}>Description</p>
                  <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{product.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT column — purchase + vendor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Purchase card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 72 }}>

              {/* Name + heart */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{product.brand}</p>
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>{product.name}</h1>
                </div>
                <button
                  onClick={handleToggleFavourite}
                  style={{ background: favourite ? '#fef2f2' : '#f9fafb', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                  <Heart size={18} fill={favourite ? '#ef4444' : 'none'} color={favourite ? '#ef4444' : '#9ca3af'} />
                </button>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
                <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>(24 reviews)</span>
              </div>

              {/* Price */}
              <p style={{ fontSize: 32, fontWeight: 800, color: '#111', marginBottom: 8 }}>
                ${parseFloat(product.price).toFixed(2)}
              </p>

              {/* Stock badge */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: stockBg, color: stockColor }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: stockColor, display: 'inline-block' }} />
                  {stockText}
                </span>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Qty</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#374151' }}>−</button>
                  <span style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} style={{ padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#374151' }}>+</button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: product.stock_quantity === 0 ? '#9ca3af' : '#111', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 600,
                  cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
                }}
              >
                <ShoppingCart size={18} />
                {addingToCart ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Trust badges */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  [Truck, 'Free shipping on orders over $100'],
                  [Shield, 'Authenticity guaranteed'],
                  [Package, 'Easy 30-day returns'],
                ].map(([Icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6b7280' }}>
                    <Icon size={15} color="#9ca3af" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor card */}
            {product.vendor_name && (
              <div
                onClick={() => navigate(`/vendor/${product.vendor_id}`)}
                style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#374151,#111)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>{product.vendor_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{product.vendor_name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Store size={12} color="#9ca3af" />
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>Verified Seller</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#fbbf24" color="#fbbf24" />)}
                  <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>5.0 seller rating</span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                  Trusted seller with verified products and fast shipping. All items are authentic and quality-checked.
                </p>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>View all products from this seller</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>View Store →</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Review Section ── */}
        <ReviewSection productId={productId} currentUserId={product?.user_id} />

      </div>
    </div>
  );
}

// ── Review Section ────────────────────────────────────────────────
function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userData = getUserData();

  const fetchReviews = () => {
    fetch(`http://localhost:5001/api/reviews/${productId}`)
      .then(r => r.json())
      .then(d => { if (d.success) { setReviews(d.reviews); setStats(d.stats); } })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData?.token) { setError('Please log in to leave a review'); return; }
    if (rating === 0) { setError('Please select a star rating'); return; }
    setError(''); setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Review submitted!');
        setRating(0); setComment('');
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (e) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    await fetch(`http://localhost:5001/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${userData.token}` }
    });
    fetchReviews();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const StarRow = ({ value, interactive = false, size = 20 }) => (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onClick={() => interactive && setRating(s)}
          onMouseEnter={() => interactive && setHoverRating(s)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{ cursor: interactive ? 'pointer' : 'default', fontSize: size, lineHeight: 1 }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24"
            fill={s <= (interactive ? (hoverRating || value) : value) ? '#fbbf24' : 'none'}
            stroke={s <= (interactive ? (hoverRating || value) : value) ? '#fbbf24' : '#d1d5db'}
            strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 28 }}>
          Customer Reviews
          {stats && parseInt(stats.total) > 0 && (
            <span style={{ fontSize: 15, fontWeight: 500, color: '#6b7280', marginLeft: 10 }}>({stats.total})</span>
          )}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 32, alignItems: 'start' }}>

          {/* Left — reviews list */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                <p style={{ fontSize: 16 }}>No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {reviews.map(r => (
                  <div key={r.review_id} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#374151,#111)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{r.user_name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{r.user_name}</p>
                          <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{formatDate(r.created_at)}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRow value={r.rating} size={15} />
                        {userData?.id === r.user_id && (
                          <button onClick={() => handleDelete(r.review_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: 12, fontWeight: 600, padding: '2px 6px' }}>Delete</button>
                        )}
                      </div>
                    </div>
                    {r.comment && <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — stats + write review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Rating summary */}
            {stats && parseInt(stats.total) > 0 && (
              <div style={{ background: '#fff', borderRadius: 18, padding: 22, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 44, fontWeight: 800, color: '#111', margin: 0, lineHeight: 1 }}>{parseFloat(stats.average).toFixed(1)}</p>
                    <StarRow value={Math.round(stats.average)} size={16} />
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>{stats.total} reviews</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    {[5,4,3,2,1].map(n => {
                      const count = parseInt(stats[['','one','two','three','four','five'][n]]) || 0;
                      const pct = parseInt(stats.total) > 0 ? (count / parseInt(stats.total)) * 100 : 0;
                      return (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#6b7280', width: 8 }}>{n}</span>
                          <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#fbbf24', borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#9ca3af', width: 16, textAlign: 'right' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Write review form */}
            <div style={{ background: '#fff', borderRadius: 18, padding: 22, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Write a Review</h3>

              {!userData?.token ? (
                <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', padding: '12px 0' }}>
                  <a href="/login" style={{ color: '#111', fontWeight: 600 }}>Log in</a> to leave a review
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Your Rating *</p>
                    <StarRow value={rating} interactive size={28} />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Comment (optional)</p>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>

                  {error && <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 10 }}>{error}</p>}
                  {success && <p style={{ fontSize: 12, color: '#16a34a', marginBottom: 10 }}>{success}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ width: '100%', padding: '12px 0', background: submitting ? '#9ca3af' : '#111', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

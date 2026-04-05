import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, loading, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const imgSrc = (item) => {
    if (!item.image_url) return null;
    return item.image_url.startsWith('http')
      ? item.image_url
      : `http://localhost:5001${item.image_url}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#d1d5db' }}>|</span>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111', margin: 0 }}>
            Shopping Cart
            {items.length > 0 && (
              <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginLeft: 8 }}>
                ({items.length} {items.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
            <ShoppingBag size={72} color="#d1d5db" />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/')}
              style={{ marginTop: 8, padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 28, alignItems: 'start' }}>

            {/* LEFT — items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Clear cart */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Trash2 size={14} /> Clear all
                </button>
              </div>

              {items.map((item) => (
                <div key={item.product_id} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>

                  {/* Image */}
                  <div
                    onClick={() => navigate(`/product/${item.product_id}`)}
                    style={{ width: 96, height: 96, borderRadius: 12, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0, cursor: 'pointer' }}
                  >
                    {imgSrc(item) ? (
                      <img src={imgSrc(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={28} color="#d1d5db" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ minWidth: 0, paddingRight: 12 }}>
                        <p
                          onClick={() => navigate(`/product/${item.product_id}`)}
                          style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {item.name}
                        </p>
                        <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 8, flexShrink: 0 }}
                      >
                        <Trash2 size={16} color="#f87171" />
                      </button>
                    </div>

                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px' }}>{item.category}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: 16 }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '6px 14px', fontSize: 14, fontWeight: 600, borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock_quantity}
                          style={{ padding: '6px 12px', background: 'none', border: 'none', cursor: item.quantity >= item.stock_quantity ? 'not-allowed' : 'pointer', color: item.quantity >= item.stock_quantity ? '#d1d5db' : '#374151', fontSize: 16 }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>
                            ${parseFloat(item.price).toFixed(2)} each
                          </p>
                        )}
                        {item.quantity >= item.stock_quantity && (
                          <p style={{ fontSize: 11, color: '#f59e0b', margin: '4px 0 0', fontWeight: 500 }}>
                            Max stock reached
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — order summary */}
            <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Summary card */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 20 }}>Order Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                    <span>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#16a34a' : '#6b7280', fontWeight: shipping === 0 ? 600 : 400 }}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, color: '#111', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 100 && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#15803d' }}>
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  style={{ width: '100%', padding: '14px 0', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate('/')}
                  style={{ width: '100%', padding: '12px 0', background: 'none', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                >
                  Continue Shopping
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 18, border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  [Truck, 'Free shipping over $100'],
                  [Shield, 'Secure checkout'],
                  [Package, 'Easy 30-day returns'],
                ].map(([Icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#6b7280' }}>
                    <Icon size={16} color="#9ca3af" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Truck, CheckCircle, Package, Shield, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { getUserData } from '../utils/auth';
import { Header } from './LandingPageComponents/Header';
import StripePaymentForm from './StripePaymentForm';

const STEPS = ['Shipping', 'Payment', 'Review'];

// Stripe instance — loaded once
let stripePromise = null;
const getStripe = async () => {
  if (!stripePromise) {
    const res = await fetch('http://localhost:5001/api/stripe/publishable-key');
    const data = await res.json();
    stripePromise = loadStripe(data.publishable_key);
  }
  return stripePromise;
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getCartTotal, fetchCart } = useCart();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [khaltiLoading, setKhaltiLoading] = useState(false);

  // Stripe state
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripePendingOrderId, setStripePendingOrderId] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(false);

  const subtotal = getCartTotal();
  const shippingCost = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const imgSrc = (item) => {
    if (!item.image_url) return null;
    return item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`;
  };

  // Validation
  const validateShipping = () => {
    const e = {};
    if (!shipping.fullName.trim()) e.fullName = 'Required';
    if (!shipping.email.trim() || !/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Valid email required';
    if (!shipping.phone.trim()) e.phone = 'Required';
    if (!shipping.address.trim()) e.address = 'Required';
    if (!shipping.city.trim()) e.city = 'Required';
    if (!shipping.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    if (paymentMethod !== 'card') return true;
    const e = {};
    if (!card.number.replace(/\s/g, '').match(/^\d{16}$/)) e.number = 'Valid 16-digit card number required';
    if (!card.name.trim()) e.name = 'Required';
    if (!card.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'MM/YY format required';
    if (!card.cvv.match(/^\d{3,4}$/)) e.cvv = '3-4 digits required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validateCard()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }

    // Khalti payment — redirect to Khalti
    if (paymentMethod === 'khalti') {
      setKhaltiLoading(true);
      try {
        const res = await fetch('http://localhost:5001/api/khalti/initiate', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ shippingAddress: shipping })
        });
        const data = await res.json();
        if (data.success && data.payment_url) {
          // Redirect to Khalti hosted payment page
          window.location.href = data.payment_url;
        } else {
          alert(`❌ ${data.error}`);
        }
      } catch (e) {
        alert(`❌ ${e.message}`);
      } finally {
        setKhaltiLoading(false);
      }
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: shipping,
          paymentMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.order.order_id);
        await fetchCart();
        setStep(3);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (e) {
      alert(`❌ ${e.message}`);
    } finally {
      setPlacing(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
    border: `1.5px solid ${errors[field] ? '#f87171' : '#e5e7eb'}`,
    outline: 'none', background: '#fff', color: '#111', boxSizing: 'border-box'
  });

  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' };

  // ── Success screen ──────────────────────────────────────────────
  if (step === 3) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} color="#16a34a" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 8px' }}>Order Placed!</h1>
        <p style={{ color: '#6b7280', fontSize: 15, margin: '0 0 6px' }}>Thank you for your purchase.</p>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 28px' }}>Order ID: <span style={{ fontFamily: 'monospace', color: '#374151' }}>{orderId?.slice(0, 8)}...</span></p>
        <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Order Details</p>
          {[
            ['Name', shipping.fullName],
            ['Address', shipping.address],
            ['City', shipping.city],
            ['State / ZIP', `${shipping.state} ${shipping.zip}`],
            ['Country', shipping.country],
            ['Payment', paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'],
            ['Total', formatPrice(total)],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
              <span>{label}</span>
              <span style={{ fontWeight: 600, color: '#111' }}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('/')} style={{ width: '100%', padding: '13px 0', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 10 }}>
          Continue Shopping
        </button>
        <button onClick={() => navigate('/orders')} style={{ width: '100%', padding: '11px 0', background: 'none', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          View My Orders
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 24px' }}>

        {/* Back + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => step === 0 ? navigate('/cart') : setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} /> {step === 0 ? 'Back to Cart' : 'Back'}
          </button>
          <span style={{ color: '#d1d5db' }}>|</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>Checkout</h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: i <= step ? '#111' : '#e5e7eb', color: i <= step ? '#fff' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 500, color: i === step ? '#111' : '#9ca3af', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#111' : '#e5e7eb', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 24, alignItems: 'start' }}>

          {/* LEFT — form */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

            {/* STEP 0 — Shipping */}
            {step === 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <MapPin size={20} color="#111" />
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0 }}>Shipping Information</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe', full: true },
                    { key: 'email', label: 'Email Address', placeholder: 'john@example.com', full: false },
                    { key: 'phone', label: 'Phone Number', placeholder: '+1 234 567 8900', full: false },
                    { key: 'address', label: 'Street Address', placeholder: '123 Main Street', full: true },
                    { key: 'city', label: 'City', placeholder: 'New York', full: false },
                    { key: 'state', label: 'State / Province', placeholder: 'NY', full: false },
                    { key: 'zip', label: 'ZIP / Postal Code', placeholder: '10001', full: false },
                    { key: 'country', label: 'Country', placeholder: 'US', full: false },
                  ].map(({ key, label, placeholder, full }) => (
                    <div key={key} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        value={shipping[key]}
                        onChange={e => setShipping(p => ({ ...p, [key]: e.target.value }))}
                        placeholder={placeholder}
                        style={inputStyle(key)}
                      />
                      {errors[key] && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors[key]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <CreditCard size={20} color="#111" />
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0 }}>Payment Method</h2>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {[
                    { value: 'cod',    icon: Truck,       title: 'Cash on Delivery',      desc: 'Pay when your order arrives' },
                    { value: 'stripe', icon: CreditCard,  title: 'Credit / Debit Card',   desc: 'Visa, Mastercard, Amex — powered by Stripe', stripe: true },
                    { value: 'khalti', icon: CreditCard,  title: 'Khalti',                desc: 'Pay securely via Khalti digital wallet', khalti: true },
                  ].map(({ value, icon: Icon, title, desc, khalti, stripe: isStripe }) => (
                    <div
                      key={value}
                      onClick={() => setPaymentMethod(value)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, border: `2px solid ${paymentMethod === value ? '#5C2D91' : '#e5e7eb'}`, cursor: 'pointer', background: paymentMethod === value ? '#faf5ff' : '#fff', transition: 'all 0.15s' }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: khalti ? '#5C2D91' : isStripe ? '#5469d4' : paymentMethod === value ? '#111' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {khalti ? (
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>K</span>
                        ) : isStripe ? (
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: 11 }}>S</span>
                        ) : (
                          <Icon size={18} color={paymentMethod === value ? '#fff' : '#6b7280'} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{title}</p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{desc}</p>
                      </div>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === value ? '#5C2D91' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {paymentMethod === value && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#5C2D91' }} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card form */}
                {paymentMethod === 'card' && (
                  <div style={{ background: '#f9fafb', borderRadius: 14, padding: 20, border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                      <Lock size={14} color="#6b7280" />
                      <span style={{ fontSize: 12, color: '#6b7280' }}>Your card details are encrypted and secure</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Card Number</label>
                        <input
                          value={card.number}
                          onChange={e => setCard(p => ({ ...p, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19) }))}
                          placeholder="1234 5678 9012 3456"
                          style={inputStyle('number')}
                        />
                        {errors.number && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.number}</p>}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Cardholder Name</label>
                        <input value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" style={inputStyle('name')} />
                        {errors.name && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.name}</p>}
                      </div>
                      <div>
                        <label style={labelStyle}>Expiry Date</label>
                        <input
                          value={card.expiry}
                          onChange={e => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                            setCard(p => ({ ...p, expiry: v }));
                          }}
                          placeholder="MM/YY"
                          style={inputStyle('expiry')}
                        />
                        {errors.expiry && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.expiry}</p>}
                      </div>
                      <div>
                        <label style={labelStyle}>CVV</label>
                        <input value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" style={inputStyle('cvv')} />
                        {errors.cvv && <p style={{ fontSize: 12, color: '#ef4444', margin: '4px 0 0' }}>{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Package size={20} color="#111" />
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: 0 }}>Review Your Order</h2>
                </div>

                {/* Shipping summary */}
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Shipping To</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                    {[
                      ['Full Name', shipping.fullName],
                      ['Email', shipping.email],
                      ['Phone', shipping.phone],
                      ['Address', shipping.address],
                      ['City', shipping.city],
                      ['State', shipping.state],
                      ['ZIP Code', shipping.zip],
                      ['Country', shipping.country],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment summary */}
                <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Payment</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>
                    {paymentMethod === 'cod' ? '💵 Cash on Delivery' : `💳 Card ending in ${card.number.slice(-4)}`}
                  </p>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <div key={item.product_id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                        {imgSrc(item) ? <img src={imgSrc(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={24} color="#d1d5db" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111', flexShrink: 0 }}>{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action button */}
            <div style={{ marginTop: 28 }}>
              {step < 2 ? (
                <button onClick={handleNext} style={{ width: '100%', padding: '14px 0', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  Continue →
                </button>
              ) : paymentMethod === 'stripe' ? (
                /* Stripe inline payment form */
                stripeClientSecret && stripeInstance ? (
                  <Elements stripe={stripeInstance} options={{ clientSecret: stripeClientSecret }}>
                    <StripePaymentForm
                      clientSecret={stripeClientSecret}
                      pendingOrderId={stripePendingOrderId}
                      total={total}
                      onSuccess={(order) => { setOrderId(order.order_id); fetchCart(); setStep(3); }}
                      onError={(msg) => alert(`❌ ${msg}`)}
                    />
                  </Elements>
                ) : (
                  <button
                    onClick={async () => {
                      const userData = getUserData();
                      if (!userData?.token) { navigate('/login'); return; }
                      setStripeLoading(true);
                      try {
                        const res = await fetch('http://localhost:5001/api/stripe/create-payment-intent', {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${userData.token}`, 'Content-Type': 'application/json' },
                          body: JSON.stringify({ shippingAddress: shipping })
                        });
                        const data = await res.json();
                        if (data.success) {
                          const instance = await getStripe();
                          setStripeInstance(instance);
                          setStripeClientSecret(data.client_secret);
                          setStripePendingOrderId(data.pending_order_id);
                        } else {
                          alert(`❌ ${data.error}`);
                        }
                      } catch (e) {
                        alert(`❌ ${e.message}`);
                      } finally {
                        setStripeLoading(false);
                      }
                    }}
                    disabled={stripeLoading}
                    style={{ width: '100%', padding: '14px 0', background: stripeLoading ? '#6b7280' : '#5469d4', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: stripeLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Lock size={16} /> {stripeLoading ? 'Loading...' : `Pay with Stripe — ${formatPrice(total)}`}
                  </button>
                )
              ) : (
                <button onClick={handlePlaceOrder} disabled={placing || khaltiLoading} style={{ width: '100%', padding: '14px 0', background: placing || khaltiLoading ? '#6b7280' : paymentMethod === 'khalti' ? '#5C2D91' : '#16a34a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: placing || khaltiLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {placing || khaltiLoading ? 'Processing...' : paymentMethod === 'khalti' ? (
                    <>Pay with Khalti — {formatPrice(total)}</>
                  ) : (
                    <><Shield size={16} /> Place Order — {formatPrice(total)}</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — order summary */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>Order Summary</h2>

            {/* Items */}
            <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.product_id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: '#f3f4f6', flexShrink: 0 }}>
                    {imgSrc(item) ? <img src={imgSrc(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '1px 0 0' }}>×{item.quantity}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', flexShrink: 0 }}>{formatPrice(parseFloat(item.price) * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['Subtotal', formatPrice(subtotal)],
                ['Shipping', shippingCost === 0 ? 'Free' : formatPrice(shippingCost)],
                ['Tax (8%)', formatPrice(tax)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                  <span>{label}</span>
                  <span style={{ color: label === 'Shipping' && shippingCost === 0 ? '#16a34a' : '#6b7280', fontWeight: label === 'Shipping' && shippingCost === 0 ? 600 : 400 }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#111', paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

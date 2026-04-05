import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, ChevronDown, ChevronUp, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { Header } from './LandingPageComponents/Header';
import { Footer } from './LandingPageComponents/Footer';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    bg: '#fef9c3', color: '#854d0e' },
  processing: { label: 'Processing', bg: '#dbeafe', color: '#1e40af' },
  shipped:    { label: 'Shipped',    bg: '#e0f2fe', color: '#0369a1' },
  delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#15803d' },
  cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#b91c1c' },
};

const PAYMENT_CONFIG = {
  pending: { label: 'Pending',  bg: '#fef9c3', color: '#854d0e' },
  paid:    { label: 'Paid',     bg: '#dcfce7', color: '#15803d' },
  failed:  { label: 'Failed',   bg: '#fee2e2', color: '#b91c1c' },
};

function StatusBadge({ status, config }) {
  const cfg = config[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(null);

  useEffect(() => {
    const userData = getUserData();
    if (!userData?.token) { navigate('/login'); return; }

    fetch('http://localhost:5001/api/orders', {
      headers: { 'Authorization': `Bearer ${userData.token}` }
    })
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.orders || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);

    if (orderDetails[orderId]) return; // already loaded

    setLoadingDetail(orderId);
    const userData = getUserData();
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${userData.token}` }
      });
      const data = await res.json();
      if (data.success) setOrderDetails(prev => ({ ...prev, [orderId]: data.order }));
    } catch (e) { console.error(e); }
    finally { setLoadingDetail(null); }
  };

  const imgSrc = (item) => {
    if (!item.image_url) return null;
    return item.image_url.startsWith('http') ? item.image_url : `http://localhost:5001${item.image_url}`;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#d1d5db' }}>|</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={22} color="#111" /> My Orders
            {orders.length > 0 && <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>({orders.length})</span>}
          </h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
            <Package size={72} color="#d1d5db" />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>No orders yet</h2>
            <p style={{ color: '#6b7280', fontSize: 15, margin: 0 }}>Your order history will appear here.</p>
            <button onClick={() => navigate('/')} style={{ marginTop: 8, padding: '12px 28px', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(order => {
              const isOpen = expandedId === order.order_id;
              const detail = orderDetails[order.order_id];

              return (
                <div key={order.order_id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

                  {/* Order header row */}
                  <div
                    onClick={() => toggleExpand(order.order_id)}
                    style={{ display: 'flex', alignItems: 'center', padding: '18px 22px', cursor: 'pointer', gap: 16 }}
                  >
                    {/* Order icon */}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Package size={20} color="#6b7280" />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111', fontFamily: 'monospace' }}>
                          #{order.order_id.slice(0, 8).toUpperCase()}
                        </span>
                        <StatusBadge status={order.order_status} config={STATUS_CONFIG} />
                        <StatusBadge status={order.payment_status} config={PAYMENT_CONFIG} />
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(order.created_at)}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>{order.item_count} item{order.item_count !== '1' ? 's' : ''}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af', textTransform: 'capitalize' }}>
                          {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                        </span>
                      </div>
                    </div>

                    {/* Total + chevron */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>
                        ${parseFloat(order.total_price).toFixed(2)}
                      </p>
                      {isOpen ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '20px 22px' }}>
                      {loadingDetail === order.order_id ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                          <div style={{ width: 28, height: 28, border: '2px solid #e5e7eb', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        </div>
                      ) : detail ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                          {/* Items */}
                          <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Items Ordered</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {detail.items.map((item, i) => (
                                <div
                                  key={i}
                                  onClick={() => navigate(`/product/${item.product_id}`)}
                                  style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: 12, cursor: 'pointer' }}
                                >
                                  <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: '#e5e7eb', flexShrink: 0 }}>
                                    {imgSrc(item) ? (
                                      <img src={imgSrc(item)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : <Package size={20} color="#d1d5db" />}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{item.brand} · Qty: {item.quantity}</p>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: 0 }}>${parseFloat(item.subtotal).toFixed(2)}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0' }}>${parseFloat(item.price_per_unit).toFixed(2)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping address */}
                          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                              <MapPin size={14} color="#6b7280" />
                              <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Delivery Address</p>
                            </div>
                            {[
                              ['Name', detail.full_name],
                              ['Email', detail.email],
                              ['Phone', detail.phone],
                              ['Address', detail.address_line],
                              ['City', detail.city],
                              ['State', detail.state],
                              ['ZIP', detail.zip],
                              ['Country', detail.country],
                            ].map(([label, value]) => value ? (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                                <span style={{ color: '#9ca3af' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#111', textAlign: 'right', maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                              </div>
                            ) : null)}
                          </div>

                          {/* Payment summary */}
                          <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                              <CreditCard size={14} color="#6b7280" />
                              <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Payment</p>
                            </div>
                            {[
                              ['Method', detail.payment_method === 'cod' ? 'Cash on Delivery' : 'Card Payment'],
                              ['Status', <StatusBadge key="ps" status={detail.payment_status} config={PAYMENT_CONFIG} />],
                              ['Order Status', <StatusBadge key="os" status={detail.order_status} config={STATUS_CONFIG} />],
                              ['Total', `$${parseFloat(detail.total_price).toFixed(2)}`],
                            ].map(([label, value]) => (
                              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
                                <span style={{ color: '#9ca3af' }}>{label}</span>
                                <span style={{ fontWeight: 600, color: '#111' }}>{value}</span>
                              </div>
                            ))}
                          </div>

                        </div>
                      ) : null}
                    </div>
                  )}
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

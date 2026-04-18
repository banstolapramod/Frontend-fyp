import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function PaymentVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [status, setStatus] = useState('verifying'); // verifying | success | failed
  const [orderId, setOrderId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const pidx = searchParams.get('pidx');
    const purchase_order_id = searchParams.get('purchase_order_id');
    const txnStatus = searchParams.get('status'); // Khalti passes status in URL too

    // If Khalti says it failed/cancelled in the URL, no need to call backend
    if (txnStatus && txnStatus !== 'Completed') {
      setStatus('failed');
      setErrorMsg(`Payment ${txnStatus.toLowerCase()}. Please try again.`);
      return;
    }

    if (!pidx || !purchase_order_id) {
      setStatus('failed');
      setErrorMsg('Invalid payment callback. Missing parameters.');
      return;
    }

    verifyPayment(pidx, purchase_order_id);
  }, []);

  const verifyPayment = async (pidx, purchase_order_id) => {
    try {
      const userData = getUserData();
      if (!userData?.token) {
        navigate('/login');
        return;
      }

      const res = await fetch('http://localhost:5001/api/khalti/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pidx, purchase_order_id })
      });

      const data = await res.json();

      if (data.success) {
        setOrderId(data.order.order_id);
        setStatus('success');
        await fetchCart(); // clear cart in UI
      } else {
        setStatus('failed');
        setErrorMsg(data.error || 'Payment verification failed');
      }
    } catch (err) {
      setStatus('failed');
      setErrorMsg(err.message || 'Network error during verification');
    }
  };

  // ── Verifying ──
  if (status === 'verifying') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Loader size={36} color="#5C2D91" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
          <h1 style={headingStyle}>Verifying Payment...</h1>
          <p style={subStyle}>Please wait while we confirm your Khalti payment.</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Success ──
  if (status === 'success') {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h1 style={headingStyle}>Payment Successful!</h1>
          <p style={subStyle}>Your Khalti payment was confirmed and your order has been placed.</p>
          {orderId && (
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 28px' }}>
              Order ID: <span style={{ fontFamily: 'monospace', color: '#374151' }}>{orderId.slice(0, 8)}...</span>
            </p>
          )}
          <button
            onClick={() => navigate('/orders')}
            style={btnStyle('#111')}
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ ...btnStyle('transparent'), color: '#374151', border: '1px solid #e5e7eb', marginTop: 10 }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── Failed ──
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <XCircle size={40} color="#dc2626" />
        </div>
        <h1 style={headingStyle}>Payment Failed</h1>
        <p style={subStyle}>{errorMsg || 'Something went wrong with your payment.'}</p>
        <button onClick={() => navigate('/checkout')} style={btnStyle('#dc2626')}>
          Try Again
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ ...btnStyle('transparent'), color: '#374151', border: '1px solid #e5e7eb', marginTop: 10 }}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
};
const cardStyle = {
  background: '#fff', borderRadius: 24, padding: '48px 40px',
  maxWidth: 440, width: '100%', textAlign: 'center',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
};
const headingStyle = { fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 10px' };
const subStyle = { color: '#6b7280', fontSize: 15, margin: '0 0 24px' };
const btnStyle = (bg) => ({
  width: '100%', padding: '13px 0', background: bg, color: bg === 'transparent' ? '#374151' : '#fff',
  border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'block'
});

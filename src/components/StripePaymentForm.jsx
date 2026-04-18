import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, Loader } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#111827',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
  hidePostalCode: true,
};

export default function StripePaymentForm({ clientSecret, pendingOrderId, total, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError('');

    try {
      // Confirm card payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Tell our backend to create the order
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5001/api/stripe/confirm-order', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
            pending_order_id: pendingOrderId,
          }),
        });

        const data = await res.json();
        if (data.success) {
          onSuccess(data.order);
        } else {
          onError(data.error || 'Order confirmation failed');
        }
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Stripe Card Element */}
      <div style={{
        border: '1.5px solid #e5e7eb', borderRadius: 12, padding: '14px 16px',
        background: '#fff', marginBottom: 16
      }}>
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setCardError('')} />
      </div>

      {cardError && (
        <p style={{ fontSize: 13, color: '#ef4444', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          ⚠️ {cardError}
        </p>
      )}

      {/* Sandbox test hint */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontWeight: 600 }}>🧪 Sandbox Test Card</p>
        <p style={{ fontSize: 12, color: '#166534', margin: '4px 0 0' }}>
          Card: <span style={{ fontFamily: 'monospace' }}>4242 4242 4242 4242</span> &nbsp;|&nbsp;
          Expiry: any future date &nbsp;|&nbsp; CVC: any 3 digits
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%', padding: '14px 0',
          background: processing ? '#6b7280' : '#5469d4',
          color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 15, fontWeight: 600,
          cursor: processing ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}
      >
        {processing ? (
          <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
        ) : (
          <><Lock size={16} /> Pay ${total?.toFixed(2)} with Stripe</>
        )}
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

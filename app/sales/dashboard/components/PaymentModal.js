'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' }
    },
    invalid: { color: '#fa755a', iconColor: '#fa755a' }
  }
};

const ACTIVE_STAGE_ID = 84;

function PaymentForm({ client, onClose, onSuccess, isTestMode }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [setupFee, setSetupFee] = useState(client.setup_fee || 349);
  const [chargeSetupFee, setChargeSetupFee] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: { name: client.full_name, email: client.email, phone: client.phone }
      });

      if (cardError) throw new Error(cardError.message);

      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          paymentMethodId: paymentMethod.id,
          customerEmail: client.email,
          customerName: client.full_name,
          customerPhone: client.phone,
          businessName: client.name,
          planName: client.plan,
          planPrice: client.plan_price,
          setupFee: chargeSetupFee ? setupFee : 0,
          chargeSetupFee,
          salesRepEmail: client.sales_rep_email
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Payment failed');

      if (data.requiresAction) {
        const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);
        if (confirmError) throw new Error(confirmError.message);
      }

      // Move deal to Active in Pipedrive
      if (client.pipedrive_deal_id) {
        const dealId = client.pipedrive_deal_id.replace('/', '');
        await fetch('/api/pipedrive/update-deal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dealId, stageId: ACTIVE_STAGE_ID })
        });
      }

      // Trigger Make.com webhook for payment collected
      await fetch('https://hook.us2.make.com/hzdkq6s1ze5sp31jh14bvio2419imi8j', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          business_name: client.name,
          customer_name: client.full_name,
          email: client.email,
          phone: client.phone,
          plan: client.plan,
          plan_price: client.plan_price,
          setup_fee: chargeSetupFee ? setupFee : 0,
          sales_rep_email: client.sales_rep_email,
          pipedrive_deal_id: client.pipedrive_deal_id,
          stripe_customer_id: data.customerId,
          stripe_subscription_id: data.subscriptionId,
          status: 'Payment Collected',
          collected_at: new Date().toISOString()
        })
      });

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess(client.id, {
          customerId: data.customerId,
          subscriptionId: data.subscriptionId,
          setupFeePaid: chargeSetupFee
        });
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-black text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Subscription started for {client.name}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-gray-900">{client.name}</h4>
            <p className="text-sm text-gray-600">{client.full_name}</p>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">{client.plan}</div>
            <div className="text-2xl font-black text-gray-900">${client.plan_price}/mo</div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="chargeSetupFee"
              checked={chargeSetupFee}
              onChange={(e) => setChargeSetupFee(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded"
            />
            <label htmlFor="chargeSetupFee" className="font-bold text-gray-900">
              Charge Setup Fee
            </label>
          </div>
          {chargeSetupFee && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">$</span>
              <input
                type="number"
                value={setupFee}
                onChange={(e) => setSetupFee(Number(e.target.value))}
                className="w-24 px-3 py-2 border-2 border-yellow-300 rounded-lg font-bold text-center"
              />
            </div>
          )}
        </div>
        <p className="text-sm text-yellow-700">
          {chargeSetupFee ? `One-time setup fee of $${setupFee} will be charged today` : 'Setup fee waived'}
        </p>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-900 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          {chargeSetupFee && (
            <div className="flex justify-between">
              <span className="text-gray-600">Setup Fee (one-time)</span>
              <span className="font-bold">${setupFee}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">First Month ({client.plan})</span>
            <span className="font-bold">${client.plan_price}</span>
          </div>
          <div className="border-t border-green-300 pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold text-gray-900">Total Due Today</span>
              <span className="font-black text-green-600">
                ${(chargeSetupFee ? setupFee : 0) + client.plan_price}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-bold mb-2">Card Details</label>
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white text-xl font-bold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : `Charge $${(chargeSetupFee ? setupFee : 0) + client.plan_price} & Start Subscription`}
      </button>

      <p className="text-center text-sm text-gray-500">
        Client will be automatically billed ${client.plan_price}/month going forward
      </p>
    </form>
  );
}

export default function PaymentModal({ client, onClose, onSuccess }) {
  const [isTestMode, setIsTestMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await fetch('/api/settings/stripe-mode');
        const data = await res.json();
        setIsTestMode(data.testMode);
        const key = data.testMode 
          ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY 
          : process.env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY;
        setStripePromise(loadStripe(key));
      } catch (err) {
        setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY));
      } finally {
        setLoading(false);
      }
    };
    fetchMode();
  }, []);

  if (loading || !stripePromise) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {isTestMode && (
          <div className="bg-orange-500 text-white text-center py-2 font-bold text-sm">
            ⚠️ TEST MODE — No real charges will be made
          </div>
        )}
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-black text-gray-900">💳 Collect Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
        </div>
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <PaymentForm client={client} onClose={onClose} onSuccess={onSuccess} isTestMode={isTestMode} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { STRIPE_PRODUCTS } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export default function PlanSelectionModal({ client, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !client) return null;

  const proPlanDetails = [
    { name: 'Pro Plan 100', price: 250, priceIdMonthly: STRIPE_PRODUCTS.PRO_100_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_100_ANNUAL },
    { name: 'Pro Plan 200', price: 500, priceIdMonthly: STRIPE_PRODUCTS.PRO_200_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_200_ANNUAL },
    { name: 'Pro Plan 300', price: 750, priceIdMonthly: STRIPE_PRODUCTS.PRO_300_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_300_ANNUAL },
    { name: 'Pro Plan 400', price: 1000, priceIdMonthly: STRIPE_PRODUCTS.PRO_400_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_400_ANNUAL },
    { name: 'Pro Plan 500', price: 1250, priceIdMonthly: STRIPE_PRODUCTS.PRO_500_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_500_ANNUAL },
    { name: 'Pro Plan 600', price: 1500, priceIdMonthly: STRIPE_PRODUCTS.PRO_600_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_600_ANNUAL },
    { name: 'Pro Plan 700', price: 1750, priceIdMonthly: STRIPE_PRODUCTS.PRO_700_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_700_ANNUAL },
    { name: 'Pro Plan 800', price: 2000, priceIdMonthly: STRIPE_PRODUCTS.PRO_800_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_800_ANNUAL },
    { name: 'Pro Plan 900', price: 2250, priceIdMonthly: STRIPE_PRODUCTS.PRO_900_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_900_ANNUAL },
    { name: 'Pro Plan 1000', price: 2500, priceIdMonthly: STRIPE_PRODUCTS.PRO_1000_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_1000_ANNUAL },
    { name: 'Pro Plan 1100', price: 2750, priceIdMonthly: STRIPE_PRODUCTS.PRO_1100_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_1100_ANNUAL },
    { name: 'Pro Plan 1200', price: 3000, priceIdMonthly: STRIPE_PRODUCTS.PRO_1200_MONTHLY, priceIdAnnual: STRIPE_PRODUCTS.PRO_1200_ANNUAL },
  ];

  const handleSelectPlan = async (priceId, planName, planPrice, billingCycle) => {
    setLoading(true);

    try {
      // FIRST: Update client record in Supabase with Pro Plan details
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          plan_name: planName,
          plan_price: planPrice,
          billing_cycle: billingCycle,
        })
        .eq('id', client.id);

      if (updateError) {
        console.error('Error updating client plan:', updateError);
        alert('Error updating plan. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Updated client with plan:', planName, planPrice);

      // THEN: Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          clientEmail: client.email, 
          clientName: client.name,
          clientId: client.id
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Plan selection error:', error);
      alert('Error selecting plan. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900">Select Pro Plan</h3>
            <p className="text-gray-600 mt-1">{client.company_name} - {client.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {proPlanDetails.map((plan) => (
            <div key={plan.name} className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition">
              <h5 className="text-xl font-black text-blue-900 mb-2">{plan.name}</h5>
              <p className="text-2xl font-black text-gray-900 mb-4">${plan.price}/month</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectPlan(plan.priceIdMonthly, `${plan.name} - Monthly`, plan.price, 'monthly')}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold disabled:opacity-50 text-sm"
                >
                  ${plan.price}/mo
                </button>
                <button
                  onClick={() => handleSelectPlan(plan.priceIdAnnual, `${plan.name} - Annual`, plan.price * 11, 'annual')}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold disabled:opacity-50 text-sm"
                >
                  ${plan.price * 11}/yr (Save!)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
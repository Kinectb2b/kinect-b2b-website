'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';

const stripePromise = loadStripe('pk_test_51QhYNvB1XLx1C2PMeBTgPQWzNx9A65HAMhcDd0Q1Q4seDEvMCIpXy1taR2Ubyfm0lAXAC7tHBejv8Pui0Cw4AzXB00exZDWjlz');

export default function CheckoutButton({ 
  priceId, 
  clientEmail, 
  clientName, 
  clientPhone,
  companyName,
  industry,
  planName, 
  amount 
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    // Validate all fields
    if (!clientName || !clientEmail || !clientPhone || !companyName || !industry) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Extract price and billing cycle from planName and amount
      const billingCycle = planName.includes('Annual') ? 'annual' : 'monthly';
      const priceMatch = amount.match(/\$([0-9,]+)/);
      const planPrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '')) : 0;

      // Check if client already exists
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', clientEmail)
        .single();

      let clientId;

      if (existingClient) {
        // Client exists - update their record with new plan details
        const { data: updatedClient, error: updateError } = await supabase
          .from('clients')
          .update({
            plan_name: planName,
            plan_price: planPrice,
            billing_cycle: billingCycle,
          })
          .eq('id', existingClient.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating client:', updateError);
          alert('Error updating client data. Please try again.');
          setLoading(false);
          return;
        }

        clientId = existingClient.id;
        console.log('Updated existing client with plan details:', clientId);
      } else {
        // New client - create new record
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert([
            {
              name: clientName,
              email: clientEmail,
              phone: clientPhone,
              company_name: companyName,
              industry: industry,
              plan_name: planName,
              plan_price: planPrice,
              billing_cycle: billingCycle,
              status: 'pending',
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error('Supabase error:', createError);
          alert('Error saving client data. Please try again.');
          setLoading(false);
          return;
        }

        clientId = newClient.id;
        console.log('Created new client:', clientId);
      }

      // Create Stripe checkout session with client ID in metadata
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          clientEmail, 
          clientName,
          clientId: clientId
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Processing...' : `Continue to Payment - ${amount}`}
    </button>
  );
}
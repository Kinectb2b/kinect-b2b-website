import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getStripe() {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'stripe_test_mode')
    .single();
  
  const isTestMode = data?.value === 'true';
  return new Stripe(isTestMode ? process.env.STRIPE_TEST_SECRET_KEY : process.env.STRIPE_LIVE_SECRET_KEY);
}

export async function POST(request) {
  try {
    const stripe = await getStripe();
    
    const {
      clientId,
      paymentMethodId,
      customerEmail,
      customerName,
      customerPhone,
      businessName,
      planName,
      planPrice,
      setupFee,
      chargeSetupFee,
      salesRepEmail
    } = await request.json();

    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      phone: customerPhone,
      description: `Sales Rep: ${salesRepEmail}`,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
      metadata: {
        business_name: businessName,
        client_id: clientId,
        sales_rep_email: salesRepEmail
      }
    });

    if (chargeSetupFee && setupFee > 0) {
      await stripe.paymentIntents.create({
        amount: Math.round(setupFee * 100),
        currency: 'usd',
        customer: customer.id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        description: `Setup fee for ${businessName}`,
        metadata: {
          type: 'setup_fee',
          client_id: clientId,
          sales_rep_email: salesRepEmail
        }
      });
    }

    const products = await stripe.products.list({ limit: 100 });
    let product = products.data.find(p => p.name === planName);
    
    if (!product) {
      product = await stripe.products.create({
        name: planName,
        metadata: { plan_type: 'monthly' }
      });
    }

    const prices = await stripe.prices.list({ product: product.id, limit: 100 });
    let price = prices.data.find(p => 
      p.unit_amount === Math.round(planPrice * 100) && 
      p.recurring?.interval === 'month'
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(planPrice * 100),
        currency: 'usd',
        recurring: { interval: 'month' }
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      default_payment_method: paymentMethodId,
      metadata: {
        client_id: clientId,
        business_name: businessName,
        sales_rep_email: salesRepEmail
      }
    });

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      subscriptionId: subscription.id,
      setupFeePaid: chargeSetupFee && setupFee > 0
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

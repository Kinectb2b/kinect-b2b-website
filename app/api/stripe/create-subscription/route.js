import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const {
      clientId,
      paymentMethodId,
      customerEmail,
      customerName,
      businessName,
      planName,
      planPrice,
      setupFee,
      chargeSetupFee
    } = await request.json();

    // 1. Create Stripe Customer
    const customer = await stripe.customers.create({
      email: customerEmail,
      name: customerName,
      metadata: {
        businessName,
        clientId,
        planName
      },
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // 2. Charge setup fee as one-time payment (if applicable)
    if (chargeSetupFee && setupFee > 0) {
      await stripe.paymentIntents.create({
        amount: Math.round(setupFee * 100),
        currency: 'usd',
        customer: customer.id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        description: `Setup Fee - ${businessName}`,
        metadata: {
          type: 'setup_fee',
          clientId,
          businessName
        }
      });
    }

    // 3. Create or get price for the subscription
    let priceId;
    
    const existingPrices = await stripe.prices.list({
      lookup_keys: [`${planName.toLowerCase().replace(/\s+/g, '_')}_monthly`],
      limit: 1
    });

    if (existingPrices.data.length > 0) {
      priceId = existingPrices.data[0].id;
    } else {
      const product = await stripe.products.create({
        name: planName,
        metadata: { planName }
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(planPrice * 100),
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        lookup_key: `${planName.toLowerCase().replace(/\s+/g, '_')}_monthly`
      });

      priceId = price.id;
    }

    // 4. Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      metadata: {
        clientId,
        businessName,
        planName
      },
      expand: ['latest_invoice.payment_intent']
    });

    const invoice = subscription.latest_invoice;
    const paymentIntent = invoice?.payment_intent;

    if (paymentIntent?.status === 'requires_action') {
      return NextResponse.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
        subscriptionId: subscription.id
      });
    }

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      subscriptionId: subscription.id,
      status: subscription.status
    });

  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req) {
  try {
    const { priceId, clientEmail, clientName, clientId } = await req.json();

    // Determine mode and payment type
    const isSetupCall = priceId === 'price_1Qhe6SB1XLx1C2PMBI5TXb7J';
    const isProPlan = !isSetupCall;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: isSetupCall ? 'payment' : 'subscription',
      success_url: `http://localhost:3000/sales/dashboard?success=true`,
      cancel_url: `http://localhost:3000/sales/dashboard?canceled=true`,
      customer_email: clientEmail,
      metadata: {
        clientName: clientName,
        clientId: clientId,
        isSetupCall: isSetupCall.toString(),
        isProPlan: isProPlan.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
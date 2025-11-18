import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      'whsec_1e537cad3b19c919e4e3546eb8f7a1fb9c44187cc654e1c16b402dc45afb5674'
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Get client ID and payment type from metadata
      const clientId = session.metadata.clientId;
      const isSetupCall = session.metadata.isSetupCall === 'true';
      const isProPlan = session.metadata.isProPlan === 'true';
      
      if (clientId) {
        if (isSetupCall) {
          // Setup call paid - update status to "needs_plan" but DON'T overwrite plan details
          const { error } = await supabase
            .from('clients')
            .update({
              status: 'needs_plan',
              stripe_customer_id: session.customer,
              stripe_payment_intent_id: session.payment_intent,
              setup_call_completed: true,
            })
            .eq('id', clientId);

          if (error) {
            console.error('Error updating client after setup call:', error);
          } else {
            console.log('Setup call completed - client needs to select plan:', clientId);
          }
        } else if (isProPlan) {
          // Pro plan paid - ONLY update status and stripe IDs, keep existing plan details
          const { error } = await supabase
            .from('clients')
            .update({
              status: 'active',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
            })
            .eq('id', clientId);

          if (error) {
            console.error('Error activating client:', error);
          } else {
            console.log('Client activated:', clientId);
          }
        }
      }
      break;

    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const subscription = event.data.object;
      
      const { error: cancelError } = await supabase
        .from('clients')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);

      if (cancelError) {
        console.error('Error cancelling client:', cancelError);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
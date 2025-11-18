import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const body = await request.json();

    const { data, error } = await supabase
      .from('active_clients')
      .insert([
        {
          name: body.business_name,
          full_name: body.full_name,
          phone: body.phone,
          email: body.email,
          plan: body.selected_plan,
          payment_type: body.payment_type,
          industry: body.industry,
          plan_price: body.plan_price,
          setup_fee: body.setup_fee,
          status: 'New Client - Ready to Set Up',
          setup_checklist: {
            setup_fee_billed: false,
            plan_billing_set_up: false,
            onboarding_call_scheduled: false,
            crm_access_granted: false,
            welcome_email_sent: false
          },
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
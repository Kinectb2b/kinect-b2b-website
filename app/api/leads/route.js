import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const body = await request.json();

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: body.name || body.full_name,
          business_name: body.business_name,
          phone: body.phone,
          email: body.email,
          industry: body.industry || null,
          budget: body.budget || null,
          selected_plan: body.selected_plan || null,
          questions: body.questions || null,
          source: body.source || body.lead_type || 'website',
          status: body.status || 'new',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

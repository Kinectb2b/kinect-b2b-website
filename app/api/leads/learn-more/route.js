import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { business_name, name, phone, email, city, state, industry, questions, selected_plan, referral_code } = body;

    // Validate required fields
    if (!name || !phone || !email || !selected_plan) {
      return NextResponse.json(
        { error: 'Name, phone, email, and selected plan are required' },
        { status: 400 }
      );
    }

    // Insert lead into database
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          source: 'learn_more',
          business_name,
          name,
          phone,
          email,
          city,
          state,
          industry,
          questions,
          selected_plan,
          referral_code,
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead saved successfully',
        lead: data[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
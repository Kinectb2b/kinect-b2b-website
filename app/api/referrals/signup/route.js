import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.business_name || !data.name || !data.email || !data.phone || !data.referral_code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the affiliate by referral code
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('referral_code', data.referral_code)
      .single();

    if (affiliateError || !affiliate) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Prepare referral data for Supabase
    const referralData = {
      affiliate_id: affiliate.id,
      client_name: data.name,
      business_name: data.business_name,
      email: data.email,
      phone: data.phone,
      city: data.city || '',
      state: data.state || '',
      industry: data.industry || '',
      interested_in: data.interested_in || '',
      referral_code: data.referral_code,
      status: 'pending', // pending, active, inactive
      signup_date: new Date().toISOString(),
      monthly_value: 0, // Will be updated when they choose a plan
      commission_earned: 0, // Will be calculated based on monthly_value
      created_at: new Date().toISOString(),
    };

    // Insert into referrals table
    const { data: insertedData, error } = await supabase
      .from('referrals')
      .insert([referralData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save referral', details: error.message },
        { status: 500 }
      );
    }

    // Update affiliate's total_referrals count
    const { error: updateError } = await supabase.rpc('increment_referral_count', {
      affiliate_uuid: affiliate.id
    });

    if (updateError) {
      console.error('Error updating affiliate count:', updateError);
      // Don't fail the request if count update fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Referral saved successfully',
        data: insertedData 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
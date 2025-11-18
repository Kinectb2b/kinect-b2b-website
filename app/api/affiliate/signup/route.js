import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

function generateReferralCode(name) {
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}

export async function POST(request) {
  try {
    const { full_name, email, phone, company_name, website, password } = await request.json();

    // Validate password
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('affiliates')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const referral_code = generateReferralCode(full_name);

    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .insert([
        {
          full_name,
          email,
          phone,
          company_name,
          website,
          referral_code,
          password: password, // Use the user's password
          username: email,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      affiliate,
      message: 'Account created successfully!'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
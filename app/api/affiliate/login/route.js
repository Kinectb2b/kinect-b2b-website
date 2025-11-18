import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Query affiliate by email and password - MUST include role
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !affiliate) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Determine session length based on rememberMe
    const expirationTime = rememberMe ? '30d' : '7d';
    const maxAge = rememberMe 
      ? 60 * 60 * 24 * 30  // 30 days
      : 60 * 60 * 24 * 7;   // 7 days (default)

    // Create a JWT token with role included
    const token = await new SignJWT({ 
      affiliateId: affiliate.id,
      email: affiliate.email,
      role: affiliate.role || 'affiliate'  // Include role in token
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(expirationTime)
      .sign(SECRET_KEY);

    const response = NextResponse.json({ 
      success: true, 
      affiliate 
    });

    // Set HTTP-only cookie with dynamic maxAge
    response.cookies.set('affiliate_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
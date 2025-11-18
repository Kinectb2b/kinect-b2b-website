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
    const { username, password, rememberMe } = await request.json();

    // Query sales user by username and password
    const { data: salesUser, error } = await supabase
      .from('sales_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !salesUser) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Determine session length based on rememberMe
    const expirationTime = rememberMe ? '30d' : '7d';
    const maxAge = rememberMe 
      ? 60 * 60 * 24 * 30  // 30 days
      : 60 * 60 * 24 * 7;   // 7 days (default)

    // Create a JWT token
    const token = await new SignJWT({ 
      salesUserId: salesUser.id,
      username: salesUser.username,
      role: salesUser.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(expirationTime)
      .sign(SECRET_KEY);

    const response = NextResponse.json({ 
      success: true, 
      salesUser 
    });

    // Set HTTP-only cookie with dynamic maxAge
    response.cookies.set('sales_session', token, {
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
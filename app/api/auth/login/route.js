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
    const { username, password } = await request.json();

    // Query client by username and password
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !client) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = await new SignJWT({ 
      clientId: client.id,
      username: client.username 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const response = NextResponse.json({ 
      success: true, 
      client 
    });

    // Set HTTP-only cookie
    response.cookies.set('client_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
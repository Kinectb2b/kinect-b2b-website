import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';

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

    const { data: admin, error } = await supabase
      .from('master_admins')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 401 });
    }

    const token = await new SignJWT({ 
      role: 'master_admin',
      adminId: admin.id,
      username: admin.username
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY);

    const response = NextResponse.json({ 
      success: true,
      message: 'Login successful'
    });

    response.cookies.set('master_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Master admin login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}

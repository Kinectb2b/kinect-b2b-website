import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export async function POST(request) {
  try {
    // Check for portal_session cookie (main portal auth)
    const token = request.cookies.get('portal_session')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No session found'
      }, { status: 401 });
    }

    let payload;
    try {
      // Verify the JWT token
      const verified = await jwtVerify(token, SECRET_KEY);
      payload = verified.payload;
    } catch (jwtError) {
      // Token is expired or invalid
      console.error('JWT verification failed:', jwtError.message);
      return NextResponse.json({
        success: false,
        error: 'Session expired. Please log in again.'
      }, { status: 401 });
    }

    // Verify user still exists and is active
    const { data: user, error } = await supabase
      .from('portal_users')
      .select('*')
      .eq('id', payload.userId)
      .eq('status', 'active')
      .single();

    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: 'User not found or inactive'
      }, { status: 401 });
    }

    // Get fresh user features
    const { data: userFeatures } = await supabase
      .from('user_features')
      .select('feature_key, enabled')
      .eq('user_id', user.id);

    let orgFeatures = [];
    if (user.organization_id) {
      const { data: features } = await supabase
        .from('organization_features')
        .select('feature_key, enabled')
        .eq('organization_id', user.organization_id);
      orgFeatures = features || [];
    }

    let allFeatures = [];
    if (user.role === 'master_admin') {
      const { data: features } = await supabase
        .from('features')
        .select('key');
      allFeatures = features?.map(f => f.key) || [];
    }

    const enabledFeatures = user.role === 'master_admin'
      ? allFeatures
      : [...orgFeatures, ...(userFeatures || [])]
          .filter(f => f.enabled)
          .map(f => f.feature_key);

    // Create a fresh JWT token with renewed expiration
    const newToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
      features: enabledFeatures
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id
      },
      features: enabledFeatures
    });

    // Set the refreshed HTTP-only cookie
    response.cookies.set('portal_session', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Auth refresh error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh session'
    }, { status: 500 });
  }
}

// Also support GET for simpler health checks
export async function GET(request) {
  return POST(request);
}

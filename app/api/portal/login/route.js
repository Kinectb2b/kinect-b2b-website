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
    const { email, password } = await request.json();

    // Query portal_users table
    const { data: user, error } = await supabase
      .from('portal_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .eq('status', 'active')
      .single();

    if (error || !user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Get user's enabled features
    const { data: userFeatures } = await supabase
      .from('user_features')
      .select('feature_key, enabled')
      .eq('user_id', user.id);

    // Get organization features if user belongs to an org
    let orgFeatures = [];
    if (user.organization_id) {
      const { data: features } = await supabase
        .from('organization_features')
        .select('feature_key, enabled')
        .eq('organization_id', user.organization_id);
      orgFeatures = features || [];
    }

    // For master_admin, get all features
    let allFeatures = [];
    if (user.role === 'master_admin') {
      const { data: features } = await supabase
        .from('features')
        .select('key');
      allFeatures = features?.map(f => f.key) || [];
    }

    // Build features object
    const enabledFeatures = user.role === 'master_admin' 
      ? allFeatures 
      : [...orgFeatures, ...(userFeatures || [])]
          .filter(f => f.enabled)
          .map(f => f.feature_key);

    // Update last login
    await supabase
      .from('portal_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Create JWT token
    const token = await new SignJWT({ 
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

    // Set HTTP-only cookie
    response.cookies.set('portal_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Portal login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}
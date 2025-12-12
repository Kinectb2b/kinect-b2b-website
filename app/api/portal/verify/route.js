import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export async function GET(request) {
  try {
    const token = request.cookies.get('portal_session')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        error: 'No session found'
      }, { status: 401 });
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Get fresh user data
    const { data: user, error } = await supabase
      .from('portal_users')
      .select('*')
      .eq('id', payload.userId)
      .eq('status', 'active')
      .single();

    if (error || !user) {
      return NextResponse.json({
        authenticated: false,
        error: 'User not found or inactive'
      }, { status: 401 });
    }

    // Get user's enabled features (fresh from DB)
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

    // Build features array
    const enabledFeatures = user.role === 'master_admin' 
      ? allFeatures 
      : [...orgFeatures, ...(userFeatures || [])]
          .filter(f => f.enabled)
          .map(f => f.feature_key);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id,
        avatarUrl: user.avatar_url
      },
      features: enabledFeatures
    });
  } catch (error) {
    console.error('Portal verification error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Invalid or expired session'
    }, { status: 401 });
  }
}
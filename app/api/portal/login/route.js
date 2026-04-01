import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Use service_role key for server-side operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwwfwrzcbjadqpyuneis.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

// Hash refresh token for secure storage
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log('Login attempt for:', email);

    // Query portal_users table (without password comparison - do that separately with bcrypt)
    const { data: user, error } = await supabase
      .from('portal_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'active')
      .single();

    console.log('User found:', !!user, 'Error:', error?.message);

    if (error || !user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Verify password with bcrypt
    console.log('Comparing password...');
    const passwordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', passwordValid);

    if (!passwordValid) {
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

    // Create JWT access token (short-lived: 1 hour)
    const accessToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
      features: enabledFeatures
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    // Generate refresh token (opaque, long-lived)
    const refreshToken = crypto.randomUUID() + crypto.randomUUID();
    const refreshTokenHash = hashToken(refreshToken);
    const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Revoke any existing refresh tokens for this user (optional: allows only one active session)
    // Uncomment the next line if you want single-session enforcement:
    // await supabase.from('refresh_tokens').delete().eq('user_id', user.id);

    // Store refresh token hash in database
    // Generate a family_id for token rotation tracking
    const familyId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token_hash: refreshTokenHash,
        family_id: familyId,
        expires_at: refreshExpiresAt.toISOString()
      });

    if (insertError) {
      console.error('Failed to store refresh token:', insertError);
      // Continue anyway - user can still use the session, just won't get refresh
    }

    // Calculate token expiry for client-side refresh scheduling
    const tokenExpiresAt = Date.now() + (60 * 60 * 1000); // 1 hour from now

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
      features: enabledFeatures,
      tokenExpiresAt // Client stores this to schedule refresh
    });

    // Set access token cookie (1 hour)
    response.cookies.set('portal_session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });

    // Set refresh token cookie (30 days)
    response.cookies.set('portal_refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
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

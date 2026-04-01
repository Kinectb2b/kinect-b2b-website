import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service_role key for server-side operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uwwfwrzcbjadqpyuneis.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

// Hash refresh token for lookup
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Helper to clear auth cookies
function clearAuthCookies(response) {
  response.cookies.set('portal_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  response.cookies.set('portal_refresh', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  return response;
}

export async function POST(request) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('portal_refresh')?.value;

    if (!refreshToken) {
      console.log('Auth refresh: No refresh token provided');
      const response = NextResponse.json({
        success: false,
        error: 'No refresh token'
      }, { status: 401 });
      return clearAuthCookies(response);
    }

    // Hash the token and look it up in the database
    const tokenHash = hashToken(refreshToken);

    const { data: tokenRecord, error: lookupError } = await supabase
      .from('refresh_tokens')
      .select('*, portal_users(*)')
      .eq('token_hash', tokenHash)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (lookupError || !tokenRecord) {
      console.log('Auth refresh: Invalid or expired refresh token');
      const response = NextResponse.json({
        success: false,
        error: 'Invalid or expired refresh token'
      }, { status: 401 });
      return clearAuthCookies(response);
    }

    const user = tokenRecord.portal_users;

    if (!user || user.status !== 'active') {
      console.log('Auth refresh: User not found or inactive');
      // Revoke the token
      await supabase
        .from('refresh_tokens')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', tokenRecord.id);

      const response = NextResponse.json({
        success: false,
        error: 'User not found or inactive'
      }, { status: 401 });
      return clearAuthCookies(response);
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

    // Create new JWT access token
    const newAccessToken = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organization_id,
      features: enabledFeatures
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    // Rotate refresh token (generate new one, revoke old one)
    const newRefreshToken = crypto.randomUUID() + crypto.randomUUID();
    const newRefreshTokenHash = hashToken(newRefreshToken);
    const newRefreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Revoke old token and insert new one in a transaction-like manner
    await supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', tokenRecord.id);

    await supabase
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token_hash: newRefreshTokenHash,
        family_id: tokenRecord.family_id, // Keep same family for rotation tracking
        expires_at: newRefreshExpiresAt.toISOString()
      });

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

    // Set new access token cookie
    response.cookies.set('portal_session', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/'
    });

    // Set new refresh token cookie
    response.cookies.set('portal_refresh', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    console.log('Auth refresh: Success for user', user.email);
    return response;

  } catch (error) {
    console.error('Auth refresh error:', error);
    const response = NextResponse.json({
      success: false,
      error: 'Refresh failed'
    }, { status: 500 });
    return clearAuthCookies(response);
  }
}

// Support GET for health checks
export async function GET(request) {
  return NextResponse.json({
    status: 'ok',
    message: 'Use POST with portal_refresh cookie to refresh session'
  });
}

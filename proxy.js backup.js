import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Get the session tokens from cookies
  const affiliateToken = request.cookies.get('affiliate_session')?.value;
  const salesToken = request.cookies.get('sales_session')?.value;
  const clientToken = request.cookies.get('client_session')?.value;
  const adminToken = request.cookies.get('admin_session')?.value;

  console.log('=== PROXY DEBUG ===');
  console.log('Pathname:', pathname);
  console.log('Affiliate Token:', affiliateToken ? 'EXISTS' : 'MISSING');
  console.log('==================');

  // Protect affiliate ADMIN routes - requires role check
  if (pathname.startsWith('/affiliate/admin')) {
    if (!affiliateToken) {
      return NextResponse.redirect(new URL('/affiliate/login', request.url));
    }

    // Verify token and check role
    try {
      const { payload } = await jwtVerify(affiliateToken, SECRET_KEY);
      
      // Check if user has admin role
      if (payload.role !== 'admin') {
        // Not an admin, redirect to regular affiliate dashboard
        return NextResponse.redirect(new URL('/affiliate/dashboard', request.url));
      }
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/affiliate/login', request.url));
    }
  }

  // Protect affiliate routes (regular affiliates)
  if (pathname.startsWith('/affiliate/dashboard') || 
      pathname.startsWith('/affiliate/profile') ||
      pathname.startsWith('/affiliate/payouts')) {
    if (!affiliateToken) {
      console.log('REDIRECT: No affiliate token, sending to login');
      return NextResponse.redirect(new URL('/affiliate/login', request.url));
    }
    console.log('ALLOW: Affiliate token exists');
  }

  // Protect sales routes
  if (pathname.startsWith('/sales/dashboard')) {
    if (!salesToken) {
      return NextResponse.redirect(new URL('/sales', request.url));
    }
  }

  // Protect client portal routes
  if (pathname.startsWith('/portal/dashboard')) {
    if (!clientToken) {
      return NextResponse.redirect(new URL('/portal/login', request.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/affiliate/dashboard/:path*',
    '/affiliate/profile/:path*',
    '/affiliate/payouts/:path*',
    '/affiliate/admin/:path*',
    '/sales/dashboard/:path*',
    '/portal/dashboard/:path*',
    '/admin/:path*'
  ]
};
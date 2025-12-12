import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production'
);

export async function GET(request) {
  try {
    const token = request.cookies.get('master_admin_session')?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        error: 'No session found'
      }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, SECRET_KEY);

    if (payload.role !== 'master_admin') {
      return NextResponse.json({
        authenticated: false,
        error: 'Not authorized'
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      username: payload.username
    });
  } catch (error) {
    console.error('Master admin verification error:', error);
    return NextResponse.json({
      authenticated: false,
      error: 'Invalid or expired session'
    }, { status: 401 });
  }
}

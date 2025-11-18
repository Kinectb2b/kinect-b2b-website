import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ success: true });
  
  // Delete the session cookie
  response.cookies.delete('affiliate_session');
  
  return response;
}
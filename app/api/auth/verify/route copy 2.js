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
    const token = request.cookies.get('client_session')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'No session found' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Get client data from database
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', payload.clientId)
      .single();

    if (error || !client) {
      return NextResponse.json(
        { authenticated: false, error: 'Client not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      client
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Invalid session' },
      { status: 401 }
    );
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Query the client_portal_admins table
    const { data: admin, error } = await supabase
      .from('client_portal_admins')
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

    // Successful login
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Query the sales_users table for admin role
    const { data: admin, error } = await supabase
      .from('sales_users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .eq('role', 'admin')
      .single();

    if (error || !admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials or not an admin'
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
    console.error('Sales admin login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}
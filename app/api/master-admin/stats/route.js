import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    // Get total clients count
    const { count: clientCount, error: clientError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (clientError) throw clientError;

    // Get total affiliates count
    const { count: affiliateCount, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*', { count: 'exact', head: true });

    if (affiliateError) throw affiliateError;

    // Get active deals/appointments count
    const { count: appointmentCount, error: appointmentError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled');

    // Get pending referrals count
    const { count: referralCount, error: referralError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Calculate monthly revenue (sum of all active client monthly values)
    const { data: revenueData, error: revenueError } = await supabase
      .from('clients')
      .select('monthly_value')
      .eq('status', 'active');

    let monthlyRevenue = 0;
    if (revenueData) {
      monthlyRevenue = revenueData.reduce((sum, client) => sum + (client.monthly_value || 0), 0);
    }

    return NextResponse.json({
      totalClients: clientCount || 0,
      totalAffiliates: affiliateCount || 0,
      totalSalesReps: 3, // Hardcoded for now - update if you have a sales_reps table
      monthlyRevenue: monthlyRevenue,
      activeDeals: appointmentCount || 0,
      pendingReferrals: referralCount || 0
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
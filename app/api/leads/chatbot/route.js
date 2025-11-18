import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare questions field with all chatbot data
    const questionsData = `Service: ${data.selectedService || 'Not specified'}
Budget: ${data.budget || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}
Challenge: ${data.painPoint || 'Not specified'}`;

    // Prepare lead data matching exact Supabase columns
    const leadData = {
      business_name: data.businessName || '',
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city || '',
      state: data.state || '',
      industry: data.industry || '',
      questions: questionsData,
      selected_plan: data.selectedService || '',
      source: 'chatbot',
      lead_source: 'Chatbot',
      referral_code: data.referral_code || null,
      status: 'new'
    };

    // Insert into leads table
    const { data: insertedData, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save lead', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead saved successfully',
        data: insertedData 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
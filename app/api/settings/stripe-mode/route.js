import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'stripe_test_mode')
      .single();

    if (error) throw error;

    return NextResponse.json({ testMode: data.value === 'true' });
  } catch (error) {
    return NextResponse.json({ testMode: true });
  }
}

export async function POST(request) {
  try {
    const { testMode } = await request.json();

    const { error } = await supabase
      .from('settings')
      .update({ value: testMode ? 'true' : 'false', updated_at: new Date().toISOString() })
      .eq('key', 'stripe_test_mode');

    if (error) throw error;

    return NextResponse.json({ success: true, testMode });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

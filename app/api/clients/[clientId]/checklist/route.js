import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { clientId } = params;
    const body = await request.json();
    const { field, value } = body;

    // Get current client data
    const { data: currentClient, error: fetchError } = await supabase
      .from('active_clients')
      .select('setup_checklist')
      .eq('id', clientId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Update the specific field in the checklist
    const updatedChecklist = {
      ...currentClient.setup_checklist,
      [field]: value
    };

    // Check if all items are complete
    const allComplete = Object.values(updatedChecklist).every(v => v === true);

    // Update the client
    const updateData = {
      setup_checklist: updatedChecklist,
      last_updated: new Date().toISOString()
    };

    // If all items complete, change status to Active
    if (allComplete) {
      updateData.status = 'Active';
    }

    const { data, error } = await supabase
      .from('active_clients')
      .update(updateData)
      .eq('id', clientId)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, allComplete });
    } catch (error) {
    console.error('Error updating checklist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
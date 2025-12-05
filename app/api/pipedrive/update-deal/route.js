import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { dealId, stageId } = await request.json();

    // Your Pipedrive API token
    const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;

    const response = await fetch(
      `https://api.pipedrive.com/v1/deals/${dealId}?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: stageId })
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update deal');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pipedrive error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
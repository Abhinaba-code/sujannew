import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request) {
  try {
    const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata', {
      cache: 'no-store', // Ensure we always get the latest time
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from WorldTimeAPI: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { key } = await request.json();
    if (key === process.env.ADMIN_API_KEY) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Invalid key' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

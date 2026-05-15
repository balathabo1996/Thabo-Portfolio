import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { key } = await request.json();
    if (key === process.env.ADMIN_API_KEY) {
      const token = await signToken({ admin: true });
      return NextResponse.json({ success: true, token });
    }
    return NextResponse.json({ success: false, error: 'Invalid passphrase' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

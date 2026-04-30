import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Experience from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    await connectToDatabase();
    const experiences = await Experience.find().sort({ order: 1 }).lean();
    return NextResponse.json(experiences);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

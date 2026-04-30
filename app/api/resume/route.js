import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Resume from '@/lib/models/Resume';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resume = await Resume.create({
      name: file.name,
      data: buffer,
      contentType: file.type || 'application/pdf',
      uploadDate: new Date(),
    });

    return NextResponse.json({ 
      message: 'Resume uploaded successfully',
      id: resume._id,
      name: resume.name
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

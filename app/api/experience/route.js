import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Experience from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const query = showAll ? {} : { status: { $ne: 'draft' } };
    const experiences = await Experience.find(query).sort({ order: 1 }).lean();
    return NextResponse.json(experiences);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
    }

    const experience = await Experience.findByIdAndUpdate(_id, updateData, { returnDocument: 'after' });
    return NextResponse.json(experience);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Experience ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Experience.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Experience deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PATCH(request) {
  try {
    await connectToDatabase();
    const { items } = await request.json(); // Array of { _id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array required' }, { status: 400 });
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await Experience.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

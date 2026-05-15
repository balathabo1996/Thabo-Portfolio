import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return NextResponse.json(skills);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const skill = await Skill.create(data);
    return NextResponse.json(skill, { status: 201 });
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
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    const skill = await Skill.findByIdAndUpdate(_id, updateData, { returnDocument: 'after' });
    return NextResponse.json(skill);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Skill ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Skill deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

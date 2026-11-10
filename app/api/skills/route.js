/**
 * Skills Administrative REST Endpoint — app/api/skills/route.js
 * ==============================================================
 * Exposes full CRUD interfaces (GET, POST, PUT, DELETE) and batch operations
 * (PATCH) for technical capability categories and specific items.
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

export const dynamic = 'force-dynamic';

/**
 * GET /api/skills
 * Fetches all skills ordered numerically.
 *
 * @returns {NextResponse} The JSON list of technical skills
 */
export async function GET() {
  try {
    await connectToDatabase();
    const skills = await Skill.find().sort({ order: 1 }).lean();
    return NextResponse.json(skills);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/skills
 * Registers a new skill document.
 *
 * @param {Request} request - Next.js Request containing JSON payload for the skill
 * @returns {NextResponse} The JSON created skill document
 */
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

/**
 * PUT /api/skills
 * Modifies an existing skill record by MongoDB object ID.
 *
 * @param {Request} request - Next.js Request containing update payload and _id
 * @returns {NextResponse} The JSON updated skill document
 */
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

/**
 * DELETE /api/skills
 * Deletes a skill by query parameter ID.
 *
 * @param {Request} request - Next.js Request with searchParams containing the target ID
 * @returns {NextResponse} The JSON transaction status message
 */
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

/**
 * PATCH /api/skills
 * Coordinates bulk reordering update operations in a single Mongoose transaction.
 *
 * @param {Request} request - Next.js Request with items order array
 * @returns {NextResponse} The JSON status confirmation
 */
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

    await Skill.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

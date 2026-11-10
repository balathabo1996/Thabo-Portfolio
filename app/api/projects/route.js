/**
 * Projects Administrative REST Endpoint — app/api/projects/route.js
 * ================================================================
 * Facilitates administrative CRUD operations (GET, POST, PUT, DELETE) and bulk reordering (PATCH)
 * for project entries displayed inside the portfolio showcase.
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export const dynamic = 'force-dynamic';

/**
 * GET /api/projects
 * Fetches project documents. Filters out drafts by default.
 *
 * @param {Request} request - Next.js Request with searchParams containing dynamic queries
 * @returns {NextResponse} The JSON list of project showcases
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const query = showAll ? {} : { status: { $ne: 'draft' } };
    const projects = await Project.find(query).sort({ order: 1 }).lean();
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/projects
 * Registers a new project document in MongoDB.
 *
 * @param {Request} request - Next.js Request containing JSON payload for the project
 * @returns {NextResponse} The JSON created project document
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/projects
 * Modifies an existing project record by MongoDB Object ID.
 *
 * @param {Request} request - Next.js Request containing update payload and _id
 * @returns {NextResponse} The JSON updated project document
 */
export async function PUT(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const project = await Project.findByIdAndUpdate(_id, updateData, { returnDocument: 'after' });
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/projects
 * Deletes a project document by query parameter ID.
 *
 * @param {Request} request - Next.js Request containing target search parameter ID
 * @returns {NextResponse} The JSON transaction status message
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    await connectToDatabase();
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Project deleted' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/projects
 * Manages bulk display reordering updates for projects in MongoDB.
 *
 * @param {Request} request - Next.js Request containing projects ordering indexes array
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

    await Project.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

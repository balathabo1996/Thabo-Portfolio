/**
 * Experience API Endpoint — app/api/experience/route.js
 * ========================================================
 * Facilitates CRUD operations for professional work, educational achievements,
 * publications, and volunteer roles.
 * Includes support for bulk PATCH sorting order overrides (drag-and-drop support).
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Experience from '@/lib/models/Experience';

// Force dynamic execution to bypass Vercel static rendering caches
export const dynamic = 'force-dynamic';

/**
 * GET /api/experience
 * Fetches all experience items, optionally including draft entries.
 *
 * @param {Request} request - Next.js Request object
 * @returns {Promise<NextResponse>} JSON response containing experience objects list
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    
    // Filter out draft status unless explicitly requested by the administrative frontend
    const query = showAll ? {} : { status: { $ne: 'draft' } };
    
    const experiences = await Experience.find(query).sort({ order: 1 }).lean();
    return NextResponse.json(experiences);
  } catch (err) {
    console.error('Fetch experience error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/experience
 * Adds a new experience entry. Required auth: x-api-key.
 *
 * @param {Request} request - Next.js Request object containing experience fields in JSON body
 * @returns {Promise<NextResponse>} JSON response of the newly created Experience document
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    console.error('Create experience error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/experience
 * Updates an existing experience entry. Required auth: x-api-key.
 *
 * @param {Request} request - Next.js Request object with the updated details and the target '_id'
 * @returns {Promise<NextResponse>} JSON response containing the updated Experience document
 */
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
    console.error('Update experience error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/experience
 * Deletes an experience document by ID. Required auth: x-api-key.
 *
 * @param {Request} request - Next.js Request object containing the 'id' parameter in search query
 * @returns {Promise<NextResponse>} JSON success/error receipt
 */
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
    console.error('Delete experience error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * PATCH /api/experience
 * Bulk updates the 'order' field on multiple experience items (supporting drag-and-drop sort order synchronization).
 * Required auth: x-api-key.
 *
 * @param {Request} request - Next.js Request object containing an array of { _id, order }
 * @returns {Promise<NextResponse>} JSON success confirmation
 */
export async function PATCH(request) {
  try {
    await connectToDatabase();
    const { items } = await request.json(); // Array of { _id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array required' }, { status: 400 });
    }

    // Prepare list of bulk updates
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    await Experience.bulkWrite(bulkOps);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Bulk experience sort error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

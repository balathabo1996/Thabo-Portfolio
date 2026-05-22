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
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Fetch all skill items
 *     description: Returns the full list of skill entries sorted by their display order.
 *     responses:
 *       200:
 *         description: List of skill items.
 *       500:
 *         description: Database retrieval error.
 */

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
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create a new skill
 *     description: Registers a new skill item in the database.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [infra, virt, prog, db, sec, soft]
 *               icon:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [published, draft]
 *     responses:
 *       201:
 *         description: Skill created successfully.
 *       500:
 *         description: Server error during creation.
 */

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
 * @swagger
 * /api/skills:
 *   put:
 *     summary: Update an existing skill
 *     description: Updates an existing skill document matching the provided database ID.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               icon:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Skill updated successfully.
 *       400:
 *         description: Missing skill ID parameter.
 *       500:
 *         description: Server error updating database record.
 */

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
 * @swagger
 * /api/skills:
 *   delete:
 *     summary: Delete a skill item
 *     description: Deletes a skill matching the search parameter 'id'.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique Mongoose Object ID of the skill to delete
 *     responses:
 *       200:
 *         description: Skill deleted successfully.
 *       400:
 *         description: Missing skill ID query parameter.
 *       500:
 *         description: Database delete execution failure.
 */

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
 * @swagger
 * /api/skills:
 *   patch:
 *     summary: Bulk reorder technical skills
 *     description: Re-orders display prioritization values for multiple skills in a single transaction.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - _id
 *                     - order
 *                   properties:
 *                     _id:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Skills order synchronized successfully.
 *       400:
 *         description: Missing array of items parameters.
 *       500:
 *         description: Database reorder operation failure.
 */

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

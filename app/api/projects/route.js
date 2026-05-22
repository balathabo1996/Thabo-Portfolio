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
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Retrieve portfolio projects
 *     description: Fetches a sorted list of project entries. If query parameter 'all' is not true, draft items are automatically filtered out.
 *     parameters:
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *         description: Set to true to retrieve both draft and published items (admin console view)
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully.
 *       500:
 *         description: Database query failure.
 */

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
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project entry
 *     description: Registers a new portfolio showcase project.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               link:
 *                 type: string
 *               period:
 *                 type: string
 *               techStack:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 enum: [web, infra, tool]
 *               award:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [published, draft]
 *     responses:
 *       201:
 *         description: Project created successfully.
 *       500:
 *         description: Server error registering project.
 */

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
 * @swagger
 * /api/projects:
 *   put:
 *     summary: Update an existing project
 *     description: Updates a project document matching the specified database ID.
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
 *               title:
 *                 type: string
 *               subTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               link:
 *                 type: string
 *               period:
 *                 type: string
 *               techStack:
 *                 type: array
 *                 items:
 *                   type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *               award:
 *                 type: string
 *               order:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *       400:
 *         description: Missing project ID parameter.
 *       500:
 *         description: Database transaction failure.
 */

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
 * @swagger
 * /api/projects:
 *   delete:
 *     summary: Delete a project entry
 *     description: Deletes a project matching search parameter 'id'.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique Mongoose Object ID of the project to delete
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *       400:
 *         description: Missing project ID parameter.
 *       500:
 *         description: Database deletion execution failure.
 */

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
 * @swagger
 * /api/projects:
 *   patch:
 *     summary: Bulk reorder portfolio projects
 *     description: Re-orders display order indexes for multiple projects in a single bulk operation.
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
 *         description: Projects display order synchronized successfully.
 *       400:
 *         description: Missing array of items parameters.
 *       500:
 *         description: Bulk reorder transaction failure.
 */

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

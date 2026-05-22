/**
 * Database Summary Stats API Endpoint — app/api/stats/route.js
 * ==========================================================
 * Calculates total document counts and draft statuses across Project,
 * Experience, and Skill collections. Aggregates resume download records
 * to deliver visual numbers inside the Admin dashboard.
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/lib/models/Project';
import Experience from '@/lib/models/Experience';
import Skill from '@/lib/models/Skill';
import Analytics from '@/lib/models/Analytics';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Retrieve aggregate statistics of portfolio items
 *     description: Tallies total and status counts for projects, employment records, technical skills, and tracking counters.
 *     responses:
 *       200:
 *         description: Statistics object containing specific counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProjects:
 *                   type: integer
 *                 publishedProjects:
 *                   type: integer
 *                 draftProjects:
 *                   type: integer
 *                 totalExperience:
 *                   type: integer
 *                 draftExperience:
 *                   type: integer
 *                 totalSkills:
 *                   type: integer
 *                 draftSkills:
 *                   type: integer
 *                 resumeDownloads:
 *                   type: integer
 *       500:
 *         description: Database error fetching aggregates.
 */

/**
 * GET /api/stats
 * Queries Mongoose collections to count records and summarize statistics.
 *
 * @returns {NextResponse} The JSON object summary metrics or a 500 error response
 */
export async function GET() {
  try {
    await connectToDatabase();

    const [
      totalProjects,
      draftProjects,
      totalExperience,
      draftExperience,
      totalSkills,
      draftSkills,
      resumeDownloads,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: 'draft' }),
      Experience.countDocuments(),
      Experience.countDocuments({ status: 'draft' }),
      Skill.countDocuments(),
      Skill.countDocuments({ status: 'draft' }),
      Analytics.findOne({ event: 'resume_download' }),
    ]);

    return NextResponse.json({
      totalProjects,
      publishedProjects: totalProjects - draftProjects,
      draftProjects,
      totalExperience,
      draftExperience,
      totalSkills,
      draftSkills,
      resumeDownloads: resumeDownloads?.count ?? 0,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

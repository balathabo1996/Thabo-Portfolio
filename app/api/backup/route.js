/**
 * Backup API Endpoint — app/api/backup/route.js
 * ========================================================
 * Exports the entire portfolio database (profile, projects, experiences, skills)
 * as a formatted JSON snapshot.
 *
 * This allows the admin to download complete backups directly from the administrative interface.
 */

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';
import Project from '@/lib/models/Project';
import Experience from '@/lib/models/Experience';
import Skill from '@/lib/models/Skill';

// Force dynamic execution to bypass Vercel static rendering caches
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/backup:
 *   get:
 *     summary: Export portfolio database backup
 *     description: Fetches all collections (Profile, Projects, Experiences, Skills) from MongoDB and generates a formatted JSON download.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Database JSON backup file stream returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exportedAt:
 *                   type: string
 *                   format: date-time
 *                   description: ISO timestamp of when the backup was taken.
 *                 version:
 *                   type: string
 *                   description: Snapshot version format.
 *                 data:
 *                   type: object
 *                   properties:
 *                     profile:
 *                       type: object
 *                       description: The primary user profile document.
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: List of projects in database.
 *                     experiences:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: List of work and education experiences.
 *                     skills:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: List of professional skills.
 *       500:
 *         description: Database backup operation failed.
 */

/**
 * GET /api/backup
 * Consolidates all collections and streams a serialized backup JSON file.
 *
 * @returns {Promise<NextResponse>} Response containing backup JSON attachment stream or error details
 */
export async function GET() {
  try {
    // Establish a connection with the cached database instance
    await connectToDatabase();

    // Query all MongoDB collections concurrently via Promise.all
    const [profile, projects, experiences, skills] = await Promise.all([
      Profile.findOne().lean(),
      Project.find().lean(),
      Experience.find().lean(),
      Skill.find().lean(),
    ]);

    // Construct the structured snapshot payload
    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: { profile, projects, experiences, skills },
    };

    // Serialize snapshot and return as a downloadable attachment stream
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (err) {
    console.error('Backup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

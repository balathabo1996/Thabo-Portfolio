/**
 * API Route: /resume  —  app/resume/route.js
 * ===========================================
 * Streams the most recently uploaded resume PDF directly from MongoDB.
 *
 * GET  — Queries the Resume collection for the latest document (sorted by
 *         uploadDate descending), then serves the raw binary data with:
 *           Content-Type: application/pdf
 *           Content-Disposition: inline  (opens in the browser's PDF viewer)
 *         Returns 404 if no resume document exists, 500 on a database error.
 */
import { connectToDatabase } from '@/lib/mongodb';
import Resume from '@/lib/models/Resume';

export async function GET() {
  try {
    await connectToDatabase();
    const resume = await Resume.findOne().sort({ uploadDate: -1 });
    if (!resume || !resume.data) {
      return new Response('Resume not found', { status: 404 });
    }
    return new Response(resume.data, {
      headers: {
        'Content-Type': resume.contentType || 'application/pdf',
        'Content-Disposition': `inline; filename="${resume.name || 'resume.pdf'}"`,
      },
    });
  } catch (err) {
    return new Response('Internal server error', { status: 500 });
  }
}

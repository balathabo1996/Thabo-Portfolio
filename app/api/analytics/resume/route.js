/**
 * Resume Download Analytics API Endpoint — app/api/analytics/resume/route.js
 * =========================================================================
 * Provides POST and GET operations to track and read resume view analytics.
 * Every time the user clicks "View Resume", the POST handler is called to
 * increment the counter in the MongoDB "Analytics" collection.
 */

import { connectToDatabase } from "@/lib/mongodb";
import Analytics from "@/lib/models/Analytics";
import { NextResponse } from "next/server";

/**
 * POST /api/analytics/resume
 * Increments the click counter for the "resume_download" event.
 *
 * @returns {Promise<NextResponse>} JSON response containing transaction status and updated click count
 */
export async function POST() {
  try {
    await connectToDatabase();

    // Increment click counter by 1. Create document if it does not yet exist (upsert).
    const result = await Analytics.findOneAndUpdate(
      { event: "resume_download" },
      { $inc: { count: 1 }, lastUpdated: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/analytics/resume
 * Retrieves the total view counter for the resume.
 *
 * @returns {Promise<NextResponse>} JSON response containing the current count
 */
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the single document tracking the resume view event
    const result = await Analytics.findOne({ event: "resume_download" });
    
    return NextResponse.json({ count: result ? result.count : 0 });
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { connectToDatabase } from "@/lib/mongodb";
import Analytics from "@/lib/models/Analytics";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDatabase();

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

export async function GET() {
  try {
    await connectToDatabase();
    const result = await Analytics.findOne({ event: "resume_download" });
    return NextResponse.json({ count: result ? result.count : 0 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * API Route: /api/profile  —  app/api/profile/route.js
 * ======================================================
 * Manages the single profile document stored in MongoDB.
 *
 * GET  — Returns the first profile document.
 *         If no document exists yet, an empty one is created automatically.
 *         Used by the home page server component to pre-render the profile photo.
 *
 * PUT  — Updates specific profile fields (profileImageUrl, bio, name, role,
 *         location, email, phone).  Protected by an x-api-key header check
 *         against the ADMIN_API_KEY environment variable.
 *         Only whitelisted fields are written to prevent mass-assignment attacks.
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    await connectToDatabase();
    let profile = await Profile.findOne().lean();
    if (!profile) {
      profile = await Profile.create({});
      profile = profile.toObject();
    }
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Basic security: check for API key in headers
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();

    // Input Validation: Only allow specific fields to be updated
    const allowedFields = ['profileImageUrl', 'bio', 'name', 'role', 'location', 'email', 'phone'];
    const filteredData = Object.keys(data)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    const profile = await Profile.findOneAndUpdate({}, filteredData, {
      new: true,
      upsert: true,
    }).lean();
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

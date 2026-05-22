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
 *         location, email, phone).  Protected by JWT middleware.
 *         Only whitelisted fields are written to prevent mass-assignment attacks.
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Retrieve owner profile
 *     description: Returns the portfolio owner's configuration metadata. Automatically bootstraps an empty profile if none is registered.
 *     responses:
 *       200:
 *         description: Profile document retrieved successfully.
 *       500:
 *         description: Database bootstrap or fetch failure.
 */

/**
 * GET /api/profile
 * Retrieves the singular profile configuration from MongoDB.
 *
 * @returns {NextResponse} The JSON profile document object
 */
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

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update owner profile details
 *     description: Modifies existing attributes. Enforces whitelist checks to prevent mass assignment exploits.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileImageUrl:
 *                 type: string
 *               bio:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *               title:
 *                 type: string
 *               location:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               linkedinUrl:
 *                 type: string
 *               githubUrl:
 *                 type: string
 *               tagline:
 *                 type: string
 *               heroDescription:
 *                 type: string
 *               resumeUrl:
 *                 type: string
 *               missionTitle:
 *                 type: string
 *               missionDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: No valid update parameters provided.
 *       500:
 *         description: Server database update failure.
 */

/**
 * PUT /api/profile
 * Safely writes filtered key parameters to the single profile document.
 *
 * @param {Request} request - Next.js Request with JSON updating object
 * @returns {NextResponse} The JSON modified profile document
 */
export async function PUT(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    // Input Validation: Only allow specific fields to be updated
    const allowedFields = [
      'profileImageUrl', 'bio', 'firstName', 'lastName', 'role', 'title', 
      'location', 'email', 'phone', 'linkedinUrl', 'githubUrl',
      'tagline', 'heroDescription', 'resumeUrl', 'missionTitle', 'missionDescription'
    ];
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
      returnDocument: 'after',
      upsert: true,
    }).lean();
    return NextResponse.json(profile);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

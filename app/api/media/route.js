/**
 * Cloudinary Media Management REST Endpoint — app/api/media/route.js
 * ================================================================
 * Facilitates listing (GET) and deleting (DELETE) image assets in Cloudinary.
 * Integrates directly with the Admin console's media library interface.
 */

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * GET /api/media
 * Retrives all uploaded images under the folder prefix 'thabo-portfolio'.
 *
 * @returns {NextResponse} The JSON payload of resource objects
 */
export async function GET() {
  try {
    console.log('[Cloudinary] Fetching assets with prefix: thabo-portfolio');
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'thabo-portfolio',
      max_results: 100,
    });
    console.log(`[Cloudinary] Found ${result.resources?.length || 0} assets`);
    return NextResponse.json({ resources: result.resources });
  } catch (error) {
    console.error('[Cloudinary] API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/media
 * Permanently removes a media asset from Cloudinary storage.
 *
 * @param {Request} request - Next.js Request with JSON containing target public_id
 * @returns {NextResponse} The JSON status confirmation
 */
export async function DELETE(request) {
  try {
    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }
    await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

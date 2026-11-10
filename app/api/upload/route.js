/**
 * Cloudinary Media Upload API Endpoint — app/api/upload/route.js
 * =============================================================
 * Handles image media upload directly into the Cloudinary repository.
 * Enforces image-only validation checks and utilizes arrays to transfer binary buffers.
 * Used primarily by the Admin console for profile photos or project previews.
 */

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload
 * Handles Multipart FormData image binary uploads to Cloudinary storage.
 *
 * @param {Request} request - Next.js Request object with formData payload
 * @returns {NextResponse} The JSON output containing Cloudinary secure url pointer
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const field = formData.get('field') || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Only images are supported — PDFs use Google Drive links instead
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      return NextResponse.json(
        { error: 'Only image uploads are supported. For resumes, paste a Google Drive link in the Admin panel.' },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = `${field}_${Date.now()}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'thabo-portfolio',
          public_id: uniqueId,
          overwrite: true,
          invalidate: true,
          access_mode: 'public',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 });
  }
}

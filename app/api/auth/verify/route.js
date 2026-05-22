/**
 * Authentication Verification API Endpoint — app/api/auth/verify/route.js
 * ====================================================================
 * Handles admin security validation. Verifies the input passphrase/key
 * against the server environment variable `ADMIN_API_KEY`.
 *
 * If valid, generates and signs a secure JSON Web Token (JWT) payload
 * and returns it to the client to establish their admin session context.
 */

import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

// Force dynamic execution to bypass Next.js compilation cache
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify administrative credentials and issue JWT
 *     description: Accepts a security key and validates it against ADMIN_API_KEY. If verified, issues a JWT token valid for admin requests.
 *     tags:
 *       - System
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *                 description: The admin security passphrase.
 *                 example: MySuperSecretPassphrase
 *     responses:
 *       200:
 *         description: Passphrase verified. Returns a signed JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                   description: Signed JWT auth token.
 *       401:
 *         description: Unauthorized. Invalid passphrase.
 *       500:
 *         description: JWT sign failure or request parsing error.
 */

/**
 * POST /api/auth/verify
 * Validates the administrative key and delivers a signed JWT token.
 *
 * @param {Request} request - Next.js Request object with JSON body containing the 'key'
 * @returns {Promise<NextResponse>} JSON response containing success status and JWT token, or error details
 */
export async function POST(request) {
  try {
    const { key } = await request.json();
    
    // Validate credentials against environment
    if (key === process.env.ADMIN_API_KEY) {
      // Sign administrative authorization payload
      const token = await signToken({ admin: true });
      return NextResponse.json({ success: true, token });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid passphrase' }, { status: 401 });
  } catch (err) {
    console.error('Auth verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

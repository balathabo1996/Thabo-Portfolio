/**
 * Authentication Helper Utilities — lib/auth.js
 * ===============================================
 * Facilitates the generation and verification of JSON Web Tokens (JWT) using the lightweight `jose` library.
 * Used to secure the administrator session for the /admin dashboard operations.
 */

import { SignJWT, jwtVerify } from 'jose';

// Read lazily so a missing secret disables authentication without breaking public pages.
function getSecret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  return new TextEncoder().encode(value);
}

/**
 * Generates a signed JWT payload for active admin sessions.
 * Encrypts using the HMAC SHA-256 algorithm and sets an 8-hour expiration.
 * 
 * @param {Object} payload - Session identity parameters to store inside the token
 * @returns {Promise<string>} The cryptographically signed JWT string
 */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

/**
 * Cryptographically verifies a raw JWT token string against the local secret key.
 * 
 * @param {string} token - The raw JWT token string to verify
 * @returns {Promise<Object|null>} The decoded session payload if verification succeeds, or null if invalid or expired
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}


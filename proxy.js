import { NextResponse } from 'next/server.js';
import { verifyToken } from './lib/auth.js';

async function validateToken(request) {
  const token = request.headers.get('x-api-key');
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.admin === true;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const reqMethod = request.method;

  // /api/backup — always requires auth (GET included)
  if (pathname.startsWith('/api/backup')) {
    const valid = await validateToken(request);
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorised. Please log in.' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // All other admin-data routes — only protect writes
  const writableRoutes = [
    '/api/projects',
    '/api/experience',
    '/api/skills',
    '/api/profile',
    '/api/upload',
    '/api/media',
  ];

  const isWritableRoute = writableRoutes.some(r => pathname.startsWith(r));
  const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(reqMethod);

  if (isWritableRoute && isWriteMethod) {
    const valid = await validateToken(request);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid or expired token. Please log in again.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

/**
 * API Route: /api/swagger  —  app/api/swagger/route.js
 * ======================================================
 * GET — Returns the OpenAPI 3.0 specification as JSON.
 * Used by the /api-docs Swagger UI page and any external tooling
 * (Postman import, IDE plugins, etc.) that needs the raw spec.
 */
import { NextResponse } from 'next/server';
import swaggerSpec from '@/lib/swagger';

export async function GET() {
  return NextResponse.json(swaggerSpec);
}

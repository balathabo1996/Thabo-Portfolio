/**
 * Database Connection  —  lib/mongodb.js
 * ========================================
 * Manages a single, reusable Mongoose connection to MongoDB Atlas.
 *
 * Strategy: module-level caching on the Node.js `global` object.
 * In Next.js development mode, hot-module replacement re-evaluates every
 * module on each save, which would open a fresh connection on every reload.
 * Caching the connection promise on `global.mongoose` ensures only one
 * connection is ever opened per Node.js process, regardless of how many
 * times the module is imported or how many API routes call it concurrently.
 *
 *   MONGO_DB   – Target database name within the Atlas cluster
 */
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  let MONGODB_URI = process.env.MONGO_URI;
  const MONGODB_DB = process.env.MONGO_DB;

  if (MONGODB_URI && MONGODB_URI.endsWith('/')) {
    MONGODB_URI = MONGODB_URI.slice(0, -1);
  }

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable in .env');
  }

  // Force the database name into the URI to prevent driver-level defaults
  if (!MONGODB_URI.includes('.net/')) {
     MONGODB_URI = MONGODB_URI.replace('.net', `.net/${MONGODB_DB}`);
  } else if (MONGODB_URI.endsWith('.net/')) {
     MONGODB_URI = MONGODB_URI + MONGODB_DB;
  }

  if (!cached.promise) {
    console.log(`[MongoDB] Force connecting to: ${MONGODB_DB}`);
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  console.log(`[MongoDB] Connected to: ${cached.conn.connection.db.databaseName}`);
  return cached.conn;
}

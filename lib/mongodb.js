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

  const MONGODB_URI = process.env.MONGO_URI;
  const MONGODB_DB = process.env.MONGO_DB;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable in .env');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

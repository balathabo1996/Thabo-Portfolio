/**
 * Database Connection Pooler — lib/mongodb.js
 * ============================================
 * Manages a persistent Mongoose connection pool to MongoDB.
 * Utilizes a global caching pattern to prevent opening redundant database connections
 * during Next.js hot-module replacement (HMR) in local development.
 */

import mongoose from 'mongoose';

// Look up any existing cached connection in the NodeJS global namespace
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB Atlas or localhost using the MONGODB_URI and MONGODB_DB configurations.
 * If a cached connection is already available, it resolves immediately to avoid pool exhaustion.
 * 
 * @returns {Promise<typeof import("mongoose")>} The Mongoose connection instance
 * @throws {Error} If MONGO_URI is missing in environmental configurations
 */
export async function connectToDatabase() {
  // If connection is already established, return it immediately
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  const MONGODB_DB = process.env.MONGODB_DB || process.env.MONGO_DB;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env');
  }

  // If a connection promise is not currently active, initialize one
  if (!cached.promise) {
    // Mask sensitive credential strings from console logs
    const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`[MongoDB] Initializing connection to: ${MONGODB_DB} via ${maskedUri}`);

    const opts = {
      dbName: MONGODB_DB,
      bufferCommands: false, // Turn off query buffering so errors fail fast
    };

    // Store the pending mongoose connection promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`[MongoDB] Successfully connected to database: ${mongoose.connection.db.databaseName}`);
      return mongoose;
    });
  }

  try {
    // Await the active connection promise
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection failed, clear out the cached promise to allow retries on subsequent requests
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}


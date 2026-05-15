/**
 * Database Connection  —  lib/mongodb.js
 * ========================================
 * Manages a single, reusable Mongoose connection to MongoDB Atlas.
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
    const maskedUri = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`[MongoDB] Initializing connection to: ${MONGODB_DB} via ${maskedUri}`);

    const opts = {
      dbName: MONGODB_DB,
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`[MongoDB] Successfully connected to database: ${mongoose.connection.db.databaseName}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Mongoose Schema for Analytics Tracking — lib/models/Analytics.js
 * ================================================================
 * This model is used to track interactive portfolio-wide events,
 * such as counting how many times the resume has been downloaded or viewed.
 * It provides a simple key-value structure for dynamic telemetry.
 */

import mongoose from 'mongoose';

/**
 * @typedef {Object} Analytics
 * @property {string} event - Unique event identifier (e.g., 'resume_view')
 * @property {number} count - Cumulative counter for this specific event
 * @property {Date} lastUpdated - The timestamp when the event was last triggered
 */
const AnalyticsSchema = new mongoose.Schema({
  // The event name (e.g., 'resume_view') which acts as a unique lookup key
  event: {
    type: String,
    required: true,
    unique: true,
  },
  // Cumulative numerical counter for the event
  count: {
    type: Number,
    default: 0,
  },
  // The timestamp of the last time this count was incremented
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { 
  // Automatically manage createdAt and updatedAt timestamps for the record
  timestamps: true 
});

// Export the registered Analytics model, reusing the cached version if it exists
export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);


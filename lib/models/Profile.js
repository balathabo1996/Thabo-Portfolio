/**
 * Profile Model  —  lib/models/Profile.js
 * =========================================
 * Mongoose schema for the single profile document stored in MongoDB.
 * This document holds the owner's public-facing data displayed in the
 * hero section and is updateable through PUT /api/profile.
 *
 * Fields:
 *   profileImageUrl  – URL of the profile photo (falls back to local image)
 *   name             – Full display name shown in the hero
 *   title            – Professional tagline beneath the name
 *   bio              – Short biography (optional, currently unused in UI)
 *
 * { timestamps: true } automatically adds createdAt and updatedAt fields.
 *
 * The guard `mongoose.models.Profile || mongoose.model(...)` prevents
 * Next.js hot-reload from throwing a "model already registered" error
 * on every module re-evaluation during development.
 */
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    profileImageUrl: {
      type: String,
      default: '/images/portf.png',
    },
    name: {
      type: String,
      default: 'Balachandran Thabotharan',
    },
    title: {
      type: String,
      default: 'Infrastructure Engineer | IT Solutions Student | Cybersecurity Enthusiast',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

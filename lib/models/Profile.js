/**
 * Mongoose Schema for Owner Profile — lib/models/Profile.js
 * ==========================================================
 * Defines the main identity profile for the portfolio owner (Balachandran Thabotharan).
 * Operates on a single-document pattern where only one profile document is 
 * active in MongoDB, storing primary bio description, social links, resume download links,
 * contact details, and mission summaries.
 */

import mongoose from 'mongoose';

/**
 * @typedef {Object} Profile
 * @property {string} [profileImageUrl] - URL to the owner's professional portrait photo (stored in Cloudinary)
 * @property {string} [firstName] - First name (e.g., 'Balachandran')
 * @property {string} [lastName] - Last name (e.g., 'Thabotharan')
 * @property {string} [title] - High-impact title tagline for SEO & Header (e.g., 'Infrastructure Engineer')
 * @property {string} [role] - Current focus or job title
 * @property {string} [bio] - Main markdown-enabled biography or introductory paragraph
 * @property {string} [location] - Geographic location (e.g., 'Scarborough, Ontario, Canada')
 * @property {string} [email] - Contact email address
 * @property {string} [phone] - Contact phone number
 * @property {string} [linkedinUrl] - URL to LinkedIn profile
 * @property {string} [githubUrl] - URL to GitHub profile
 * @property {string} [tagline] - A secondary high-impact tagline for Hero sections
 * @property {string} [heroDescription] - Extended text description used inside the Hero header
 * @property {string} [resumeUrl] - Link to PDF version of the resume (hosted on Google Drive)
 * @property {string} [missionTitle] - Heading for the professional mission block (e.g., 'Professional Mission')
 * @property {string} [missionDescription] - Description of the owner's career objectives and technical mission
 */
const ProfileSchema = new mongoose.Schema(
  {
    // Cloudinary URL for the profile photo
    profileImageUrl: {
      type: String,
    },
    // Owner's first name
    firstName: {
      type: String,
    },
    // Owner's last name
    lastName: {
      type: String,
    },
    // Professional header tagline/title
    title: {
      type: String,
    },
    // Core occupational role name
    role: {
      type: String,
    },
    // Narrative introduction or professional bio
    bio: {
      type: String,
    },
    // City, province, and country location
    location: {
      type: String,
    },
    // Professional email address
    email: {
      type: String,
    },
    // Professional telephone number
    phone: {
      type: String,
    },
    // LinkedIn profile page URL
    linkedinUrl: {
      type: String,
    },
    // GitHub portfolio URL
    githubUrl: {
      type: String,
    },
    // Catchy secondary tagline for Hero displays
    tagline: {
      type: String,
    },
    // Descriptive paragraph explaining focus area in Hero
    heroDescription: {
      type: String,
    },
    // Shared document URL (Google Drive / PDF host) for resume
    resumeUrl: {
      type: String,
    },
    // Block header for user mission
    missionTitle: {
      type: String,
    },
    // Main content describing career goals or technical values
    missionDescription: {
      type: String,
    },
  },
  { 
    // Auto-populate createdAt and updatedAt timestamps for tracking profile edits
    timestamps: true 
  }
);

// Clear the model cache in Next.js development environment to prevent overwrite issues on hot reload
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Profile;
}

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);


/**
 * Mongoose Schema for Experience Timeline — lib/models/Experience.js
 * ===================================================================
 * Represents a historical timeline entry in the portfolio. Supports multiple
 * types of experience (professional work, education history, voluntary
 * contributions, and key achievements) with a custom drag-and-drop sort order.
 */

import mongoose from 'mongoose';

/**
 * @typedef {Object} Experience
 * @property {string} role - Job title, degree name, or award title (e.g., 'Senior Infrastructure Engineer')
 * @property {string} company - Name of the organization or educational institution
 * @property {string} [companyUrl] - Optional URL link to the company or educational institution website
 * @property {string} [location] - Physical or remote location (e.g., 'Toronto, ON')
 * @property {string} [period] - Time span descriptor (e.g., 'Jan 2020 – Present')
 * @property {string[]} [description] - List of bullet points outlining responsibilities/key accomplishments
 * @property {'work'|'education'|'achievement'|'voluntary'} type - Categorization of the timeline entry
 * @property {number} order - Re-ordering index for customized drag-and-drop sorting in the Admin Panel
 * @property {'published'|'draft'} status - Visibility status (drafts are hidden from the public website)
 */
const ExperienceSchema = new mongoose.Schema({
  // Job title or educational program name
  role: { type: String, required: true },
  
  // Organization or school
  company: { type: String, required: true },
  
  // Optional link to company or institution website
  companyUrl: { type: String },
  
  // Optional physical location
  location: { type: String },
  
  // Dates/Years active (e.g. '2023 - 2026')
  period: { type: String },
  
  // Detailed summary points of the experience
  description: [{ type: String }],
  
  // Entry category for styling and section filtering
  type: { 
    type: String, 
    enum: ['work', 'education', 'achievement', 'voluntary'], 
    default: 'work' 
  },
  
  // Numerical position for custom list ordering
  order: { type: Number, default: 0 },
  
  // Controls front-end visibility
  status: { 
    type: String, 
    enum: ['published', 'draft'], 
    default: 'published' 
  }
}, { 
  // Automatically track creation and edit times
  timestamps: true 
});

// Clear the mongoose model cache during Next.js local dev to prevent re-compilation/overwrite errors
if (mongoose.models.Experience) {
  delete mongoose.models.Experience;
}

export default mongoose.model('Experience', ExperienceSchema);


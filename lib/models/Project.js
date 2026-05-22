/**
 * Mongoose Schema for Portfolio Projects — lib/models/Project.js
 * =============================================================
 * Repersents a software, hardware, or infrastructure project showcased on the website.
 * Contains fields for technical features, technologies used, image showcases, custom category filters,
 * drag-and-drop sort positioning, and publication control (status: draft vs. published).
 */

import mongoose from 'mongoose';

/**
 * @typedef {Object} Project
 * @property {string} title - The title/headline of the project (e.g. 'Interactive API Sandbox')
 * @property {string} [subTitle] - Optional secondary short headline
 * @property {string} description - Long-form narrative or case study detailing the project
 * @property {string} [imageUrl] - Cloudinary URL of the project screenshot or cover art
 * @property {string} [period] - Dates or timeframe descriptor (e.g., 'Winter 2025')
 * @property {string} [award] - Special honors or recognition details (e.g., 'First Place')
 * @property {string[]} [features] - List of core functionalities or major highlights
 * @property {string[]} [techStack] - Key technologies, tools, and languages utilized (e.g., ['Next.js', 'MongoDB'])
 * @property {string} [link] - Destination URL (e.g., live web demo, GitHub repository)
 * @property {string} category - Navigation category filter (e.g., 'web', 'infra', 'security', 'cloud')
 * @property {number} order - Ordering index for manual drag-and-drop sorting in the Admin Panel
 * @property {'published'|'draft'} status - Toggles visibility on the public website interface
 */
const ProjectSchema = new mongoose.Schema({
  // Main title of the project card
  title: { type: String, required: true },
  
  // Optional subtitle or tagline
  subTitle: { type: String },
  
  // Comprehensive description of the project goals, actions, and results
  description: { type: String, required: true },
  
  // Cover picture URL hosted on Cloudinary
  imageUrl: { type: String },
  
  // Timeframe of project execution
  period: { type: String },
  
  // Optional award/badge details received
  award: { type: String },
  
  // Highlighted features
  features: [{ type: String }],
  
  // Array of software frameworks, tooling, or environments
  techStack: [{ type: String }],
  
  // URL to repository or live production build
  link: { type: String },
  
  // Group key used for landing page filters
  category: { type: String, default: 'web' },
  
  // Custom drag order sorting position
  order: { type: Number, default: 0 },
  
  // Visibility controller to hide incomplete documents
  status: { 
    type: String, 
    enum: ['published', 'draft'], 
    default: 'published' 
  }
}, { 
  // Track creation and edit times
  timestamps: true 
});

// Prevent model recompilation issues during hot-reloading in Next.js development
delete mongoose.models.Project;

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);


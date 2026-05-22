/**
 * Mongoose Schema for Portfolio Skills — lib/models/Skill.js
 * ==========================================================
 * Manages technical expertise listings (e.g., 'Infrastructure', 'Databases') displayed inside the Profile section.
 * Supports categorization, custom vector/image icons, manual sort indices, and draft visibility switches.
 */

import mongoose from 'mongoose';

/**
 * @typedef {Object} Skill
 * @property {string} name - Name of the technical skill (e.g., 'Active Directory', 'Next.js', 'Docker')
 * @property {string} category - Skill taxonomy classification (e.g. 'infra', 'virt', 'prog', 'db', 'sec', 'soft')
 * @property {string} [icon] - CSS FontAwesome icon class (e.g., 'fab fa-react' or 'fas fa-server')
 * @property {string} [imageUrl] - Cloudinary media URL to a custom graphic or branded PNG/SVG icon
 * @property {number} order - Sort sequence index within its skill category block
 * @property {'published'|'draft'} status - Toggles visibility on the public landing page
 */
const SkillSchema = new mongoose.Schema({
  // The name of the specific technology, methodology, or soft skill
  name: { type: String, required: true },
  
  // High-level grouping label matching the profile skills grid categories
  category: { type: String, required: true }, // e.g., 'infra', 'virt', 'prog', 'db', 'sec', 'soft'
  
  // FontAwesome icon class selector
  icon: { type: String }, // FontAwesome icon class
  
  // URL to custom graphic badge (takes priority over the icon class if present)
  imageUrl: { type: String },
  
  // Placement sequencing value
  order: { type: Number, default: 0 },
  
  // Controls front-end badge visibility
  status: { 
    type: String, 
    enum: ['published', 'draft'], 
    default: 'published' 
  }
}, { 
  // Track creation and edit times
  timestamps: true 
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);


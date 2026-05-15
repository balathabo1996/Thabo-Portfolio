import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  period: { type: String },
  description: [{ type: String }],
  type: { type: String, enum: ['work', 'education', 'achievement', 'voluntary'], default: 'work' },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'draft'], default: 'published' }
}, { timestamps: true });

if (mongoose.models.Experience) {
  delete mongoose.models.Experience;
}

export default mongoose.model('Experience', ExperienceSchema);

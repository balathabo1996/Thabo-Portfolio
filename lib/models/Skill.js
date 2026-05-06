import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Infrastructure', 'Development', 'Cloud'
  icon: { type: String }, // FontAwesome icon class
  imageUrl: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  features: [{ type: String }],
  techStack: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String, required: true },
  imageUrl: { type: String },
  period: { type: String },
  award: { type: String },
  features: [{ type: String }],
  techStack: [{ type: String }],
  link: { type: String },
  category: { type: String, default: 'web' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent model recompilation issues during hot-reloading
delete mongoose.models.Project;

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);

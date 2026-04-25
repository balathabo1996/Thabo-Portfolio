import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  period: { type: String },
  type: { type: String, enum: ['work', 'education', 'achievement', 'voluntary'], default: 'work' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

if (mongoose.models.Experience) {
  delete mongoose.models.Experience;
}

export default mongoose.model('Experience', ExperienceSchema);

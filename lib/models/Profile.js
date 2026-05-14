import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    profileImageUrl: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    title: {
      type: String,
    },
    role: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    tagline: {
      type: String,
    },
    heroDescription: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    missionTitle: {
      type: String,
    },
    missionDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

// Clear the model cache in development to ensure schema changes are picked up
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Profile;
}

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);

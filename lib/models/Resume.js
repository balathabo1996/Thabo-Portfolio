/**
 * Resume Model  —  lib/models/Resume.js
 * =======================================
 * Mongoose schema for storing the resume PDF as a binary Buffer in MongoDB.
 * Keeping the file in the database means no separate file-storage service is
 * needed; the /resume route reads and streams it on demand.
 *
 * Fields:
 *   name         – Original filename of the uploaded PDF
 *   data         – Raw binary content of the PDF (Buffer)
 *   contentType  – MIME type, typically "application/pdf"
 *   uploadDate   – When the file was stored; defaults to Date.now
 *
 * The /resume route sorts by uploadDate descending so the most recently
 * uploaded version is always served, making updates straightforward.
 *
 * The guard `mongoose.models.Resume || mongoose.model(...)` prevents
 * Next.js hot-reload from re-registering the model on every save.
 */
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
}, { collection: 'Resume' });

if (mongoose.models.Resume) {
  delete mongoose.models.Resume;
}

export default mongoose.model('Resume', ResumeSchema);

const mongoose = require('mongoose');

/**
 * Resume Schema
 * Defines the structure for storing the resume PDF in MongoDB.
 */
const resumeSchema = new mongoose.Schema({
    // Name of the file (e.g., "Resume.pdf")
    name: {
        type: String,
        required: true
    },
    // Binary data of the PDF file
    data: {
        type: Buffer,
        required: true
    },
    // MIME type (e.g., "application/pdf")
    contentType: {
        type: String,
        required: true
    },
    // Timestamp of when the resume was uploaded
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

/**
 * Export the Resume model.
 * Explicitly links to the 'Resume' collection in MongoDB.
 */
module.exports = mongoose.model('Resume', resumeSchema, 'Resume');

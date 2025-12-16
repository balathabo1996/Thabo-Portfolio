/**
 * Profile Model
 * 
 * This Mongoose model defines the schema for storing user profile information
 * in MongoDB. It enables dynamic profile management, allowing profile data
 * (especially the profile image) to be updated without modifying code.
 * 
 * @module ProfileModel
 * @requires mongoose
 */

const mongoose = require('mongoose');

/**
 * Profile Schema Definition
 * 
 * Defines the structure of profile documents in the MongoDB collection.
 * Each field has a type, default value, and validation rules.
 */
const profileSchema = new mongoose.Schema({
    /**
     * Profile Image URL
     * Stores the path or URL to the user's profile picture.
     * Can be a relative path (e.g., '/images/portf.png') or external URL.
     * @type {String}
     * @required
     * @default '/images/portf.png'
     */
    profileImageUrl: {
        type: String,
        required: true,
        default: '/images/portf.png'
    },

    /**
     * User's Full Name
     * @type {String}
     * @default 'Balachandran Thabotharan'
     */
    name: {
        type: String,
        default: 'Balachandran Thabotharan'
    },

    /**
     * Professional Title
     * A brief description of the user's role or expertise
     * @type {String}
     * @default 'Infrastructure Engineer & IT Professional'
     */
    title: {
        type: String,
        default: 'Infrastructure Engineer & IT Professional'
    },

    /**
     * Professional Biography
     * A longer description of the user's background and experience
     * @type {String}
     * @default 'IT professional with hands-on experience...'
     */
    bio: {
        type: String,
        default: 'IT professional with hands-on experience in system administration, infrastructure engineering, and web application development.'
    }
}, {
    /**
     * Schema Options
     * timestamps: Automatically adds createdAt and updatedAt fields
     */
    timestamps: true
});

/**
 * Export the Profile Model
 * 
 * Creates and exports a Mongoose model based on the profileSchema.
 * The model will create a 'profiles' collection in MongoDB.
 * 
 * @exports Profile
 */
module.exports = mongoose.model('Profile', profileSchema);

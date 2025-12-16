/**
 * Profile Controller
 * 
 * Handles all profile-related operations including fetching and updating
 * user profile data stored in MongoDB. This enables dynamic profile management
 * without requiring code changes.
 * 
 * @module profileController
 * @requires ../models/ProfileModel
 */

const Profile = require('../models/ProfileModel');

/**
 * Get Profile Data
 * 
 * Retrieves the user's profile information from MongoDB.
 * If no profile exists, creates a default profile automatically.
 * 
 * @async
 * @function getProfile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with profile data or error message
 * 
 * @example
 * // GET /api/profile
 * // Response: { profileImageUrl: '/images/portf.png', name: '...', ... }
 */
exports.getProfile = async (req, res) => {
    try {
        // Find the first (and only) profile document in the collection
        let profile = await Profile.findOne();

        // If no profile exists, create a default one with initial values
        if (!profile) {
            profile = await Profile.create({
                profileImageUrl: '/images/portf.png',
                name: 'Balachandran Thabotharan',
                title: 'Infrastructure Engineer & IT Professional',
                bio: 'IT professional with hands-on experience in system administration, infrastructure engineering, and web application development.'
            });
        }

        // Return profile data as JSON
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile data' });
    }
};

/**
 * Update Profile Data
 * 
 * Updates the user's profile information in MongoDB.
 * Creates a new profile if one doesn't exist.
 * Only updates fields that are provided in the request body.
 * 
 * @async
 * @function updateProfile
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing profile fields to update
 * @param {string} [req.body.profileImageUrl] - New profile image URL
 * @param {string} [req.body.name] - New name
 * @param {string} [req.body.title] - New professional title
 * @param {string} [req.body.bio] - New biography
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message and updated profile
 * 
 * @example
 * // PUT /api/profile
 * // Body: { profileImageUrl: '/images/new-photo.png' }
 * // Response: { message: 'Profile updated successfully', profile: {...} }
 */
exports.updateProfile = async (req, res) => {
    try {
        // Extract profile fields from request body
        const { profileImageUrl, name, title, bio } = req.body;

        // Find the existing profile document
        let profile = await Profile.findOne();

        if (!profile) {
            // Create new profile if none exists
            profile = await Profile.create(req.body);
        } else {
            // Update only the fields that were provided
            if (profileImageUrl) profile.profileImageUrl = profileImageUrl;
            if (name) profile.name = name;
            if (title) profile.title = title;
            if (bio) profile.bio = bio;

            // Save the updated profile to MongoDB
            await profile.save();
        }

        // Return success response with updated profile data
        res.json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

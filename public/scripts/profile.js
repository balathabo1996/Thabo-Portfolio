/**
 * Profile Image Loader
 * 
 * Fetches profile data from MongoDB via API and dynamically updates
 * the profile image on the home page. This allows the profile picture
 * to be changed without modifying code.
 * 
 * @file profile.js
 * @requires DOM
 * @requires Fetch API
 */

/**
 * Initialize profile image loading when DOM is ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Get the profile image element
    const profileImage = document.getElementById('profile-image');

    // Exit if profile image element doesn't exist on this page
    if (!profileImage) {
        console.warn('Profile image element not found');
        return;
    }

    try {
        // Show loading state by reducing opacity
        profileImage.style.opacity = '0.5';

        /**
         * Fetch profile data from the API
         * @type {Response}
         */
        const response = await fetch('/api/profile');

        // Check if request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        /**
         * Parse JSON response
         * @type {Object} profile - Profile data object
         * @property {string} profileImageUrl - URL/path to profile image
         * @property {string} name - User's name
         * @property {string} title - Professional title
         * @property {string} bio - Biography
         */
        const profile = await response.json();

        // Update image source if URL is provided
        if (profile.profileImageUrl) {
            profileImage.src = profile.profileImageUrl;
            profileImage.alt = profile.name || 'Profile Picture';
        }

        // Restore full opacity with smooth transition
        profileImage.style.opacity = '1';

        console.log('Profile image loaded successfully');
    } catch (error) {
        // Log error but keep default image
        console.error('Error loading profile image:', error);

        // Restore opacity even on error
        profileImage.style.opacity = '1';
    }
});

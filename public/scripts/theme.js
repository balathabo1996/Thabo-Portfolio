/**
 * Theme Toggle System
 * 
 * Manages dark/light theme switching for the portfolio website.
 * Saves user preference to localStorage and respects system preferences.
 * 
 * @file theme.js
 * @requires DOM
 * @requires localStorage
 */

// Get DOM elements
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

/**
 * Set Theme
 * 
 * Updates the theme for the entire application by setting the data-theme
 * attribute on the root HTML element. Saves preference to localStorage.
 * 
 * @param {string} theme - Theme to apply ('dark' or 'light')
 */
function setTheme(theme) {
    // Update data-theme attribute (CSS variables respond to this)
    rootElement.setAttribute('data-theme', theme);

    // Save preference to localStorage for persistence
    localStorage.setItem('theme', theme);

    // Update icon if needed
    updateIcon(theme);
}

/**
 * Update Icon
 * 
 * Placeholder function for icon updates.
 * Actual icon colors are handled via CSS filter: invert() in styles.css.
 * This function can be extended if custom icon logic is needed.
 * 
 * @param {string} theme - Current theme ('dark' or 'light')
 */
function updateIcon(theme) {
    // Icons are handled by CSS filters now (invert for Dark Mode)
    // This function is kept for potential future enhancements
}

// ========================================
// Theme Initialization
// ========================================

/**
 * Step 1: Check for saved user preference in localStorage
 * @type {string|null}
 */
const savedTheme = localStorage.getItem('theme');

/**
 * Step 2: Check for system preference (OS Dark Mode setting)
 * Uses the prefers-color-scheme media query
 * @type {string}
 */
const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

/**
 * Step 3: Initialize Theme
 * Priority: Saved preference > System preference > Default (dark)
 */
if (savedTheme) {
    // Use saved preference if available
    setTheme(savedTheme);
} else {
    // Otherwise, use system preference
    setTheme(systemPreference);
}

// ========================================
// Event Listeners
// ========================================

/**
 * Step 4: Add click event listener to theme toggle button
 * Toggles between dark and light themes when clicked
 */
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // Get current theme
        const currentTheme = rootElement.getAttribute('data-theme');

        // Toggle between light and dark
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Apply new theme
        setTheme(newTheme);
    });
}

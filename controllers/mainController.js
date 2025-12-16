/**
 * Main Controller
 * 
 * Handles all page navigation routes and serves static HTML pages.
 * Also manages resume download functionality from MongoDB.
 * 
 * @module mainController
 * @requires path
 * @requires ../models/resume
 */

const path = require('path');

/**
 * Controller Functions
 * These handle specific route requests and return appropriate HTML pages.
 */

/**
 * Get Home Page
 * Serves the main landing page (index.html)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getHome = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
};

/**
 * Get About Page
 * Serves the about page with professional background and experience
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAbout = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'about.html'));
};

/**
 * Get Contact Page
 * Serves the contact form page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContact = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'contact.html'));
};

/**
 * Get Portfolio Page
 * Serves the portfolio page showcasing projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPortfolio = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'portfolio.html'));
};

/**
 * Handles Resume Download
 * Fetches the resume PDF file directly from the MongoDB database
 * and streams it to the user's browser.
 */
exports.getResume = async (req, res) => {
    try {
        // Import the Resume model locally to this function
        const Resume = require('../models/resume');

        // Fetch the single resume document
        const resume = await Resume.findOne();

        if (!resume) {
            return res.status(404).send('Resume not found');
        }

        // Set headers to indicate a PDF file download
        res.contentType(resume.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${resume.name}"`);

        // Send the binary data
        res.send(resume.data);
    } catch (err) {
        console.error('Error fetching resume:', err);
        res.status(500).send('Server Error');
    }
};

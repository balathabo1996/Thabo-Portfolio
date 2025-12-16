/**
 * Main Routes
 * 
 * Defines all application routes including:
 * - Page navigation routes (home, about, contact, portfolio)
 * - Functional routes (resume download)
 * - API routes (profile management)
 * 
 * @module mainRoutes
 * @requires express
 * @requires ../controllers/mainController
 * @requires ../controllers/profileController
 */

const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const profileController = require('../controllers/profileController');

// ========================================
// Page Navigation Routes
// ========================================

/**
 * @route GET /
 * @description Serves the home page
 * @access Public
 */
router.get('/', mainController.getHome);

/**
 * @route GET /about
 * @description Serves the about page
 * @access Public
 */
router.get('/about', mainController.getAbout);

/**
 * @route GET /contact
 * @description Serves the contact page
 * @access Public
 */
router.get('/contact', mainController.getContact);

/**
 * @route GET /portfolio
 * @description Serves the portfolio page
 * @access Public
 */
router.get('/portfolio', mainController.getPortfolio);

// ========================================
// Functional Routes
// ========================================

/**
 * @route GET /resume
 * @description Downloads the resume PDF from MongoDB
 * @access Public
 */
router.get('/resume', mainController.getResume);

// ========================================
// API Routes
// ========================================

/**
 * @route GET /api/profile
 * @description Fetches profile data from MongoDB
 * @access Public
 * @returns {Object} Profile data including image URL, name, title, bio
 */
router.get('/api/profile', profileController.getProfile);

/**
 * @route PUT /api/profile
 * @description Updates profile data in MongoDB
 * @access Public (should be protected in production)
 * @body {Object} Profile fields to update
 * @returns {Object} Success message and updated profile
 */
router.put('/api/profile', profileController.updateProfile);

module.exports = router;

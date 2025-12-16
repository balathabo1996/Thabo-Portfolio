// Import required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Import routes
const mainRoutes = require('./routes/mainRoutes');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Database Connection
 * Connects to MongoDB using the URI from environment variables.
 * Specifies the database name to ensure correct collection targeting.
 */
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB
})
    .then(() => console.log('MongoDB Connected successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));

/**
 * Middleware Configuration
 * Serve static files (HTML, CSS, JS, Images) from the 'public' directory
 * Parse JSON request bodies for API endpoints
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Register Routes
app.use('/', mainRoutes);

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

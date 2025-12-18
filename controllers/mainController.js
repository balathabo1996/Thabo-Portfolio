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
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            message: "Welcome to Thabo's Portfolio",
            role: "Infrastructure Engineer | IT Solutions Student",
            links: {
                about: "/about",
                portfolio: "/portfolio",
                contact: "/contact",
                resume: "/resume"
            }
        });
    }
    res.render('index');
};

/**
 * Get About Page
 * Serves the about page with professional background and experience
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAbout = (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            name: "Balachandran Thabotharan",
            title: "Infrastructure Engineer",
            bio: "IT professional with hands-on experience in system administration, infrastructure engineering, and web application development.",
            skills: ["Windows Server", "Hyper-V", "VMware", "Node.js", "Express", "MongoDB", "Network Security"]
        });
    }
    res.render('about');
};

/**
 * Get Contact Page
 * Serves the contact form page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getContact = (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({
            email: "balathabo96@gmail.com",
            phone: "(437) 383-1996",
            linkedin: "https://www.linkedin.com/in/balachandran-thabotharan-261895131",
            github: "https://github.com/balathabo1996",
            location: "Scarborough, Ontario, Canada"
        });
    }
    res.render('contact');
};

/**
 * Get Portfolio Page
 * Serves the portfolio page showcasing projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPortfolio = (req, res) => {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json([
            {
                title: "Fleet Operations Management",
                description: "Managed fleet logistics, fuel tracking, and safety compliance. Optimized operational efficiency through data-driven reporting.",
                techStack: ["Fleet Mgmt Software", "Data Analysis", "Logistics"],
                features: ["Fuel Expense Analysis", "Safety Inspection Compliance", "Fleet Maintenance Scheduling"]
            },
            {
                title: "Enterprise Virtualization",
                description: "Designed and implemented scalable Windows-based infrastructure with high-availability virtualization.",
                techStack: ["Windows Server", "Hyper-V", "VMware"],
                features: ["Active Directory", "Server Hardening", "High Availability"]
            },
            {
                title: "Secure Web Framework",
                description: "Developed a robust web application backend with integrated security protocols and RESTful APIs.",
                techStack: ["Node.js", "Express", "MongoDB"],
                features: ["Secure Authentication (JWT)", "Database Optimization", "API Rate Limiting"]
            },
            {
                title: "Disaster Recovery System",
                description: "Engineered a comprehensive backup and disaster recovery strategy ensuring 99.9% data availability.",
                techStack: ["PowerShell", "Security", "Automation"],
                features: ["Automated Backup Scripts", "Risk Assessment", "Compliance Documentation"]
            },
            {
                title: "IT Service & Support",
                description: "Delivering exceptional technical support and customer service, resolving complex IT issues.",
                techStack: ["ServiceNow", "Jira", "Communication"],
                features: ["Incident Management", "Technical Troubleshooting", "User Training"]
            },
            {
                title: "FoodEarth",
                description: "A comprehensive MVC web application addressing decision fatigue in the kitchen.",
                techStack: ["Node.js", "Express", "MongoDB", "Handlebars"],
                features: ["Interactive Meal Planner", "Secure Authentication", "Recipe Management"],
                link: "https://food-earth.vercel.app/"
            }
        ]);
    }
    res.render('portfolio');
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
        res.setHeader('Content-Disposition', `inline; filename="${resume.name}"`);

        // Send the binary data
        res.send(resume.data);
    } catch (err) {
        console.error('Error fetching resume:', err);
        res.status(500).send('Server Error');
    }
};

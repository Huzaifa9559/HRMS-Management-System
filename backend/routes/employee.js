const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { createAccount } = require('../controllers/employeeController'); // Adjusted for CommonJS

// Creating routes
router.post('/create-account', createAccount);

// Export the router
module.exports = router; // Export the router
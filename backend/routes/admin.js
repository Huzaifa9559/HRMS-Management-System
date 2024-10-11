const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { inviteEmployee } = require('../controllers/adminController'); // Adjusted for CommonJS

// Creating routes
router.post('/invite-new-employee', inviteEmployee);
// Export the router
module.exports = router; // Export the router
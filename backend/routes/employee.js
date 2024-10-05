const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { createAccount, login, forgotPassword, resetPassword } = require('../controllers/employeeController'); // Adjusted for CommonJS

// Creating routes
router.post('/create-account', createAccount);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);  //send reset link
router.post('/set-new-password', resetPassword);  // sets new password

// Export the router
module.exports = router; // Export the router
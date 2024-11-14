const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { createAccount, login, forgotPassword, resetPassword, getDepartmentandDesignation } =
    require('../controllers/employeeController');

// Creating routes
router.post('/create-account', createAccount);

module.exports = router; // Export the router
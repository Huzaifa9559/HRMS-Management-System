const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { employeeController } =
    require('../controllers/employeeController');

// Creating routes
router.post('/create-account', employeeController.createAccount);
router.post('/login', employeeController.login);
router.post('/forgot-password', employeeController.forgotPassword);  //send reset link
router.post('/set-new-password', employeeController.resetPassword);  // sets new password
router.get('/get-designations-and-departments', employeeController.getDepartmentandDesignation);

module.exports = router; // Export the router
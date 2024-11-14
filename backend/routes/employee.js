const express = require('express'); // Import express
const router = express.Router(); // Create a router instance

// Import the specific controller
const { createAccount, login, forgotPassword, resetPassword,
    DepartmentandDesignation, EmployeeDetailsById,
    LeaveDetailsById, createLeaveRequest } =
    require('../controllers/employeeController');

// Creating routes
router.post('/create-account', createAccount);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);  //send reset link
router.post('/set-new-password', resetPassword);  // sets new password



//these should be protected
router.get('/designations-and-departments', DepartmentandDesignation);
router.get('/employee', EmployeeDetailsById);
router.get('/leave-details', LeaveDetailsById);
router.post('/leave-request', createLeaveRequest);

module.exports = router; // Export the router
const express = require('express'); // Import express
const leave = express.Router(); // Create a router instance

const { LeaveDetailsById, createLeaveRequest } =
    require('../controllers/leave');


leave.get('/leave-details', LeaveDetailsById);
leave.post('/leave-request', createLeaveRequest);

module.exports = leave; // Export the router
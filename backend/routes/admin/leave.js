const express = require('express'); // Import express
const leave = express.Router(); // Create a router instance

const {getAllEmployeesLeaveDetails  } =
    require('../../controllers/leave');


leave.get('/',getAllEmployeesLeaveDetails );

module.exports = leave; // Export the router
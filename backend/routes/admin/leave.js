const express = require('express'); // Import express
const leave = express.Router(); // Create a router instance

const { getAllEmployeesLeaveDetails, getLeaveDetail, getLeaveStats,
    acceptLeave,rejectLeave 
  } =
    require('../../controllers/leave');


leave.get('/', getAllEmployeesLeaveDetails);
leave.get('/:id',getLeaveDetail );
leave.get('/stats/:id', getLeaveStats);
leave.post('/accept/:id', acceptLeave);
leave.post('/reject/:id',rejectLeave );

module.exports = leave; // Export the router
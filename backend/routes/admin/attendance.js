const express = require('express'); // Import express
const attendance = express.Router(); // Create a router instance
// Import the specific controller
const { getEmployeeAttendanceRecords, getEmployeeAttendanceRecord,
    createNewAttendance, updateEmployeeAttendance } =
    require('../../controllers/attendance');

attendance.get('/all', getEmployeeAttendanceRecords);
attendance.get('/', getEmployeeAttendanceRecord);

module.exports = attendance;
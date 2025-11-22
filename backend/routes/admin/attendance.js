const express = require('express'); // Import express
const attendance = express.Router(); // Create a router instance
// Import the specific controller
const {
  Attendance_Main_Dashboard,
  viewAttendance,
  viewEmployeeAttendanceRecords,
  viewAttendanceStats,
} = require('../../controllers/attendance');

attendance.get('/view-attendance/:departmentId', viewAttendance);
attendance.get('/', Attendance_Main_Dashboard);
attendance.get(
  '/employee-attendance/:employeeId',
  viewEmployeeAttendanceRecords
);
attendance.get('/stats/:employeeId', viewAttendanceStats);

module.exports = attendance;

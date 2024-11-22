const express = require('express');
const router = express.Router();

// Import individual route files
const announcementsRoutes = require('./announcements');
const attendanceRoutes = require('./attendance');
const departmentRoutes = require('./department');
const designationRoutes = require('./designation');
const employeeRoutes = require('./employee');
const leaveRoutes = require('./leave');
const myDocumentsRoutes = require('./myDocuments');
const workScheduleRoutes = require('./workschedule');
const paySlipsRoutes = require('./payslips');
// Use the routes
router.use('/announcements', announcementsRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/department', departmentRoutes);
router.use('/designation', designationRoutes);
router.use('/employee', employeeRoutes);
router.use('/leave', leaveRoutes);
router.use('/my-documents', myDocumentsRoutes);
router.use('/work-schedule', workScheduleRoutes);
router.use('/payslips', paySlipsRoutes);

module.exports = router;

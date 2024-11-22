'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate an array of attendance records
    const attendanceRecords = [];
    for (let i = 1; i <= 20; i++) {
      attendanceRecords.push({
        attendance_date: new Date(2023, 10, i),
        attendance_status: Math.random() < 0.5,
        attendance_clockIn: '09:00:00',
        attendance_clockOut: '17:00:00',
        attendance_breakIn: '12:00:00',
        attendance_breakOut: '12:30:00',
        attendance_workingHours: 8,
        attendance_totalBreak: 30,
        employeeID: (i % 3)
      });
    }

    // Insert the records into the Attendance table
    await queryInterface.bulkInsert('Attendance', attendanceRecords, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all records from the Attendance table
    await queryInterface.bulkDelete('Attendance', null, {});
  }
};

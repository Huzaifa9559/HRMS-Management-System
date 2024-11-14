'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Attendance (
    attendanceID INT PRIMARY KEY AUTO_INCREMENT,
    attendance_date DATE NOT NULL,
    attendance_status BOOLEAN NOT NULL,
    attendance_clockIn TIME NOT NULL,
    attendance_clockOut TIME NOT NULL,
    attendance_breakIn TIME NOT NULL,
    attendance_breakOut TIME NOT NULL,
    attendance_workingHours TIME,
    attendance_totalBreak TIME
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Attendance;`);
  }
};


//  time --->  HH:MM:SS format

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Attendance (
      attendanceID INT PRIMARY KEY AUTO_INCREMENT,
      attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
      attendance_status BOOLEAN DEFAULT 0,
      attendance_clockIn TIME NOT NULL DEFAULT CURRENT_TIME,
      attendance_clockOut TIME DEFAULT NULL,
      attendance_breakIn TIME DEFAULT NULL,
      attendance_breakOut TIME DEFAULT NULL,
      attendance_workingHours INT UNSIGNED DEFAULT 0,
      attendance_totalBreak INT UNSIGNED DEFAULT 0
    );
 `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Attendance;`);
  }
};


//  time --->  HH:MM:SS format

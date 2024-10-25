'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Attendance (
    attendanceID INT PRIMARY KEY AUTO_INCREMENT,
    employeeID INT,
    attendance_date DATE NOT NULL,
    attendance_status BOOLEAN,
    attendance_clockIn TIME,
    attendance_clockOut TIME,
    attendance_breakIn TIME,
    attendance_breakOut TIME,
    attendance_workingHours TIME,
    attendance_totalBreak TIME,
    CONSTRAINT AEK FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Attendance;`);
  }
};


//  time --->  HH:MM:SS format

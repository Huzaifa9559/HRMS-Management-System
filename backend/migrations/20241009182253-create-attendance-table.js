'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Attendance (
    AttendanceID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    Date DATE NOT NULL,
    Status BOOLEAN,
    Clock_In TIME,
    Clock_Out TIME,
    Break_In TIME,
    Break_Out TIME,
    Working_Hours TIME,
    Total_Break TIME,
    CONSTRAINT AEK FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Attendance;`);
  }
};


//  time --->  HH:MM:SS format

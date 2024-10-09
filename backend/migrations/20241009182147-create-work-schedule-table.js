'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Work_Schedule (
    ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
    Day VARCHAR(50),
    EmployeeID INT,
    Start_time TIME,
    End_time TIME,
    Place VARCHAR(50),
    CONSTRAINT WEK FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Work_Schedule;`);
  }
};

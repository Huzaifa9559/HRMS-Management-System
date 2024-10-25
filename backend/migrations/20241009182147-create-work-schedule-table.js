'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Work_Schedule (
    scheduleID INT PRIMARY KEY AUTO_INCREMENT,
    schedule_day VARCHAR(50),
    employeeID INT,
    schedule_startTime TIME,
    schedule_endTime TIME,
    schedule_place VARCHAR(50),
    CONSTRAINT WEK FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Work_Schedule;`);
  }
};

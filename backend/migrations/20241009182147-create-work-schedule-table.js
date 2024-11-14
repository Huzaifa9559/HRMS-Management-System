'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Work_Schedule (
    scheduleID INT PRIMARY KEY AUTO_INCREMENT,
    schedule_day VARCHAR(50),
    schedule_startTime TIME,
    schedule_endTime TIME
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Work_Schedule;`);
  }
};

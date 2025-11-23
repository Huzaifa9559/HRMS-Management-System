'use strict';
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Work_Schedule (
    scheduleID INT PRIMARY KEY AUTO_INCREMENT,
    schedule_day VARCHAR(50),
    schedule_startTime TIME,
    schedule_endTime TIME,
    schedule_month VARCHAR(20),
    schedule_worktype VARCHAR(20) CHECK (schedule_worktype IN ('onsite', 'remote'))
    );
`);
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Work_Schedule;`);
  },
};

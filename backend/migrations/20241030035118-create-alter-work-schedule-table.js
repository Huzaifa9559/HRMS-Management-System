'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    ALTER TABLE Work_Schedule
    ADD COLUMN work_type_ID INT;
    
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE Work_Schedule
      DROP COLUMN work_type_ID;`);
  }
};

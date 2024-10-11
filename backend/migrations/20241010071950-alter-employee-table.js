'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    ALTER TABLE Employee
    ADD COLUMN status TINYINT(1) DEFAULT 0;
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE Employee
      DROP COLUMN status;`);
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE Documents 
      MODIFY COLUMN document_fileName VARCHAR(500);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE Documents 
      MODIFY COLUMN document_fileName VARCHAR(50);
    `);
  },
};


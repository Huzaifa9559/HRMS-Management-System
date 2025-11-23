'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    // Change the column's data type to TEXT using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE Announcement
      MODIFY COLUMN announcement_description TEXT;
    `);
  },

  down: async (queryInterface, _Sequelize) => {
    // Revert the column's data type back to VARCHAR(255) using raw SQL
    await queryInterface.sequelize.query(`
      ALTER TABLE Announcement
      MODIFY COLUMN announcement_description VARCHAR(255);
    `);
  },
};

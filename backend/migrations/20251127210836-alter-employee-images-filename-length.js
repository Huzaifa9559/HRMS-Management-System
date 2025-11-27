'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE employee_images 
      MODIFY COLUMN employee_image_fileName VARCHAR(500);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE employee_images 
      MODIFY COLUMN employee_image_fileName VARCHAR(50);
    `);
  },
};


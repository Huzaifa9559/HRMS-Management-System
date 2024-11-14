'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const designations = [
      { designation_name: 'Manager' },
      { designation_name: 'Developer' },
      { designation_name: 'Analyst' }
    ];

    await queryInterface.bulkInsert('designation', designations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('designation', null, {});
  }
}; 
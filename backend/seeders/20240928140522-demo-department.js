'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const departments = [
      { department_name: 'HR' },
      { department_name: 'Engineering' },
      { department_name: 'Marketing' }
    ];

    await queryInterface.bulkInsert('department', departments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('department', null, {});
  }
}; 
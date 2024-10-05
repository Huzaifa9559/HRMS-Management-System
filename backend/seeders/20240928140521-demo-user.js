'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add seed commands here
    await queryInterface.bulkInsert('employees', [{
      employeeName: 'John Doe',
      phoneNumber: '1234567890',
      address: '123 Main St, Anytown, USA',
      password: 'hashed_password_1', // Use a hashed password in a real application
      designation: 'Software Engineer',
      department: 'Engineering',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      employeeName: 'Jane Smith',
      phoneNumber: '0987654321',
      address: '456 Elm St, Othertown, USA',
      password: 'hashed_password_2', // Use a hashed password in a real application
      designation: 'Product Manager',
      department: 'Product',
      email: 'janesmith@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Add commands to revert seed here
    await queryInterface.bulkDelete('employees', null, {});
  }
};
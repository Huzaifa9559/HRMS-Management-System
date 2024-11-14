'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const employees = [];
    const saltRounds = 10;

    for (let i = 0; i < 25; i++) {

      const hashedPassword = await bcrypt.hash(`Password@123`, 10);
      const employee = {
        employeeID: i,
        employee_first_name: `FirstName${i}`,
        employee_last_name: `LastName${i}`,
        employee_email: `employee${i}@nu.edu.pk`,
        employee_password: hashedPassword,
        employee_DOB: new Date(1990, i % 12, i % 28 + 1), // Example DOB
        employee_phonenumber: `123456789${i}`,
        departmentID: 13,
        designationID: 14,
        address_ID: 19, // Assuming address_ID is a foreign key
        employee_status: 'active', // Example status
        employee_joining_date: new Date(2020, i % 12, i % 28 + 1) // Example joining date
      };
      employees.push(employee);
    }

    try {
      await queryInterface.bulkInsert('employee', employees, {});
    } catch (error) {
      console.error('Error inserting employees:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee', null, {});
  }
};
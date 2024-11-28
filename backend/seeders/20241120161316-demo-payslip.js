'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Inserting 10 payslip records
    const payslips = [];
    for (let i = 1; i <= 10; i++) {
      payslips.push({
        payslip_monthName: `Month ${i}`,
        payslip_receiveDate: new Date(2023, i - 1, 15), // 15th of each month
        payslip_year: 2024,
        payslip_fileName: `doc${i}.pdf`,
        employeeID: (i % 6) + 1
      });
    }
    await queryInterface.bulkInsert('Payslip', payslips, {});
  },

  async down(queryInterface, Sequelize) {
    // Reverting the seed by deleting the inserted records
    await queryInterface.bulkDelete('Payslip', null, {});
  }
};

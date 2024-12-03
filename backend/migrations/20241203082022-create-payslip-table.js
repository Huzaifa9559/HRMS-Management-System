'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Payslip(
    payslipID INT PRIMARY KEY AUTO_INCREMENT,
    payslip_monthName VARCHAR(50) NOT NULL,
    payslip_receiveDate DATE NOT NULL,
    payslip_year INT NOT NULL,
    payslip_fileName VARCHAR(255)
    );
`);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Payslip;`);
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Payslip(
    payslipID INT PRIMARY KEY AUTO_INCREMENT,
    payslip_monthName VARCHAR(50),
    employeeID INT,
    payslip_receiveDate DATE,
    payslip_documentURL VARCHAR(255),
    CONSTRAINT PEK FOREIGN KEY(employeeID) REFERENCES Employee(employeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Payslip;`);
  }
};
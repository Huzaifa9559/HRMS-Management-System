'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Payslip(
    PayslipID INT PRIMARY KEY AUTO_INCREMENT,
    Month_name VARCHAR(50),
    EmployeeID INT,
    Receive_Date DATE,
    Document_URL VARCHAR(255),
    CONSTRAINT PEK FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Payslip;`);
  }
};
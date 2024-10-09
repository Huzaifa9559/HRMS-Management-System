'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Contract (
    ContractID INT PRIMARY KEY AUTO_INCREMENT,
    Contract_Type ENUM('Full-Time', 'Part-Time', 'Internship', 'Contract'),
    EmployeeID INT,
    Sign_Status TINYINT(1),
    Receive_Date DATE,
    Document_URL VARCHAR(255),
    CONSTRAINT CEK FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Contract;`);
  }
};

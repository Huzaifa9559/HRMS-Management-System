'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Contract (
    contractID INT PRIMARY KEY AUTO_INCREMENT,
    contract_type ENUM('Full-Time', 'Part-Time', 'Internship', 'Contract'),
    employeeID INT,
    contract_signStatus TINYINT(1),
    contract_receiveDate DATE,
    contract_documentURL VARCHAR(255),
    CONSTRAINT CEK FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Contract;`);
  }
};

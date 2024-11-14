'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Contract (
    contractID INT PRIMARY KEY AUTO_INCREMENT,
    contract_type ENUM('Full-Time', 'Part-Time', 'Internship', 'Contract') NOT NULL,
    contract_signStatus TINYINT(1) NOT NULL,
    contract_receiveDate DATE NOT NULL
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Contract;`);
  }
};

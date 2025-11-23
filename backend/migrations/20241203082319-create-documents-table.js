'use strict';
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Documents (
        document_ID INT PRIMARY KEY AUTO_INCREMENT,
        document_type VARCHAR(100) NOT NULL,
        document_receiveDate DATE NOT NULL,
        document_fileName VARCHAR(50) NOT NULL,
        signature_status TINYINT(1) DEFAULT 0
    );
`);
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Documents;`);
  },
};

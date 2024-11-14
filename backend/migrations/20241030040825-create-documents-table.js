'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Documents (
        document_ID INT PRIMARY KEY AUTO_INCREMENT,
        document_type VARCHAR(100) NOT NULL,
        document_url VARCHAR(255) NOT NULL
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Documents;`);
  }
};

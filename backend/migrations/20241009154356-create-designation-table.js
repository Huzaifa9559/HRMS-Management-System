'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Designation (
    designationID INT PRIMARY KEY AUTO_INCREMENT,
    designation_name VARCHAR(50) NOT NULL
    );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Designation;`);
  }
};

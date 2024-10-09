'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY AUTO_INCREMENT,
    Designation_Name VARCHAR(50) NOT NULL
    );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Designation;`);
  }
};

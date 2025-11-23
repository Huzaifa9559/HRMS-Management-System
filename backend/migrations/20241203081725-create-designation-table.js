'use strict';
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Designation (
    designationID INT PRIMARY KEY AUTO_INCREMENT,
    designation_name VARCHAR(50) NOT NULL
    );
  `);
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Designation;`);
  },
};

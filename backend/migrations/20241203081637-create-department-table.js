'use strict';
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Department (
    departmentID INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(50) NOT NULL
    );
  `);
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Department;`);
  },
};

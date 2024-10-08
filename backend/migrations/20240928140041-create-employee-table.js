'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
     CREATE TABLE employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        phoneNumber VARCHAR(15) NOT NULL UNIQUE,
        address TEXT NOT NULL,
        password VARCHAR(255) NOT NULL,
        designation VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        email VARCHAR(255) NOT NULL UNIQUE
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE employees;`);
  }
};

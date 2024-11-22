'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Employee_Images (
    employeeImageID INT PRIMARY KEY AUTO_INCREMENT,
    employee_image_fileName VARCHAR(50),
    employeeID INT,
    FOREIGN KEY (employeeID) REFERENCES Employee(employeeID) ON DELETE CASCADE
    ON UPDATE CASCADE
    );


  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Employee_Images;`);
  }
};

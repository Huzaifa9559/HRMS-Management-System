'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Employee_Images (
    image_url_ID INT,
    employeeID INT,
    PRIMARY KEY (image_url_ID, employeeID),
    FOREIGN KEY (image_url_ID) REFERENCES Image_URLs(image_url_ID) ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (employeeID) REFERENCES Employee(employeeID) ON DELETE CASCADE
    ON UPDATE CASCADE
);


  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Employee_Images;`);
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    Title VARCHAR(50),
    Creation_Date DATE,
    Description VARCHAR(100),
    CONSTRAINT NEK FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Notification;`);
  }
};

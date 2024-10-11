'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Notification (
    notificationID INT PRIMARY KEY AUTO_INCREMENT,
    employeeID INT,
    notification_title VARCHAR(50),
    notification_creationDate DATE,
    notification_description VARCHAR(100),
    CONSTRAINT NEK FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Notification;`);
  }
};

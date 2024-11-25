'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Announcement (
    announcementID INT PRIMARY KEY AUTO_INCREMENT,
    announcement_title VARCHAR(100) NOT NULL,
    announcement_description VARCHAR(255),
    announcement_date DATE,
    departmentID INT,
    CONSTRAINT AnDK FOREIGN KEY (departmentID) REFERENCES Department(departmentID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Announcement;`);
  }
};

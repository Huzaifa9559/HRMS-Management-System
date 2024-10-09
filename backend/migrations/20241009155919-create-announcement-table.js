'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Announcement (
    AnnouncementID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(100),
    Description VARCHAR(255),
    DepartmentID INT,
    Image_URL VARCHAR(255),
    CONSTRAINT AnDK FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
  );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Announcement;`);
  }
};

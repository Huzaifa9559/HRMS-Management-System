'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Announcement (
    announcementID INT PRIMARY KEY AUTO_INCREMENT,
    announcement_title VARCHAR(100),
    announcement_description VARCHAR(255),
    departmentID INT,
    announcement_image_URL VARCHAR(255),
    CONSTRAINT AnDK FOREIGN KEY (departmentID) REFERENCES Department(departmentID)
  );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Announcement;`);
  }
};

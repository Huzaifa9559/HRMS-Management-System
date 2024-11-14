'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Announcement_Images (
    image_url_ID INT,
    announcementID INT,
    PRIMARY KEY (image_url_ID, announcementID),
    FOREIGN KEY (image_url_ID) REFERENCES Image_URLs(image_url_ID) ON DELETE CASCADE 
    ON UPDATE CASCADE,
    FOREIGN KEY (announcementID) REFERENCES Announcement(announcementID) ON DELETE CASCADE
    ON UPDATE CASCADE
);

  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Announcement_Images;`);
  }
};

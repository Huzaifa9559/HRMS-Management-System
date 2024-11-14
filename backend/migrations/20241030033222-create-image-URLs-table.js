'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Image_URLs (
        image_url_ID INT PRIMARY KEY AUTO_INCREMENT,
        image_type_ID INT,
        image_url VARCHAR(255),
        FOREIGN KEY (image_type_ID) REFERENCES Image_Types(image_type_ID)
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Image_URLs;`);
  }
};

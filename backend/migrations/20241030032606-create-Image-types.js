'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Image_Types (
      image_type_ID INT PRIMARY KEY AUTO_INCREMENT,
      image_type VARCHAR(50) CHECK (image_type IN ('front', 'back', 'profile',
      'announcement'))
    );
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Image_Types;`);
  }
};

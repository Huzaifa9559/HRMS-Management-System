'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
   CREATE TABLE Work_Type (
    work_type_ID INT PRIMARY KEY AUTO_INCREMENT,
    work_type VARCHAR(50) CHECK (work_type IN ('onsite', 'remote'))
  );

`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Work_Type;`);
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Department_Designation', [
      {
        departmentID: 1, 
        designationID: 1, 
      },
      {
        departmentID: 1,
        designationID: 2,
      },
      {
        departmentID: 2,
        designationID: 3,
      },
      {
        departmentID: 3,
        designationID: 1,
      },
      {
        departmentID: 3,
        designationID: 2,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Department_Designation', null, {});
  },
};

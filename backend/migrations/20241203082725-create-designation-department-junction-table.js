'use strict';
module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Department_Designation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    departmentID INT NOT NULL,
    designationID INT NOT NULL,
    CONSTRAINT fk_department FOREIGN KEY (departmentID) REFERENCES Department(departmentID) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_designation FOREIGN KEY (designationID) REFERENCES Designation(designationID) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE(departmentID, designationID) -- Prevent duplicate associations
    );
  `);
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Department_Designation;`);
  },
};

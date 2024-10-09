'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE \`Leave\`(
    LeaveID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    From_Date DATE,
    To_Date DATE,
    Reason VARCHAR(255),
    Type VARCHAR(100),
    Status TINYINT(1),
    CONSTRAINT LEK FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE \`Leave\`;`);
  }
};
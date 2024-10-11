'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE \`Leave\`(
    leaveID INT PRIMARY KEY AUTO_INCREMENT,
    employeeID INT,
    leave_fromDate DATE,
    leave_toDate DATE,
    leave_reason VARCHAR(255),
    leave_type VARCHAR(100),
    leave_status TINYINT(1),
    CONSTRAINT LEK FOREIGN KEY (employeeID) REFERENCES Employee(employeeID)
);
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE \`Leave\`;`);
  }
};
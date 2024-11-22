'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE \`Leave\`(
    leaveID INT PRIMARY KEY AUTO_INCREMENT,
    leave_fromDate DATE NOT NULL,
    leave_toDate DATE NOT NULL,
    leave_reason VARCHAR(255),
    leave_type ENUM('Medical','Unpaid','Paid') NOT NULL,
    leave_status TINYINT(1) NOT NULL CHECK (leave_status IN (0, 1, 2)),
    leave_filedOn DATE
);
`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE \`Leave\`;`);
  }
};
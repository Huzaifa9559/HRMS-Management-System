'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Employee (
    employeeID INT PRIMARY KEY,
    employee_first_name VARCHAR(100) NOT NULL,
    employee_last_name VARCHAR(100) NOT NULL,
    employee_email VARCHAR(50) NOT NULL,
    employee_password VARCHAR(100) NOT NULL,
    employee_DOB DATE,
    employee_phonenumber VARCHAR(20) NOT NULL,
    departmentID INT,
    designationID INT,
    address_ID INT,
    employee_status TINYINT(1) DEFAULT 0,
    employee_joining_date DATE,
    CONSTRAINT Department FOREIGN KEY (departmentID) REFERENCES Department(departmentID),
    CONSTRAINT Designation FOREIGN KEY (designationID) REFERENCES Designation(designationID),
    CONSTRAINT Address FOREIGN KEY (address_ID) REFERENCES Address(address_ID),
    CONSTRAINT email UNIQUE (employee_email)
    );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Employee;`);
  }
};

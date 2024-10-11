'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Employee (
    employeeID INT PRIMARY KEY AUTO_INCREMENT,
    employee_name VARCHAR(100) NOT NULL,
    employee_DOB DATE,
    employee_phonenumber VARCHAR(20) NOT NULL,
    departmentID INT,
    designationID INT,
    employee_address VARCHAR(255) NOT NULL,
    employee_state VARCHAR(100),
    employee_city VARCHAR(100),
    employee_country VARCHAR(100),
    employee_joiningdate DATE,
    employee_salary DECIMAL(10, 2),
    employee_identity_card_back_URL VARCHAR(255),
    employee_identity_card_front_URL VARCHAR(255),
    employee_profile_pic_URL VARCHAR(255),
    employee_postal_code INT,
    CONSTRAINT EDeK FOREIGN KEY (departmentID) REFERENCES Department(departmentID),
    CONSTRAINT EDK FOREIGN KEY (designationID) REFERENCES Designation(designationID)
    );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Employee;`);
  }
};

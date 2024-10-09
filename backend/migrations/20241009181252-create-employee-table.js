'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    DOB DATE NOT NULL,
    Phone_Number VARCHAR(20) NOT NULL,
    DepartmentID INT,
    DesignationID INT,
    Address VARCHAR(255),
    State VARCHAR(100),
    City VARCHAR(100),
    Country VARCHAR(100),
    Joining_Date DATE,
    Salary DECIMAL(10, 2),
    Identity_Card_Back_URL VARCHAR(255),
    Identity_Card_Front_URL VARCHAR(255),
    Profile_Pic_URL VARCHAR(255),
    Postal_Code INT,
    CONSTRAINT EDeK FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID),
    CONSTRAINT EDK FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID)
    );
  `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Employee;`);
  }
};

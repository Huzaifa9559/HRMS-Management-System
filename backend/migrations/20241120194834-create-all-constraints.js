'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const queries = [
      `ALTER TABLE \`Leave\`
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT leave_employee FOREIGN KEY (employeeID) 
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Payslip
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT payslip_employee FOREIGN KEY (employeeID) 
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Department
        ADD COLUMN address_ID INT,
        ADD CONSTRAINT department_address FOREIGN KEY (address_ID) 
        REFERENCES Address(address_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Notification
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT notification_employee FOREIGN KEY (employeeID) 
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Work_Schedule
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT workschedule_employee FOREIGN KEY (employeeID) 
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Attendance
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT attendance_employee FOREIGN KEY (employeeID) 
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`,

      `ALTER TABLE Documents
        ADD COLUMN employeeID INT,
        ADD CONSTRAINT documents_employee FOREIGN KEY (employeeID)
        REFERENCES Employee(employeeID)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`
    ];

    for (const query of queries) {
      await queryInterface.sequelize.query(query);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const queries = [
      `ALTER TABLE \`Leave\`
        DROP FOREIGN KEY leave_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Payslip 
        DROP FOREIGN KEY payslip_employee, 
        DROP COLUMN employeeID`,

      `ALTER TABLE Department 
        DROP FOREIGN KEY department_address, 
        DROP COLUMN address_ID;`,

      `ALTER TABLE Notification 
        DROP FOREIGN KEY notification_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Work_Schedule 
        DROP FOREIGN KEY workschedule_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Attendance 
        DROP FOREIGN KEY attendance_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Documents
        DROP FOREIGN KEY documents_employee, 
        DROP COLUMN employeeID;`

    ];

    for (const query of queries) {
      await queryInterface.sequelize.query(query);
    }
  }
};

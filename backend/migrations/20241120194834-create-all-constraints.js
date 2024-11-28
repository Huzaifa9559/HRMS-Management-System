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
        ON UPDATE CASCADE;`,
      
      `ALTER TABLE Employee
       ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`,
    
       `ALTER TABLE Attendance
       ADD CONSTRAINT unique_employee_attendance UNIQUE (employeeID, attendance_date);`
    
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

      `ALTER TABLE Work_Schedule 
        DROP FOREIGN KEY workschedule_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Attendance 
        DROP FOREIGN KEY attendance_employee, 
        DROP COLUMN employeeID;`,

      `ALTER TABLE Documents
        DROP FOREIGN KEY documents_employee, 
        DROP COLUMN employeeID;`,
      
      `ALTER TABLE Employee
       DROP COLUMN last_updated;`,
      
      `ALTER TABLE Attendance
       DROP CONSTRAINT unique_employee_attendance;`

    ];

    for (const query of queries) {
      await queryInterface.sequelize.query(query);
    }
  }
};

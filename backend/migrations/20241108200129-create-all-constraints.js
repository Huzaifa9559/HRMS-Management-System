'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Leave\`
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT leave_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Payslip
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT payslip_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Payslip
      ADD COLUMN document_ID INT,
      ADD CONSTRAINT payslip_document FOREIGN KEY (document_ID) 
      REFERENCES Documents(document_ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Contract
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT contract_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Contract
      ADD COLUMN document_ID INT,
      ADD CONSTRAINT contract_document FOREIGN KEY (document_ID) 
      REFERENCES Documents(document_ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Department
      ADD COLUMN address_ID INT,
      ADD CONSTRAINT department_address FOREIGN KEY (address_ID) 
      REFERENCES Address(address_ID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Notification
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT notification_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Work_Schedule
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT workschedule_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Attendance
      ADD COLUMN employeeID INT,
      ADD CONSTRAINT attendance_employee FOREIGN KEY (employeeID) 
      REFERENCES Employee(employeeID)
      ON DELETE CASCADE
      ON UPDATE CASCADE;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Leave\`
      ADD COLUMN leave_filedOn DATE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Leave\` 
      DROP FOREIGN KEY leave_employee, 
      DROP COLUMN employeeID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Payslip 
      DROP FOREIGN KEY payslip_employee, 
      DROP COLUMN employeeID,
      DROP FOREIGN KEY payslip_document,
      DROP COLUMN document_ID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Contract 
      DROP FOREIGN KEY contract_employee, 
      DROP COLUMN employeeID,
      DROP FOREIGN KEY contract_document,
      DROP COLUMN document_ID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Department 
      DROP FOREIGN KEY department_address, 
      DROP COLUMN address_ID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Notification 
      DROP FOREIGN KEY notification_employee, 
      DROP COLUMN employeeID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Work_Schedule 
      DROP FOREIGN KEY workschedule_employee, 
      DROP COLUMN employeeID;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE Attendance 
      DROP FOREIGN KEY attendance_employee, 
      DROP COLUMN employeeID;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE \`Leave\`
      DROP COLUMN leave_filedOn;
    `);
  }
};

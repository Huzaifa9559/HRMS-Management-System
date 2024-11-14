'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const leaveRecords = [];

    for (let i = 0; i < 15; i++) {
      const leaveRecord = {
        leaveID: i + 1,
        leave_fromDate: new Date(2024, i % 12, (i % 28) + 2),
        leave_toDate: new Date(2024, i % 12, (i % 28) + 5),
        leave_reason: `Reason for leave ${i + 1}`,
        leave_type: i % 2 === 0 ? 'Sick Leave' : 'Vacation',
        leave_status: i % 2 === 0 ? 'Approved' : 'Pending',
        employeeID: i % 2, // Assuming employeeID is a foreign key and there are at least 5 employees
        leave_filedOn: new Date(2024, i % 12, (i % 28) + 1)
      };
      leaveRecords.push(leaveRecord);
    }

    try {
      await queryInterface.bulkInsert('Leave', leaveRecords, {});
    } catch (error) {
      console.error('Error inserting leave records:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Leave', null, {});
  }
};

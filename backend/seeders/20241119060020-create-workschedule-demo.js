'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const workSchedules = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const workTypes = ['onsite', 'remote'];

    for (let i = 0; i < 30; i++) {
      const day = days[i % days.length]; // Cycle through the days of the week
      const workType = workTypes[i % workTypes.length]; // Cycle through work types
      const startHour = 9 + (i % 3); // Vary start time between 9 AM and 11 AM
      const endHour = startHour + 8; // 8-hour workday
      const weekNumber = Math.floor(i / 7) + 1; // Calculate week number (1-5 for 30 days)

      workSchedules.push({
        schedule_day: day,
        schedule_month: (i % 2 === 0 ? "January" : "March"),
        schedule_startTime: `${startHour.toString().padStart(2, '0')}:00:00`,
        schedule_endTime: `${endHour.toString().padStart(2, '0')}:00:00`,
        schedule_worktype: workType,
        employeeID: (i % 3) + 1, // Random employee ID between 1 and 100
        schedule_week: weekNumber, // Add week number for better testing
      });
    }

    await queryInterface.bulkInsert('work_schedule', workSchedules);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('work_schedule', null, {});
  }
};
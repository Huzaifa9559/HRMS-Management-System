'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Prepare an array to hold the announcements
    const announcements = [];

    // Using a for loop to create 10 announcement records
    for (let i = 1; i <= 10; i++) {
      announcements.push({
        announcement_title: `Announcement ${i}`,
        announcement_description: `Description for announcement ${i}`,
        announcement_date: new Date(),
        departmentID: (i % 3) + 1 // Example: Assigning department IDs in pairs
      });
    }

    // Inserting the announcements into the database
    await queryInterface.bulkInsert('Announcement', announcements, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove the inserted announcements
    await queryInterface.bulkDelete('Announcement', null, {});
  }
};

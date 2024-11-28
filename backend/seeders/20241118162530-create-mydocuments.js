'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding seed commands to insert document records using a for loop
    const documentTypes = [
      'Type A', 'Type B', 'Type C', 'Type D', 'Type E',
      'Type F', 'Type G', 'Type H', 'Type I', 'Type J',
      'Type K', 'Type L', 'Type M', 'Type N', 'Type O',
      'Type P', 'Type Q', 'Type R', 'Type S', 'Type T'
    ];

    const documents = [];
    for (let i = 0; i < documentTypes.length; i++) {
      documents.push({
        document_type: documentTypes[i],
        document_receiveDate: new Date(),
        document_fileName: `doc${i}.pdf`,
        employeeID: (i % 6) + 1, // Cycle through employee IDs 1, 2, 3
      });
    }

    await queryInterface.bulkInsert('Documents', documents, {});
  },

  async down(queryInterface, Sequelize) {
    // Reverting the seed by deleting all records
    await queryInterface.bulkDelete('Documents', null, {});
  }
};

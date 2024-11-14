'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const addresses = [
            { street_address: '123 Main St', city: 'Anytown', state: 'CA', zip_code: '12345', country: 'United States' },
            { street_address: '456 Elm St', city: 'Othertown', state: 'NY', zip_code: '67890', country: 'United States' },
            { street_address: '789 Oak St', city: 'Sometown', state: 'TX', zip_code: '11223', country: 'United States' }
        ];

        await queryInterface.bulkInsert('address', addresses, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('address', null, {});
    }
}; 
const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Designation = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

// Method to get designations
Designation.getDesignations = async () => {
    try {
        const query = 'SELECT designation_name FROM Designation';
        const designations = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return designations;
    } catch (error) {
        console.error('Error fetching designations:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Designation;
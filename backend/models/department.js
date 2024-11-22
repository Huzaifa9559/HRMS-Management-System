const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Department = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations


// Method to get departments
Department.getDepartments = async () => {
    try {
        const departments = await sequelize.query("SELECT department_name FROM Department", {
            type: Sequelize.QueryTypes.SELECT
        });
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Department;
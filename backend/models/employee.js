const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Employee = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Employee.insertEmployee = async function (employeeData) {
    const query = `
    INSERT INTO employee (employee_name, employee_phoneNumber, employee_address, designationID, departmentID)
    VALUES (?, ?, ?, 
        (SELECT designationID FROM designation WHERE designation_name = ?), 
        (SELECT departmentID FROM department WHERE department_name = ?)
    )`;
    try {
        await sequelize.query(query, {
            replacements: [employeeData.employeeName, employeeData.phoneNumber, employeeData.address,
            employeeData.designation, employeeData.department]
        });
    } catch (error) {
        console.error('Error inserting employee:', error);
        throw error;
    }
};

Employee.findByField = async function (field, value) {
    const query = `SELECT * FROM employee WHERE ${field} = ?`;
    try {
        const [results] = await sequelize.query(query, {
            replacements: [value]
        });
        return results[0] || null; // Return the first result or null if not found
    } catch (error) {
        console.error(`Error finding employee by ${field}:`, error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Employee.updatePassword = async function (id, hashedPassword) {
    const query = 'UPDATE employee SET employee_password = :password WHERE employeeID = :id';
    try {
        await sequelize.query(query, {
            replacements: { password: hashedPassword, id: id },
        });
    } catch (error) {
        console.error('Error updating password:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

// Method to get designations
Employee.getDesignations = async () => {
    try {
        const query = 'SELECT designation_name FROM designation';
        const designations = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return designations;
    } catch (error) {
        console.error('Error fetching designations:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

// Method to get departments
Employee.getDepartments = async () => {
    try {
        const departments = await sequelize.query("SELECT department_name FROM department", {
            type: Sequelize.QueryTypes.SELECT
        });
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Employee;
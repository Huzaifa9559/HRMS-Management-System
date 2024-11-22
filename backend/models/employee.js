const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Employee = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Employee.getEmployeeDetails = async function (employeeId) {
    const query = `
    SELECT e.employeeID,e.employee_first_name, e.employee_last_name, e.employee_email,
    e.employee_DOB, e.employee_phonenumber, d.department_name,
    des.designation_name,a.street_address, a.city,a.state,a.country,
    a.zip_code,e.employee_status,e.employee_joining_date
    FROM Employee e JOIN Department d ON e.departmentID=d.departmentID
    JOIN Designation des ON e.designationID=des.designationID
    JOIN Address a ON e.address_ID=a.address_ID
    WHERE e.employeeID=?;`;

    try {
        const [row] = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });
        return row; // Return leave record for the employee
    } catch (error) {
        console.error('Error fetching leave details:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

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

Employee.findEmployeeByField = async function (field, value) {
    const query = `SELECT * FROM Employee WHERE ${field} = ?`;
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


module.exports = Employee;


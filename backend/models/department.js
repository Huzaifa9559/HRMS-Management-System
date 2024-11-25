const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Department = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations


// Method to get departments
Department.getDepartments = async () => {
    try {
        const departments = await sequelize.query("SELECT departmentID,department_name FROM Department", {
            type: Sequelize.QueryTypes.SELECT
        });
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error; 
    }
};

Department.getallDepartmentDetails = async () => {
    const query =`
    SELECT
        d.departmentID AS id,
        d.department_name AS name,
        (SELECT COUNT(DISTINCT dd.designationID)
        FROM Department_Designation dd
        WHERE dd.departmentID = d.departmentID) AS designations,
        COUNT(DISTINCT CASE WHEN e.employee_status = 1 THEN e.employeeID ELSE NULL END) AS employees
    FROM 
        Department d
    LEFT JOIN 
        Employee e ON d.departmentID = e.departmentID
    GROUP BY 
        d.departmentID, d.department_name;
    `;
    try {
        const departments = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Department.createNewDepartment = async (name)=> {
    const query = `
    INSERT INTO Department (department_name)
    VALUES (?)`;

    try {
        await sequelize.query(query, {
            replacements: [name]
        });
    } catch (error) {
        console.error('Error creating attendance record:', error);
        throw error;
    }
}

Department.removeDepartment = async (name) => {
    const query1 = `
        UPDATE Employee
        SET 
            employee_status = 0, 
            designationID = NULL
        WHERE departmentID IN (
            SELECT departmentID 
            FROM Department 
            WHERE department_name = ?
        );`;

    const query2 = `
        DELETE FROM Department
        WHERE department_name=?;
    `;

    const transaction = await sequelize.transaction();
    try {
        // Update employee status
        await sequelize.query(query1, {
            replacements: [name],
            transaction
        });

        // Delete the department
        await sequelize.query(query2, {
            replacements: [name],
            transaction
        });

        // Commit the transaction
        await transaction.commit();
        console.log(`Department '${name}' and associated employee statuses updated successfully.`);
    } catch (error) {
        // Rollback the transaction on error
        await transaction.rollback();
        console.error('Error removing department:', error);
        throw error;
    }
};


module.exports = Department;
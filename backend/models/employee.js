const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Employee = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Employee.getEmployeeDetails = async function (employeeId) {
    const query = `
    SELECT e.employeeID,e.employee_first_name, e.employee_last_name, e.employee_email,
    CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS name,
    e.employee_DOB, e.employee_phonenumber, d.department_name,
    des.designation_name,a.street_address, a.city,a.state,a.country,
    a.zip_code,e.employee_status,e.employee_joining_date,i.employee_image_fileName AS employee_image
    FROM Employee e JOIN Department d ON e.departmentID=d.departmentID
    JOIN Designation des ON e.designationID=des.designationID
    JOIN Address a ON e.address_ID=a.address_ID
    LEFT JOIN employee_images i ON i.employeeID=e.employeeID
    WHERE e.employeeID=?;`;

    try {
        const [row] = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });
        return row; 
    } catch (error) {
        console.error('Error fetching details:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Employee.insertEmployee = async function (employeeData) {
    const query = `
    INSERT INTO employee (employee_name, employee_phoneNumber, designationID, departmentID,employee_status)
    VALUES (?, ?, ?, 
        (SELECT designationID FROM designation WHERE designation_name = ?), 
        (SELECT departmentID FROM department WHERE department_name = ?),1
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


Employee.getTotalNumberofEmployees = async function () {
    const query = `
    SELECT COUNT(*) AS total_count FROM Employee WHERE employee_status=1;`;

    try {
        const [row] = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return row;
    } catch (error) {
        console.error('Error fetching leave details:', error);
        throw error;
    }
};

Employee.getAllEmployees = async function () {
    const query = `
    SELECT e.employeeID AS id, CONCAT(e.employee_first_name, ' ', e.employee_last_name) AS name,
    d.department_name AS department, des.designation_name AS designation,e.employee_status AS status,
    e.employee_joining_date AS joiningDate,e.employee_email AS email,e.employee_last_name AS lastName,
    e.employee_first_name AS firstName,e.employee_phonenumber,e.employee_DOB,a.street_address,a.city,a.state,a.country,
    a.zip_code
    FROM Employee e
    JOIN Department d ON e.departmentID = d.departmentID
    JOIN Designation des ON e.designationID = des.designationID
    JOIN Address a ON e.address_ID = a.address_ID
    ORDER BY e.employeeID ASC;`;

    try {
        const rows = await sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT
        });
        return rows; // Return all employee details
    } catch (error) {
        console.error('Error fetching all employees:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Employee.updateEmployeeStatus=async function (id) {
    const query = `
    UPDATE Employee
    SET employee_status = CASE
        WHEN employee_status = 1 THEN 0
        ELSE 1
    END
    WHERE employeeID = ?`;


    try {
        const [row] = await sequelize.query(query, {
            replacements: [id]
        });
        return row; 
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Employee.deleteEmployeeById = async function (employeeId) {
    const query = `
    DELETE FROM Employee 
    WHERE employeeID = ?;
    `;
    
    try {
        const [result] = await sequelize.query(query, {
            replacements: [employeeId]
        });
        
        if (result.affectedRows === 0) {
            return null; // Return null if no rows were deleted (i.e., employee not found)
        }
        
        return true; // Return true if the employee was deleted successfully
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Employee.getEmployeeImageFileNameById = async function (employeeId) {
    const query = `
    SELECT employee_image_fileName AS imageFileName
    FROM employee_images
    WHERE employeeID = ?;
    `;

    try {
        const [row] = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });

        return row ? row.imageFileName : null; // Return the file name or null if not found
    } catch (error) {
        console.error('Error fetching employee image file name:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

Employee.createNewEmployee = async function () {
    const query = `
    Insert INTO Employee()`;


    try {
        const [row] = await sequelize.query(query, {
            type: Sequelize.QueryTypes.INSERT
        });
        return row; 
    } catch (error) {
        console.error(error);
        throw error;
    }
}

Employee.updateEmployeeById = async function (employeeId, updatedData) {
    // Start the transaction
    const t = await sequelize.transaction();
    
    try {
        // Step 1: Get the current address_ID from the Employee table within the transaction
        let addressID;
        const [employeeResult] = await sequelize.query(
            'SELECT address_ID FROM Employee WHERE employeeID = ?',
            {
                replacements: [employeeId],
                type: Sequelize.QueryTypes.SELECT,
                transaction: t // Using the transaction here
            }
        );
        
        addressID = employeeResult ? employeeResult.address_ID : null;

        // Step 2: If the address is updated, update the Address table
        if (updatedData.street_address || updatedData.city || updatedData.state || updatedData.zip_code) {
            // If the address is updated, use the existing addressID
            await sequelize.query(
                `UPDATE Address
                 SET street_address = ?, city = ?, state = ?, country = ?, zip_code = ?
                 WHERE address_ID = ?`,
                {
                    replacements: [
                        updatedData.street_address || '', 
                        updatedData.city || '', 
                        updatedData.state || '', 
                        updatedData.country || '', 
                        updatedData.zip_code || '',
                        addressID
                    ],
                    transaction: t // Using the transaction here
                }
            );
        }

        // Step 3: Get departmentID and designationID if needed
        let departmentID, designationID;
        if (updatedData.department_name) {
            const [departmentResult] = await sequelize.query(
                'SELECT departmentID FROM Department WHERE department_name = ?',
                {
                    replacements: [updatedData.department_name],
                    type: Sequelize.QueryTypes.SELECT,
                    transaction: t // Using the transaction here
                }
            );
            departmentID = departmentResult ? departmentResult.departmentID : null;
        }

        if (updatedData.employee_image) {
             await sequelize.query(
                `UPDATE employee_images
                SET employee_image_fileName=?
                WHERE employeeID=? `,
                {
                    replacements: [updatedData.employee_image,employeeId],
                    transaction: t // Using the transaction here
                }
            );
        }

        if (updatedData.designation_name) {
            const [designationResult] = await sequelize.query(
                'SELECT designationID FROM Designation WHERE designation_name = ?',
                {
                    replacements: [updatedData.designation_name],
                    type: Sequelize.QueryTypes.SELECT,
                    transaction: t 
                }
            );
            designationID = designationResult ? designationResult.designationID : null;
        }

        // Step 4: Update the Employee table with the new data
        const updateQuery = `
            UPDATE Employee
            SET 
                employee_first_name = ?, 
                employee_last_name = ?, 
                employee_email = ?, 
                employee_phonenumber = ?, 
                employee_status = ?, 
                employee_joining_date = ?, 
                departmentID = ?, 
                designationID = ?, 
                address_ID = ?
            WHERE employeeID = ?;
        `;

        const values = [
            updatedData.employee_first_name || '', 
            updatedData.employee_last_name || '', 
            updatedData.employee_email || '', 
            updatedData.employee_phonenumber || '', 
            updatedData.employee_status || 1, 
            updatedData.employee_joining_date || new Date(), 
            departmentID || null, 
            designationID || null, 
            addressID, // Use the existing or updated addressID
            employeeId
        ];

        const [result] = await sequelize.query(updateQuery, {
            replacements: values,
            transaction: t // Using the transaction here
        });

        // If everything is successful, commit the transaction
        await t.commit();

        // Return true if update was successful
        return result;
    } catch (error) {
        // If any query fails, rollback the transaction
        console.error('Error updating employee by ID:', error);
        await t.rollback(); // Rollback the transaction on error
        throw error; // Rethrow the error to be handled by the controller
    }
};


module.exports = Employee;


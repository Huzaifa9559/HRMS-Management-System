const { sequelize } = require('../config/sequelizeConfig');
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM
const Designation = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

// Method to get designations
Designation.getDesignations = async () => {
  try {
    const query = 'SELECT designation_name FROM Designation';
    const designations = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });
    return designations;
  } catch (error) {
    console.error('Error fetching designations:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Designation.getAllDesignationDetails = async (departmentId) => {
  const query = `
        SELECT 
            des.designation_name AS name,
            COUNT(DISTINCT CASE WHEN e.employee_status = 1 THEN e.employeeID ELSE NULL END) AS employees,
            DATE_FORMAT(MAX(e.last_updated), '%d %b %Y') AS lastUpdate
        FROM 
            Department_Designation dd
        INNER JOIN 
            Designation des ON dd.designationID = des.designationID
        LEFT JOIN 
            Employee e ON des.designationID = e.designationID AND e.departmentID = dd.departmentID
        WHERE 
            dd.departmentID = ?
        GROUP BY 
            des.designationID, des.designation_name
        ORDER BY 
            des.designation_name;
    `;

  try {
    const designations = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: [departmentId],
    });

    return designations;
  } catch (error) {
    console.error('Error fetching designations for department:', error);
    throw error;
  }
};

Designation.createNewDesignation = async (name, departmentID) => {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: Insert the new designation and retrieve the auto-generated ID
    const [result] = await sequelize.query(
      `
            INSERT INTO Designation (designation_name)
            VALUES (?);
            `,
      {
        replacements: [name],
        transaction,
      }
    );

    // Extract the auto-generated ID for the new designation
    const designationID = result.insertId || result[0]?.insertId || result; // Fallbacks based on result structure

    // Step 2: Insert the relationship into Department_Designation
    await sequelize.query(
      `
            INSERT INTO Department_Designation (departmentID, designationID)
            VALUES (?, ?);
            `,
      {
        replacements: [departmentID, designationID], // Pass departmentID and designationID correctly
        transaction,
      }
    );

    // Commit the transaction
    await transaction.commit();
    console.log(
      `Designation '${name}' created and associated with department ID ${departmentID} successfully.`
    );
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error(
      'Error creating designation and associating it with department:',
      error
    );
    throw error;
  }
};

module.exports = Designation;

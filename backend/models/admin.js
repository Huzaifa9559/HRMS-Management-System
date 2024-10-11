const { Sequelize } = require('sequelize');
const { sequelize } = require("../config/sequelizeConfig");

// Define the Admin model
const Admin = {};

// Static method to insert an admin into the database
Admin.insertAdmin = async function (adminData) {
    const query = `
        INSERT INTO admins (email, password)
        VALUES (?, ?)
    `;
    return await sequelize.query(query, {
        replacements: [adminData.email, adminData.password]
    });
};

// Static method to find an admin by email
Admin.findByEmail = async function (email) {
    const query = 'SELECT * FROM admins WHERE email = ?';
    const [results] = await sequelize.query(query, {
        replacements: [email]
    });
    return results[0]; // Return the first result
};

// Static method to update an admin's password
Admin.updatePassword = async function (id, hashedPassword) {
    const query = 'UPDATE admins SET password = :password WHERE id = :id';
    await sequelize.query(query, {
        replacements: { password: hashedPassword, id: id },
    });
};

//For fetching all employees
Admin.findAllEmployees = async ({ skip, limit }) => {
    try {
        const request = new sql.Request();
        const query = `
            SELECT * FROM employees
            ORDER BY employeeID
            OFFSET @skip ROWS
            FETCH NEXT @limit ROWS ONLY;
        `;
        const result = await request
            .input('skip', sql.Int, skip)
            .input('limit', sql.Int, limit)
            .query(query);

        return result.recordset; // Returns an array of employee records
    } catch (error) {
        console.error('Error fetching employees: ', error);
        throw error;
    }
};

// Count total employees in the database
Admin.countEmployees = async () => {
    try {
        const request = new sql.Request();
        const query = 'SELECT COUNT(*) AS total FROM employees';
        const result = await request.query(query);

        return result.recordset[0].total; // Returns the total number of employees
    } catch (error) {
        console.error('Error counting employees: ', error);
        throw error;
    }
};



module.exports = Admin;

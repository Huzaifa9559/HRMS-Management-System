const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT || 3306,
    });

// Define the Admin model
const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Ensure that email is unique
        validate: {
            isEmail: true // Validate email format
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // Password field is required
    }
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

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

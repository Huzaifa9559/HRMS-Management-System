const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize and DataTypes
const db = require('../db'); // Import the database connection
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_name, process.env.DB_user,
    process.env.DB_password, {
    host: process.env.DB_host,
    dialect: 'mysql', 
}); 

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    designation: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Static method to run raw SQL for DML (e.g., inserting an employee)
Employee.insertEmployee = async function (employeeData) {
    const query = `
        INSERT INTO employees (employeeName, phoneNumber, address, password, designation, department)
        VALUES (?, ?, ?, ?, ?, ?)`;
    return await sequelize.query(query, {
        replacements: [employeeData.employeeName, employeeData.phoneNumber, employeeData.address, employeeData.password, employeeData.designation, employeeData.department]
    });
};

// Static method to find an employee by ID using raw SQL
Employee.findById = async function (id) {
    const query = 'SELECT * FROM employees WHERE id = ?';
    const [results] = await sequelize.query(query, {
        replacements: [id]
    });
    return results[0]; // Return the first result
};

// Static method to find an employee by phone number using raw SQL
Employee.findByPhoneNumber = async function (phoneNumber) {
    const query = 'SELECT * FROM employees WHERE phoneNumber = ?';
    const [results] = await sequelize.query(query, {
        replacements: [phoneNumber]
    });
    return results[0]; // Return the first result
};

// Export the Employee model
module.exports = Employee;
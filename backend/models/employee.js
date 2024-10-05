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
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    }
}, {
    timestamps: true,
});

// Static method to run raw SQL for DML (e.g., inserting an employee)
Employee.insertEmployee = async function (employeeData) {
    const query = `
        INSERT INTO employees (employeeName, phoneNumber, address, password, designation, department,email)
        VALUES (?, ?, ?, ?, ?, ?,?)`;
    return await sequelize.query(query, {
        replacements: [employeeData.employeeName, employeeData.phoneNumber, employeeData.address,
        employeeData.password, employeeData.designation, employeeData.department, employeeData.email]
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

Employee.findByEmail = async function (email) {
    const query = 'SELECT * FROM employees WHERE email = ?';
    const [results] = await sequelize.query(query, {
        replacements: [email]
    });
    return results[0]; // Return the first result
};

Employee.updatePassword = async function (id, hashedPassword) {
    const query = 'UPDATE employees SET password = :password WHERE id = :id';
    // Update the employee's password using a raw SQL query
    await sequelize.query(query, {
        replacements: { password: hashedPassword, id: id },
    }); // Raw SQL update query
};

module.exports = Employee;
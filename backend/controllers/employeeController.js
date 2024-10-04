const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Employee = require('../models/employee'); // Import the Employee model
const { setUser } = require('../service/auth'); // Import setUser function

exports.createAccount = async (req, res) => {
    const { employeeName, phoneNumber, address, password, designation, department } = req.body;

    // Basic validation
    if (!employeeName || !phoneNumber || !address || !password || !designation || !department) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new employee record using the Employee model
        const newEmployee = await Employee.insertEmployee({
            employeeName,
            phoneNumber,
            address,
            password: hashedPassword,
            designation,
            department
        });

        // Create a JWT token
        const token = setUser(newEmployee); // Ensure setUser is implemented correctly

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour 
        });

        res.status(201).json({ message: 'Account created successfully!', employee: newEmployee });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Error creating account', error: error.message });
    }
};
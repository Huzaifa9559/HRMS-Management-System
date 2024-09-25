import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import dotenv from 'dotenv';
import Employee from '../models/employee.js'; // Import the Employee model
import { setUser, getUser } from '../service/auth.js';

dotenv.config(); // Load environment variables

export const createAccount = async (req, res) => {
    const { employeeName, phoneNumber, address, password, designation, department } = req.body;
    // Basic validation
    if (!employeeName || !phoneNumber || !address || !password || !designation || !department) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create an instance of the Employee model
        const newEmployee = new Employee(employeeName, phoneNumber, address, hashedPassword, designation, department);

        // Save the employee to the database
        await newEmployee.save();

        // Create a JWT token
        const token = setUser(newEmployee);
        // Set the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }); // 1 hour

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ message: 'Error creating account', error });
    }
};

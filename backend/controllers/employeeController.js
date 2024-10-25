const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Employee = require('../models/employee'); // Import the Employee model
const { setUser } = require('../service/auth'); // Import setUser function
const { sendResetLink } = require('../service/nodemailer');

exports.createAccount = async (req, res) => {
    console.log(req.body);
    const { employeeName, phoneNumber, address, designation, department } = req.body;
    // Basic validation
    if (!employeeName || !phoneNumber || !address || !designation || !department) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Add a new employee record using the Employee model
        const newEmployee = await Employee.insertEmployee({
            employeeName,
            phoneNumber,
            address,
            designation,
            department
        });
        res.status(201).json({ message: 'Submit request sent successfully!', employee: newEmployee });
    } catch (error) {
        return res.status(500).json({ message: 'Error submitting request', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the employee by email
        const employee = await Employee.findByField('employee_email', email);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Send the reset link to the user's email and handle the response
        await sendResetLink(email, employee.id);
        return res.status(200).json({ message: 'Password reset link sent to your email', success: true });
    } catch (error) {
        console.error('Error sending reset link:', error);
        return res.status(500).json({ message: 'Failed to send reset link', success: false, error: error.message });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the employee by email
        const employee = await Employee.findByField('employee_email', email);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const passwordMatch = await bcrypt.compare(password, employee.password);
        // Compare the provided password with the hashed password
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Create a JWT token
        const token = setUser(employee);
        // Set the token in a cookie
        res.cookie('token', token);

        res.status(200).json({ message: 'Login successful', success: true });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Error logging in', error: error.message, success: false });
    }
};

exports.resetPassword = async (req, res) => {
    const { id, password } = req.body;
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        await Employee.updatePassword(id, hashedPassword);
        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
    }
};

exports.getDepartmentandDesignation = async (req, res) => {
    try {
        // Fetch designations and departments from the database
        const designations = await Employee.getDesignations();
        const departments = await Employee.getDepartments();
        return res.status(200).json({ designations, departments });
    } catch (error) {
        console.error('Error fetching designations and departments:', error);
        return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
};


const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Employee = require('../models/employee'); // Import the Employee model
const { setUser } = require('../service/auth'); // Import setUser function
const { sendResetLink } = require('../service/nodemailer');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');

exports.createAccount = async (req, res) => {
    const { employeeName, phoneNumber, address, designation, department } = req.body;
    if (!employeeName || !phoneNumber || !address || !designation || !department) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }
    try {
        const newEmployee = await Employee.insertEmployee({
            employeeName, phoneNumber, address, designation, department
        });
        return sendResponse(res, httpStatus.CREATED, { Employee: newEmployee }, 'Submit request sent successfully!');
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error submitting request', error.message);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findEmployeeByField('employee_email', email);
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        await sendResetLink(email, employee.id);
        return sendResponse(res, httpStatus.OK, null, 'Password reset link sent to your email', null, true);
    } catch (error) {
        console.error('Error sending reset link:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Failed to send reset link', error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findEmployeeByField('employee_email', email);
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        const passwordMatch = await bcrypt.compare(password, employee.employee_password);
        if (!passwordMatch) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Invalid password');
        }
        const token = setUser(employee);
        res.cookie('token', token);

        return sendResponse(res, httpStatus.OK, null, 'Login successful', null, true);
    } catch (error) {
        console.error('Error logging in:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error logging in', error.message);
    }
};

exports.resetPassword = async (req, res) => {
    const { id, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Employee.updatePassword(id, hashedPassword);
        return sendResponse(res, httpStatus.OK, null, 'Password reset successfully', null, true);
    } catch (error) {
        console.error('Error resetting password:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error resetting password', error.message);
    }
};

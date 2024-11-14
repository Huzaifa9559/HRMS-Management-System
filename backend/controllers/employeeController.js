const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const Employee = require('../models/employee'); // Import the Employee model
const { setUser, getUser } = require('../service/auth'); // Import setUser function
const { sendResetLink } = require('../service/nodemailer');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

exports.createAccount = async (req, res) => {
    const { employeeName, phoneNumber, address, designation, department } = req.body;
    if (!employeeName || !phoneNumber || !address || !designation || !department) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }
    try {
        const newEmployee = await Employee.insertEmployee({
            employeeName, phoneNumber, address, designation, department
        });
        return sendResponse(res, httpStatus.CREATED, { employee: newEmployee }, 'Submit request sent successfully!');
    } catch (error) {
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error submitting request', error.message);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const employee = await Employee.findByField('employee_email', email);
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
        const employee = await Employee.findByField('employee_email', email);
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

exports.DepartmentandDesignation = async (req, res) => {
    try {
        const designations = await Employee.getDesignations();
        const departments = await Employee.getDepartments();
        return sendResponse(res, httpStatus.OK, { designations, departments });
    } catch (error) {
        console.error('Error fetching designations and departments:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching data', error.message);
    }
};


exports.EmployeeDetailsById = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Authorization header missing or malformed');
    }
    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const payload = getUser(token);
        const employee = await Employee.getEmployeeDetails(payload._id); // Use the id from the decoded payload
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        console.log(employee);
        return sendResponse(res, httpStatus.OK, employee, 'Employee retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee', error.message);
    }
};

exports.LeaveDetailsById = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Authorization header missing or malformed');
    }
    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        const payload = getUser(token);
        const leaveDetails = await Employee.getLeaveDetails(payload._id);
        if (!leaveDetails) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave details not found for this employee');
        }
        return sendResponse(res, httpStatus.OK, leaveDetails, 'Leave details retrieved successfully');
    } catch (error) {
        console.error('Error fetching leave details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching leave details', error.message);
    }
};

exports.createLeaveRequest = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Authorization header missing or malformed');
    }
    const token = authHeader.split(' ')[1]; // Extract the token
    const { startDate, endDate, leaveType, reason } = req.body; // Extract leave request details
    if (!startDate || !endDate || !reason || !leaveType) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }

    try {
        const payload = getUser(token);
        const leaveRequest = await Employee.setLeaveRequest({
            employeeId: payload._id,
            fromDate: startDate, toDate: endDate, type: leaveType, leave_reason: reason
        });
        console.log(leaveRequest);
        return sendResponse(res, httpStatus.CREATED, leaveRequest, 'Leave request created successfully');
    } catch (error) {
        console.error('Error creating leave request:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error creating leave request', error.message);
    }
};



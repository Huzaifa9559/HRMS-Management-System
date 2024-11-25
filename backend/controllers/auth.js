const bcrypt = require('bcrypt'); 
const Employee = require('../models/employee'); 
const { setUser,getUser } = require('../service/auth');
const { sendResetLink,sendCreateAccountLink } = require('../service/emailService');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil');

exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

     if(email==="k224586@nu.edu.pk" && password==="Password@123"){
        const user = {
        id: 1,
        email:'k224586@nu.edu.pk' ,
        username: 'huzaifa'
        };
        const token = setUser(user);
        res.cookie('token', token);
        return sendResponse(res, httpStatus.OK, null, 'Login successful', null, true);
        }
        else {
             return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error logging in', error.message);
        }
};


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
        const user = {
        id: employee.employeeID,
        email: employee.employee_email,
        username: employee.employee_first_name
        };
        const token = setUser(user);
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

exports.inviteNewEmployee = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED); // 401 Unauthorized

    try {
        const payload = getUser(token);
        if (!payload) return res.sendStatus(httpStatus.UNAUTHORIZED); // 401 Unauthorized

        // Extract email from request body
        const { email } = req.body;
        if (!email) {
            return sendResponse(res,httpStatus.BAD_REQUEST,null,'Invalid request','Email is required to invite a new employee'); // 400 Bad Request
        }

        // Send the invite email
        const response = await sendCreateAccountLink(email);

        // Return success response
        return sendResponse(res,httpStatus.OK,{ message: 'Invite sent successfully', mailgunResponse: response },'Invite sent successfully');
    } catch (error) {
        console.error('Error sending invite:', error);
        return sendResponse( res,httpStatus.INTERNAL_SERVER_ERROR,null,'Error sending invite',error.message); // 500 Internal Server Error
    }
};

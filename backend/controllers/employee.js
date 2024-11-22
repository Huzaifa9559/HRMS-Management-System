const Employee = require('../models/employee'); // Import the Employee model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function


exports.EmployeeDetailsById = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Exit if token extraction failed

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

exports.getNumberofEmployees = async (req, res) => {
    const token = extractToken(req, res); 
    if (!token) return; 

    try {
        const payload = getUser(token); // Decode the user from the token
        if (!payload) {
            return sendResponse(res, httpStatus.FORBIDDEN, null, 'Unauthorized access');
        }
        const totalEmployees = await Employee.getTotalNumberofEmployees(); // Use the model to count all employees
        return sendResponse(res, httpStatus.OK,totalEmployees, 'Total number of employees retrieved successfully');
    } catch (error) {
        console.error('Error fetching number of employees:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching number of employees', error.message);
    }
};

exports.getEmployeesDetails = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Exit if token extraction failed

    try {
        const payload = getUser(token); // Decode the user from the token
        if (!payload) {
            return sendResponse(res, httpStatus.FORBIDDEN, null, 'Unauthorized access');
        }
        const employees = await Employee.getAllEmployees(); // Fetch all employee details
        if (!employees || employees.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No employees found');
        }
        return sendResponse(res, httpStatus.OK, employees, 'Employees retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee details', error.message);
    }
};


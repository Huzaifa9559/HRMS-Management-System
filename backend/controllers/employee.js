const Employee = require('../models/employee'); // Import the Employee model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil');

exports.EmployeeDetailsById = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; 
    try {
        const payload = getUser(token);
        const employee = await Employee.getEmployeeDetails(payload._id); // Use the id from the decoded payload
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        return sendResponse(res, httpStatus.OK, employee, 'Employee retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee', error.message);
    }
};

exports.getNumberofEmployees = async (req, res) => {
    try {
        const totalEmployees = await Employee.getTotalNumberofEmployees(); // Use the model to count all employees
        return sendResponse(res, httpStatus.OK,totalEmployees, 'Total number of employees retrieved successfully');
    } catch (error) {
        console.error('Error fetching number of employees:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching number of employees', error.message);
    }
};

exports.getEmployeesDetails = async (req, res) => {
    try {
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

exports.updateStatus = async (req, res) => {
    try {
        const employeeId = req.body.employeeId;
        const employees = await Employee.updateEmployeeStatus(employeeId); 
        if (!employees || employees.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No employees found');
        }
        return sendResponse(res, httpStatus.OK, null, 'Updated successfully');
    } catch (error) {
        console.error(error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee details', error.message);
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id; 
        const deletedEmployee = await Employee.deleteEmployeeById(employeeId); // Call model function to delete employee
        if (!deletedEmployee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        return sendResponse(res, httpStatus.OK, null, 'Employee deleted successfully');
    } catch (error) {
        console.error('Error deleting employee:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error deleting employee', error.message);
    }
};

exports.getEmployeeDetailByID = async (req, res) => {
    const employeeId = req.params.id; // Get the employeeId from query parameters
    if (!employeeId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Employee ID is required');
    }

    try {
        const employee = await Employee.getEmployeeDetails(employeeId); // Use the model function to fetch employee details
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        return sendResponse(res, httpStatus.OK, employee, 'Employee details retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee details by ID:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee details', error.message);
    }
};



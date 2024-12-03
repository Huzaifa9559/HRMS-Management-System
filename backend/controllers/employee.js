const Employee = require('../models/employee'); // Import the Employee model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil');
const { sendCreateAccountLink } = require('../service/emailService');

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

exports.getEmployeeImageFileName = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Get the employeeId from query parameters
    const payload = getUser(token);
    const employeeId = payload._id;
    if (!employeeId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Employee ID is required');
    }

    try {
        const employeeImageFileName = await Employee.getEmployeeImageFileNameById(employeeId); // Fetch employee's image file name
        if (!employeeImageFileName) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee image not found');
        }
        return sendResponse(res, httpStatus.OK, employeeImageFileName, 'Employee image file name retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee image file name:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching employee image file name', error.message);
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const file = req.file;
        const employees = await Employee.createNewEmployee(req.body,file.filename); 
        //sath me invite link bhi bhejna employee ku yaha 
        try {
            await sendCreateAccountLink(req.body.email, req.body.password);
        } catch (error) {
            return sendResponse(res, httpStatus.OK, null, 'Added successfully');
        }

        if (!employees || employees.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No employees found');
        }
        
        return sendResponse(res, httpStatus.OK, null, 'Added successfully');
    } catch (error) {
        console.error(error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error:', error.message);
    }
}

exports.editEmployee = async (req, res) => {
    const { employeeId, updatedData } = req.body; // Get employeeId and updated data from request body
    const file = req.file;
    if (!employeeId || !updatedData) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Employee ID and updated data are required');
    }

    try {
        if (file) {
        updatedData.employee_image = file.filename;
        }
        const employee = await Employee.updateEmployeeById(employeeId, updatedData); // Update employee details
        if (!employee) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Employee not found');
        }
        return sendResponse(res, httpStatus.OK, employee, 'Employee details updated successfully');
    } catch (error) {
        console.error('Error updating employee details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error updating employee details', error.message);
    }
};

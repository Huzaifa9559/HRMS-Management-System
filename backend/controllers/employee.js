const Employee = require('../models/employee'); // Import the Employee model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil');
const { sendCreateAccountLink } = require('../service/emailService');

/**
 * Helper function to convert employee image to URL
 * Handles both old format (key) and new format (full URL)
 * Also fixes URLs with wrong region
 * @param {string} imageValue - The image value from database (could be key or URL)
 * @returns {string} - Full URL or original value
 */
function getEmployeeImageUrl(imageValue) {
  if (!imageValue) {
    return null;
  }

  // If it's already a full URL, check if region is correct
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) {
    // Check if URL has wrong region (us-east-1) and fix it
    if (imageValue.includes('.s3.us-east-1.amazonaws.com/')) {
      // Replace wrong region with correct region
      return imageValue.replace(
        '.s3.us-east-1.amazonaws.com/',
        '.s3.eu-north-1.amazonaws.com/'
      );
    }
    // If region is correct or not in standard format, return as is
    return imageValue;
  }

  // If it's an old format key (starts with folder name), convert to URL
  if (imageValue.startsWith('employees/')) {
    const { getDirectS3Url } = require('../service/s3Service');
    return getDirectS3Url(imageValue);
  }

  // For local files, return as is
  return imageValue;
}

exports.EmployeeDetailsById = async (req, res) => {
  const token = extractToken(req, res); // Use the utility function
  if (!token) return;
  try {
    const payload = getUser(token);
    const employee = await Employee.getEmployeeDetails(payload._id); // Use the id from the decoded payload
    if (!employee) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee not found'
      );
    }

    // Convert image to URL (handles both old key format and new URL format)
    if (employee.employee_image) {
      employee.employee_image = getEmployeeImageUrl(employee.employee_image);
    }

    return sendResponse(
      res,
      httpStatus.OK,
      employee,
      'Employee retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching employee:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee',
      error.message
    );
  }
};
exports.getEmployeeStats = async (req, res) => {
  const token = extractToken(req, res); // Use the utility function
  if (!token) return;
  try {
    const payload = getUser(token);
    const employee = await Employee.getEmployeeStatsbyId(payload._id); // Use the id from the decoded payload
    if (!employee) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee not found'
      );
    }
    return sendResponse(
      res,
      httpStatus.OK,
      employee,
      'Employee retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching employee:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee',
      error.message
    );
  }
};

exports.getNumberofEmployees = async (req, res) => {
  try {
    const totalEmployees = await Employee.getTotalNumberofEmployees(); // Use the model to count all employees
    return sendResponse(
      res,
      httpStatus.OK,
      totalEmployees,
      'Total number of employees retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching number of employees:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching number of employees',
      error.message
    );
  }
};

exports.getEmployeesDetails = async (req, res) => {
  try {
    const employees = await Employee.getAllEmployees(); // Fetch all employee details
    if (!employees || employees.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'No employees found'
      );
    }

    // Convert images to URLs (handles both old key format and new URL format)
    const employeesWithUrls = employees.map((employee) => {
      if (employee.employee_image) {
        employee.employee_image = getEmployeeImageUrl(employee.employee_image);
      }
      return employee;
    });

    return sendResponse(
      res,
      httpStatus.OK,
      employeesWithUrls,
      'Employees retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching employee details:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee details',
      error.message
    );
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const employeeId = req.body.employeeId;
    const employees = await Employee.updateEmployeeStatus(employeeId);
    if (!employees || employees.length === 0) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'No employees found'
      );
    }
    return sendResponse(res, httpStatus.OK, null, 'Updated successfully');
  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee details',
      error.message
    );
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const deletedEmployee = await Employee.deleteEmployeeById(employeeId); // Call model function to delete employee
    if (!deletedEmployee) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee not found'
      );
    }
    return sendResponse(
      res,
      httpStatus.OK,
      null,
      'Employee deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting employee:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error deleting employee',
      error.message
    );
  }
};

exports.getEmployeeDetailByID = async (req, res) => {
  const employeeId = req.params.id; // Get the employeeId from query parameters
  if (!employeeId) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      'Employee ID is required'
    );
  }

  try {
    const employee = await Employee.getEmployeeDetails(employeeId); // Use the model function to fetch employee details
    if (!employee) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee not found'
      );
    }

    // Convert image to URL (handles both old key format and new URL format)
    if (employee.employee_image) {
      employee.employee_image = getEmployeeImageUrl(employee.employee_image);
    }

    return sendResponse(
      res,
      httpStatus.OK,
      employee,
      'Employee details retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching employee details by ID:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee details',
      error.message
    );
  }
};

exports.getEmployeeImageFileName = async (req, res) => {
  const token = extractToken(req, res);
  if (!token) return;
  const payload = getUser(token);
  const employeeId = payload._id;
  if (!employeeId) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      'Employee ID is required'
    );
  }

  try {
    const imageRecord = await Employee.getEmployeeImageFileNameById(employeeId);
    if (!imageRecord) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee image not found'
      );
    }

    const imageUrl =
      typeof imageRecord === 'string' ? imageRecord : imageRecord.imageFileName;

    if (!imageUrl) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee image not found'
      );
    }

    // Convert image to URL (handles both old key format and new URL format)
    const finalImageUrl = getEmployeeImageUrl(imageUrl);

    return sendResponse(
      res,
      httpStatus.OK,
      {
        imageUrl: finalImageUrl,
      },
      'Employee image retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching employee image file name:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching employee image file name',
      error.message
    );
  }
};

exports.addEmployee = async (req, res) => {
  try {
    const file = req.file;
    let imageUrl = null;

    if (file) {
      // If file is uploaded to S3, generate the full URL
      if (file.key && file.key.startsWith('employees/')) {
        const { getDirectS3Url } = require('../service/s3Service');
        imageUrl = getDirectS3Url(file.key);
      } else {
        // Local file - use filename
        imageUrl = file.filename;
      }
    }

    const result = await Employee.createNewEmployee(req.body, imageUrl);

    if (!result || !result.success) {
      return sendResponse(
        res,
        httpStatus.INTERNAL_SERVER_ERROR,
        null,
        'Failed to create employee'
      );
    }

    // Send invite link to employee (non-blocking - don't fail if email fails)
    try {
      await sendCreateAccountLink(req.body.email, req.body.password);
    } catch (error) {
      console.error('Error sending account creation email:', error);
      // Continue even if email fails - employee is already created
    }

    return sendResponse(
      res,
      httpStatus.OK,
      { employeeID: result.employeeID },
      'Employee added successfully'
    );
  } catch (error) {
    console.error('Error adding employee:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error creating employee',
      error.message
    );
  }
};

exports.editEmployee = async (req, res) => {
  const { employeeId, updatedData } = req.body; // Get employeeId and updated data from request body
  const file = req.file;
  if (!employeeId) {
    return sendResponse(
      res,
      httpStatus.BAD_REQUEST,
      null,
      'Employee ID and updated data are required'
    );
  }

  try {
    if (file) {
      // If file is uploaded to S3, generate the full URL
      if (file.key && file.key.startsWith('employees/')) {
        const { getDirectS3Url } = require('../service/s3Service');
        updatedData.employee_image = getDirectS3Url(file.key);
      } else {
        // Local file - use filename
        updatedData.employee_image = file.filename;
      }
    }
    const employee = await Employee.updateEmployeeById(employeeId, updatedData); // Update employee details
    if (!employee) {
      return sendResponse(
        res,
        httpStatus.NOT_FOUND,
        null,
        'Employee not found'
      );
    }
    return sendResponse(
      res,
      httpStatus.OK,
      employee,
      'Employee details updated successfully'
    );
  } catch (error) {
    console.error('Error updating employee details:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error updating employee details',
      error.message
    );
  }
};

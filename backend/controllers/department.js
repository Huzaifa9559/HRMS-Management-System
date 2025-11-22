const Department = require('../models/department');
const Designation = require('../models/designation');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');

exports.getDepartment = async (req, res) => {
  try {
    const departments = await Department.getDepartments();
    return sendResponse(res, httpStatus.OK, departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching data',
      error.message
    );
  }
};

exports.getDepartmentsDetails = async (req, res) => {
  try {
    const departments = await Department.getallDepartmentDetails();
    return sendResponse(res, httpStatus.OK, departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching data',
      error.message
    );
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    await Department.createNewDepartment(name);
    return sendResponse(res, httpStatus.OK, null, 'Created Successfully');
  } catch (error) {
    console.error('Error fetching departments:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching data',
      error.message
    );
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(name);
    await Department.removeDepartment(name);
    return sendResponse(res, httpStatus.OK, null, 'Deleted successfully');
  } catch (error) {
    console.error('Error fetching departments:', error);
    return sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      null,
      'Error fetching data',
      error.message
    );
  }
};

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
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching data', error.message);
    }
};

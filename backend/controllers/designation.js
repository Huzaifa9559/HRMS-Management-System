const Designation = require('../models/designation'); // Import the Employee model

const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');

exports.getDesignation = async (req, res) => {
    try {
        const designations = await Designation.getDesignations();
        return sendResponse(res, httpStatus.OK, designations);
    } catch (error) {
        console.error('Error fetching designations:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching data', error.message);
    }
};

exports.viewAllDesignationDetails = async (req, res) => {
    try {
        const departmentId = req.params.departmentId;
        const designations = await Designation.getAllDesignationDetails(departmentId);
        return sendResponse(res, httpStatus.OK, designations);
    } catch (error) {
        console.error('Error fetching designations:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching data', error.message);
    }
};

exports.createDesignation = async (req, res) => {
    try {
        const { name,id } = req.body; 
        await Designation.createNewDesignation(name,id);
       return sendResponse(res, httpStatus.OK, null, 'Created Successfully');
    } catch (error) {
        console.error('Error', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching data', error.message);
    }
};

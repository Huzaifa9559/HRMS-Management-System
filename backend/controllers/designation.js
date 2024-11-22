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

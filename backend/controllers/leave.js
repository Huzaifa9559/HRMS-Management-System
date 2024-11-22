const Leave = require('../models/leave'); // Import the Leave model
const { getUser } = require('../service/auth'); // Import setUser function
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function

exports.LeaveDetailsById = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Exit if token extraction failed

    try {
        const payload = getUser(token);
        const leaveDetails = await Leave.getLeaveDetails(payload._id);
        if (!leaveDetails) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave details not found for this Leave');
        }
        return sendResponse(res, httpStatus.OK, leaveDetails, 'Leave details retrieved successfully');
    } catch (error) {
        console.error('Error fetching leave details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching leave details', error.message);
    }
};

exports.createLeaveRequest = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Exit if token extraction failed
    const { startDate, endDate, leaveType, reason } = req.body; // Extract leave request details
    if (!startDate || !endDate || !reason || !leaveType) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'All fields are required');
    }

    try {
        const payload = getUser(token);
        const leaveRequest = await Leave.setLeaveRequest({
            employeeId: payload._id,
            fromDate: startDate, toDate: endDate, leavetype: leaveType, leave_reason: reason
        });
        return sendResponse(res, httpStatus.CREATED, leaveRequest, 'Leave request created successfully');
    } catch (error) {
        console.error('Error creating leave request:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error creating leave request', error.message);
    }
};


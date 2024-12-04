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

exports.getAllEmployeesLeaveDetails = async (req, res) => {
    try {        
        const leaveDetails = await Leave.getAllLeaveDetails(); // Fetch all leave details
        if (!leaveDetails || leaveDetails.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No leave details found');
        }

        return sendResponse(res, httpStatus.OK, leaveDetails, 'All leave details retrieved successfully');
    } catch (error) {
        console.error('Error fetching all employees leave details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching leave details', error.message);
    }
};

exports.getLeaveDetail = async (req, res) => {
    const leaveId = req.params.id; // Get the leaveId from query parameters
    if (!leaveId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Leave ID is required');
    }

    try {
        const leaveDetail = await Leave.getLeaveDetailsByLeaveId(leaveId); // Fetch the leave details using the leaveId
        if (!leaveDetail) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave details not found');
        }
        return sendResponse(res, httpStatus.OK, leaveDetail, 'Leave details retrieved successfully');
    } catch (error) {
        console.error('Error fetching leave details by ID:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching leave details', error.message);
    }
};

exports.getLeaveStats = async (req, res) => {
    const employeeId = req.params.id; // Get the employeeId from query parameters
    if (!employeeId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Employee ID is required');
    }

    try {
        // Fetch leave statistics for the specific employee using the employeeId
        const stats = await Leave.getEmployeeLeaveStatistics(employeeId); 

        if (!stats) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave statistics not found for the given employee');
        }
        
        return sendResponse(res, httpStatus.OK, stats, 'Employee leave statistics retrieved successfully');
    } catch (error) {
        console.error('Error fetching employee leave statistics:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching leave statistics', error.message);
    }
};

exports.acceptLeave = async (req, res) => {
    const leaveId = req.params.id; // Get the leaveId from query parameters
    if (!leaveId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Leave ID is required');
    }

    try {
        const updatedRows = await Leave.updateLeaveStatus(leaveId, 1); // Update status to "Accepted" (1)
        if (updatedRows === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave request not found');
        }
        return sendResponse(res, httpStatus.OK, null, 'Leave request accepted successfully');
    } catch (error) {
        console.error('Error accepting leave request:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error accepting leave request', error.message);
    }
};

exports.rejectLeave = async (req, res) => {
    const leaveId = req.params.id; // Get the leaveId from query parameters
    if (!leaveId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Leave ID is required');
    }

    try {
        const updatedRows = await Leave.updateLeaveStatus(leaveId, 2); // Update status to "Rejected" (2)
        if (updatedRows === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Leave request not found');
        }
        return sendResponse(res, httpStatus.OK, null, 'Leave request rejected successfully');
    } catch (error) {
        console.error('Error rejecting leave request:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error rejecting leave request', error.message);
    }
};

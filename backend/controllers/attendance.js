const Attendance = require('../models/attendance'); // Import the Attendance model
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function


exports.getEmployeeAttendanceRecords = async (req, res) => {
    const token = extractToken(req, res); // Use the utility function
    if (!token) return; // Exit if token extraction failed

    try {
        const payload = getUser(token);
        const attendanceRecords = await Attendance.getAttendanceByEmployeeId(payload._id); // Fetch attendance records
        if (!attendanceRecords || attendanceRecords.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No attendance records found for this Attendance');
        }
        return sendResponse(res, httpStatus.OK, attendanceRecords, 'Attendance records retrieved successfully');
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching attendance records', error.message);
    }
};

exports.createNewAttendance = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;

    try {
        const payload = getUser(token);
        const attendanceRecord = await Attendance.setClockIn(payload._id);
        return sendResponse(res, httpStatus.CREATED, attendanceRecord, 'Attendance recorded successfully');
    } catch (error) {
        console.error('Error creating attendance record:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error creating attendance record', error.message);
    }
};

exports.updateEmployeeAttendance = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
    const { date, action } = req.body; // Extract action from request body

    try {
        const payload = getUser(token);
        await Attendance.setAttendanceAction(action, {
            attendanceDate: date,
            employeeId: payload._id
        });
        // Determine response message based on action
        let message;
        switch (action) {
            case 'clockOut':
                message = 'Attendance updated successfully';
                break;
            case 'breakIn':
                message = 'Break-in recorded successfully';
                break;
            case 'breakOut':
                message = 'Break-out recorded successfully';
                break;
            default:
                return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Invalid action specified');
        }

        return sendResponse(res, httpStatus.OK, null, message);
    } catch (error) {
        console.error('Error processing attendance or break record:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error processing request', error.message);
    }
};

exports.getEmployeeAttendanceRecord = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
    const date = req.query.date;
    try {
        const payload = getUser(token);
        const attendanceRecord = await Attendance.getAttendanceByEmployeeIdAndDate(payload._id, date); // Fetch attendance record by Attendance ID and date
        if (!attendanceRecord) {
            return sendResponse(res, httpStatus.OK, null, 'Attendance record not found for this Attendance on the specified date');
        }
        return sendResponse(res, httpStatus.OK, attendanceRecord, 'Attendance record retrieved successfully');
    } catch (error) {
        console.error('Error fetching attendance record:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching attendance record', error.message);
    }
};

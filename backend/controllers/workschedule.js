const WorkSchedule = require('../models/workschedule');
const { getUser } = require('../service/auth');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');
const { extractToken } = require('../utils/authUtil'); // Import the extractToken function

exports.getEmployeeWorkSchedule = async (req, res) => {
    const token = extractToken(req, res);
    if (!token) return;
    const month = req.params.month;
    try {
        const payload = getUser(token);
        const workschedule = await WorkSchedule.getWorkScheduleByEmployeeId(payload._id, month);
        if (!workschedule) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Work schedule not found for this employee');
        }
        return sendResponse(res, httpStatus.OK, workschedule, 'Work schedule retrieved successfully');
    } catch (error) {
        console.error('Error fetching work schedule:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching work schedule', error.message);
    }
};

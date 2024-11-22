const Announcement = require('../models/announcements');
const sendResponse = require('../utils/responseUtil');
const httpStatus = require('../utils/httpStatus');


exports.getAnnouncements = async (req, res) => {
    const { department } = req.query; // Extract department name from query parameters
    if (!department) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Department name is required');
    }

    try {
        const announcements = await Announcement.getAnnouncementsByDepartment(department); // Fetch announcements by department
        if (!announcements || announcements.length === 0) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'No announcements found for this department');
        }
        return sendResponse(res, httpStatus.OK, announcements, 'Announcements retrieved successfully');
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching announcements', error.message);
    }
};

exports.getAnnouncmentDetails = async (req, res) => {
    const announcementId = req.params.announcementId; // Extract announcement ID from request parameters
    if (!announcementId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, 'Announcement ID is required');
    }

    try {
        const announcement = await Announcement.getAnnouncementById(announcementId); // Fetch announcement details by ID
        if (!announcement) {
            return sendResponse(res, httpStatus.NOT_FOUND, null, 'Announcement not found');
        }
        return sendResponse(res, httpStatus.OK, announcement, 'Announcement details retrieved successfully');
    } catch (error) {
        console.error('Error fetching announcement details:', error);
        return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Error fetching announcement details', error.message);
    }
};

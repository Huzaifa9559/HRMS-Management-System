const express = require('express'); // Import express
const announcement = express.Router();

const { getAnnouncements, getAnnouncmentDetails } = require('../../controllers/announcements');


announcement.get('/', getAnnouncements);
announcement.get('/view/:announcementId', getAnnouncmentDetails);

module.exports = announcement; // Export the router
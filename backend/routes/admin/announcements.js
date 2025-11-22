const express = require('express'); // Import express
const announcement = express.Router();

const {
  getAnnouncements,
  getAnnouncmentDetails,
  deleteAnnouncement,
  createAnnouncement,
} = require('../../controllers/announcements');

announcement.get('/', getAnnouncements);
announcement.get('/view/:announcementId', getAnnouncmentDetails);
announcement.delete('/delete', deleteAnnouncement);
announcement.post('/create', createAnnouncement);

module.exports = announcement; // Export the router

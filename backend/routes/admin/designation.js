const express = require('express'); // Import express
const designation = express.Router(); // Create a router instance
// Import the specific controller
const {
  getDesignation,
  viewAllDesignationDetails,
  createDesignation,
} = require('../../controllers/designation');

designation.get('/', getDesignation);
designation.get('/view/:departmentId', viewAllDesignationDetails);
designation.post('/create', createDesignation);

module.exports = designation;

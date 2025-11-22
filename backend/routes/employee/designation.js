const express = require('express'); // Import express
const designation = express.Router(); // Create a router instance
// Import the specific controller
const { getDesignation } = require('../../controllers/designation');

designation.get('/', getDesignation);

module.exports = designation;

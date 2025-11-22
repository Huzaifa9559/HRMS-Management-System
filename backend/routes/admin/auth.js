const express = require('express'); // Import express
const auth = express.Router();

const { loginAdmin } = require('../../controllers/auth');
const { inviteNewEmployee } = require('../../controllers/auth');

auth.post('/login', loginAdmin);

module.exports = auth;

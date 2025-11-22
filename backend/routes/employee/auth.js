const express = require('express'); // Import express
const auth = express.Router();
const {
  login,
  forgotPassword,
  resetPassword,
} = require('../../controllers/auth');

auth.post('/login', login);
auth.post('/forgot-password', forgotPassword); //send reset link
auth.post('/set-new-password', resetPassword); // sets new password

module.exports = auth;

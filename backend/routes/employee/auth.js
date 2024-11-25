const express = require('express'); // Import express
const auth = express.Router();
const { createAccount, login, forgotPassword, resetPassword } = require('../../controllers/auth');

auth.post('/create-account', createAccount);
auth.post('/login', login);
auth.post('/forgot-password', forgotPassword);  //send reset link
auth.post('/set-new-password', resetPassword);  // sets new password


module.exports = auth;
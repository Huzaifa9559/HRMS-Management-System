// mailer.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: `${process.cwd()}/.env` });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 587 for TLS
    secure: false, // Set to true for SSL (port 465)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;

const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
});

exports.sendResetLink = (email, id) => {
    return new Promise((resolve, reject) => {
        const resetLink = `${process.env.domain}/set-new-password?id=${id}`; // Update with your domain

        // Set up AWS SDK with your credentials and region
        AWS.config.update({
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: process.env.region  // Set this to your SES region
        });

        const transporter = nodemailer.createTransport({
            SES: new AWS.SES({
                apiVersion: process.env.apiVersion,  // The stable SES API version
            }),
        });

        const mailOptions = {
            from: process.env.from_email,  // Your verified email
            to: email,  // Recipients
            subject: 'Reset Password Link',
            text: resetLink,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);  // Reject the promise on error
            } else {
                resolve(true);  // Resolve the promise on success
            }
        });
    });
};

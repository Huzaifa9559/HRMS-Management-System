const formData = require('form-data');
const Mailgun = require('mailgun.js');
const dotenv = require('dotenv');

dotenv.config({ path: `${process.cwd()}/.env` });

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY, // Use environment variable for the API key
});

const DOMAIN = process.env.MAILGUN_DOMAIN; // Set your domain in the environment variables

exports.sendResetLink = (email, id) => {
    return new Promise((resolve, reject) => {
        const resetLink = `${process.env.domain}/set-new-password?id=${id}`; // Update with your domain

        mg.messages
            .create(DOMAIN, {
                from: `Excited User <mailgun@${DOMAIN}>`, // Replace with your verified sender email
                to: [email],
                subject: 'Reset Password Link',
                text: `Click the following link to reset your password: ${resetLink}`,
                html: `<p>Click the following link to reset your password:</p> <a href="${resetLink}">${resetLink}</a>`,
            })
            .then((msg) => resolve(msg)) // Resolve with the Mailgun response
            .catch((err) => reject(err)); // Reject with any error
    });
};

exports.sendCreateAccountLink = (email) => {
    return new Promise((resolve, reject) => {
        const link = `${process.env.domain}/create-account`;

        mg.messages
            .create(DOMAIN, {
                from: `Excited User <mailgun@${DOMAIN}>`, // Replace with your verified sender email
                    to: [email],
                    subject: 'Invitation to Join Xylobit HRMS Platform',
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
                            <img src="https://your-company-logo-url.com/logo.png" alt="Xylobit Logo" style="width: 150px; display: block; margin: auto;">
                            <h2 style="text-align: center; color: #4CAF50;">Welcome to Xylobit HRMS</h2>
                            <p>Dear Employee,</p>
                            <p>
                                You have been invited to join Xylobit's HRMS platform. Click the button below to create your account and access your employee portal:
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <a href="${link}"
                                style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                                    Create My Account
                                </a>
                            </div>
                            <p>If button don't work please click on this link, http://localhost:3000/create-account </p>
                            <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@xylobit.com">support@xylobit.com</a>.</p>
                            <hr>
                            <p style="font-size: 12px; text-align: center; color: #666;">
                                Xylobit | USA | +1 255 225 255
                            </p>
                        </div>
                    `,
        })
            .then((msg) => resolve(msg)) // Resolve with the Mailgun response
            .catch((err) => reject(err)); // Reject with any error
    });
};

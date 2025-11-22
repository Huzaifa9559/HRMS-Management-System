const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

dotenv.config({ path: `${process.cwd()}/.env` });

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@kitor.io';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Xylobit HRMS';

exports.sendResetLink = (email, id) => {
  return new Promise((resolve, reject) => {
    const resetLink = `${process.env.DOMAIN || process.env.FRONTEND_URL || 'http://localhost:3000'}/set-new-password?id=${id}`;

    const msg = {
      to: email,
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
      subject: 'Reset Password Link',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h2 style="text-align: center; color: #4CAF50;">Password Reset Request</h2>
          <p>You have requested to reset your password. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}"
              style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, please copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p style="font-size: 12px; color: #666;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    sgMail
      .send(msg)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.error('SendGrid error:', err);
        reject(err);
      });
  });
};

exports.sendCreateAccountLink = (email, password) => {
  return new Promise((resolve, reject) => {
    const link = `${process.env.DOMAIN || process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

    const msg = {
      to: email,
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
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
              Login
            </a>
          </div>
          <p>If the button doesn't work, please click on this link: <a href="${link}">${link}</a></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Your Login Credentials:</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:support@xylobit.com">support@xylobit.com</a>.</p>
          <hr>
          <p style="font-size: 12px; text-align: center; color: #666;">
            Xylobit | USA | +1 255 225 255
          </p>
        </div>
      `,
    };

    sgMail
      .send(msg)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.error('SendGrid error:', err);
        reject(err);
      });
  });
};

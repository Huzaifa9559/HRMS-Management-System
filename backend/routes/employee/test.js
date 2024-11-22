const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../service/mailer');
const User = require('../models/employee'); // Assuming you have a User model

const router = express.Router();

// Request Password Reset
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findEmployeeByField("employee_email", email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a token
        const token = jwt.sign({ id: user.employee_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create reset link
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.employee_email,
            subject: 'Password Reset',
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
        });

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error("Nodemailer Error:", error); // Log the detailed error
        res.status(500).json({ message: 'Error in sending email' });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        await User.updatePassword(decoded.id, hashedPassword);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

module.exports = router;

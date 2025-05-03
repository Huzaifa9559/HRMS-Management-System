const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const dotenv = require('dotenv');
dotenv.config({ path: `${process.cwd()}/.env` });

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization']; // Get Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token part (after 'Bearer')

    if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user; // Attach user info to the request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;

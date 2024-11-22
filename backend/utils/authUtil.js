const httpStatus = require('./httpStatus');
const sendResponse = require('./responseUtil');

const extractToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendResponse(res, httpStatus.UNAUTHORIZED, null, 'Authorization header missing or malformed');
        return null; // Return null if authorization fails
    }
    return authHeader.split(' ')[1]; // Return the token
};

module.exports = { extractToken }; 
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config({ path: `${process.cwd()}/.env` });
const secreteKey = process.env.JWT_SECRET;

function setUser(user) {
  const payload = {
    _id: user.employeeID,
    email: user.employee_email,
    username: user.employee_first_name,
    iat: Math.floor(Date.now() / 1000), // issued at
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, secreteKey);
  } catch (error) {
    return null;
  }
}
// Export functions using CommonJS syntax
module.exports = { setUser, getUser };

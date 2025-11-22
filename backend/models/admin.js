const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/sequelizeConfig');

// Define the Admin model
const Admin = {};

// Static method to insert an admin into the database
Admin.insertAdmin = async function (adminData) {
  const query = `
        INSERT INTO admins (email, password)
        VALUES (?, ?)
    `;
  return await sequelize.query(query, {
    replacements: [adminData.email, adminData.password],
  });
};

// Static method to find an admin by email
Admin.findByEmail = async function (email) {
  const query = 'SELECT * FROM admins WHERE email = ?';
  const [results] = await sequelize.query(query, {
    replacements: [email],
  });
  return results[0]; // Return the first result
};

// Static method to update an admin's password
Admin.updatePassword = async function (id, hashedPassword) {
  const query = 'UPDATE admins SET password = :password WHERE id = :id';
  await sequelize.query(query, {
    replacements: { password: hashedPassword, id: id },
  });
};

module.exports = Admin;

const { sequelize } = require('../config/sequelizeConfig');
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM
const Announcement = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Announcement.getAnnouncementsByDepartment = async function (department) {
  const query = `
    SELECT announcementID, announcement_title,announcement_date FROM Announcement
    WHERE departmentID = (SELECT departmentID FROM
    Department WHERE department_name=?);`;

  try {
    const rows = await sequelize.query(query, {
      replacements: [department],
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows; // Return announcement records for the specified department
  } catch (error) {
    console.error('Error fetching announcements by department ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Announcement.getAnnouncementById = async function (announcementId) {
  const query = `
    SELECT announcementID, announcement_title, announcement_date,announcement_description 
    FROM Announcement 
    WHERE announcementID = ?;`;

  try {
    const [row] = await sequelize.query(query, {
      replacements: [announcementId],
      type: Sequelize.QueryTypes.SELECT,
    });
    return row || null; // Return the announcement or null if not found
  } catch (error) {
    console.error('Error fetching announcement by ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Announcement.deleteAnnouncementById = async function (announcementId) {
  const query = `
    DELETE FROM Announcement
    WHERE announcementID = ?;
    `;
  try {
    const result = await sequelize.query(query, {
      replacements: [announcementId.id],
      type: Sequelize.QueryTypes.DELETE,
    });
    return result; // Return the result of the deletion operation
  } catch (error) {
    console.error('Error deleting announcement by ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Announcement.createNewAnnouncement = async function ({
  departmentID,
  title,
  description,
}) {
  const query = `
        INSERT INTO Announcement (departmentID, announcement_title, announcement_description, announcement_date)
        VALUES (?, ?, ?, CURRENT_DATE);
    `;

  try {
    // Execute the query and insert the new announcement into the database
    const [result] = await sequelize.query(query, {
      replacements: [departmentID, title, description],
      type: Sequelize.QueryTypes.INSERT,
    });

    // Return the new announcement data including the generated announcementID
    return {
      announcementID: result[0], // Assuming the result contains the generated ID
      departmentID,
      title,
      description,
      announcement_date: new Date(), // Set the current date for announcement_date
    };
  } catch (error) {
    console.error('Error creating new announcement:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

module.exports = Announcement;

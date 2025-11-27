const { sequelize } = require('../config/sequelizeConfig');
const Sequelize = require('sequelize');

const Payslip = {};

Payslip.getEmployeePayslips = async function (employeeId, year) {
  const query = `
    SELECT payslipID, payslip_monthName, payslip_receiveDate, payslip_fileName
    FROM Payslip
    WHERE employeeID = ? AND payslip_year = ?;
    `;

  try {
    const rows = await sequelize.query(query, {
      replacements: [employeeId, year],
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows; // Return the payslips for the employee
  } catch (error) {
    console.error('Error fetching employee payslips:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

Payslip.getPayslipfileNameById = async function (payslipID) {
  const query = `
    SELECT payslip_fileName FROM Payslip
    WHERE payslipID=?;`;

  try {
    const rows = await sequelize.query(query, {
      replacements: [payslipID],
      type: Sequelize.QueryTypes.SELECT,
    });
    return rows;
  } catch (error) {
    console.error('Error fetching documents by employee ID:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
};

module.exports = Payslip;

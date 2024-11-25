const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const myDocuments = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

myDocuments.getDocumentsByEmployeeId = async function (employeeId) {
    const query = `
    SELECT d.document_ID,d.document_type,d.document_receiveDate,s.signature_signedAt,
    d.signature_status FROM Documents d LEFT JOIN Signatures s ON d.document_ID=s.document_ID
    WHERE employeeID = ? ORDER BY d.document_receiveDate DESC;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [employeeId],
            type: Sequelize.QueryTypes.SELECT
        });
        return rows;
    } catch (error) {
        console.error('Error fetching documents by employee ID:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

myDocuments.getDocumentNameById = async function (documentID) {
    const query = `
    SELECT document_fileName FROM Documents
    WHERE document_ID=?;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [documentID],
            type: Sequelize.QueryTypes.SELECT
        });
        return rows;
    } catch (error) {
        console.error('Error fetching documents by employee ID:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

myDocuments.getSignatureById = async function (documentId) {
    const query = `
    SELECT signature_status FROM Documents WHERE document_ID=?;`;

    try {
        const rows = await sequelize.query(query, {
            replacements: [documentId],
            type: Sequelize.QueryTypes.SELECT
        });
        return rows[0];
    } catch (error) {
        console.error('Error fetching signatures:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};


module.exports = myDocuments;

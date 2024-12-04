const { sequelize } = require("../config/sequelizeConfig");
const Sequelize = require('sequelize');
//creating our own custom model without the use of sequelize ORM 
const Signatures = {};
// no need to define attributes in sequelize since using Raw SQL queries for DML operations

Signatures.saveSignature = async function (documentId, signature) {
    const query = `
    INSERT INTO Signatures(signature,document_ID)
    VALUES(?,?);`;

    const query2 = `
    UPDATE Documents
    SET signature_status=1
    WHERE document_ID=?`
    try {
        await sequelize.query(query, {
            replacements: [signature, documentId]
        });
        await sequelize.query(query2, {
            replacements: [documentId]
        });
    } catch (error) {
        console.error('Error saving signature:', error);
        throw error; // Rethrow the error to be handled in the controller
    }
};

module.exports = Signatures;

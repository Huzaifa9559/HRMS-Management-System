'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE TABLE Signatures (
        signatureID INT PRIMARY KEY AUTO_INCREMENT,
        signature VARCHAR(300) NOT NULL,
        signature_signedAt DATE NOT NULL DEFAULT CURRENT_DATE,
        document_ID INT,
        CONSTRAINT document_signature FOREIGN KEY (document_ID) REFERENCES Documents(document_ID)
    );
`);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TABLE Signatures;`);
  }
};
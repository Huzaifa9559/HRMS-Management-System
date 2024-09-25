import db from '../config/db.js'; // Import the database connection

const up = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS employees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            employeeName VARCHAR(255) NOT NULL,
            phoneNumber VARCHAR(15) NOT NULL UNIQUE,
            address TEXT NOT NULL,
            password VARCHAR(255) NOT NULL,
            designation VARCHAR(100) NOT NULL,
            department VARCHAR(100) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

const down = async () => {
    const query = `DROP TABLE IF EXISTS employees`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Export the migration functions
export { up, down };
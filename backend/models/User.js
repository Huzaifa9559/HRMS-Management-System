// created user table here
// models are created for the first time when database is initialized

import connection from '../config/db.js';

function CreateUserTable() {
  const createUserTable = `
    CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  connection.query(createUserTable, (err, results) => {
    if (err) {
      console.error('Error creating User table:', err);
    } else {
      console.log('User table created or already exists.');
    }
  });
}

export default CreateUserTable;


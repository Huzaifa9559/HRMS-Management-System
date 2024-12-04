const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({ path: `${process.cwd()}/.env` });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: '',//process.env.DB_PASSWORD || 
  database: process.env.DB_NAME
});

// Connection with the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = db;
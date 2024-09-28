const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

const db = mysql.createConnection({
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_name
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
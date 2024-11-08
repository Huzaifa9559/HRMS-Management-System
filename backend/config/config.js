require('dotenv').config({ path: `${process.cwd()}/.env` });

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT
  },
  "test": {
    "username": "root",
    "password": "123",
    "database": "dbproject",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "123",
    "database": "dbproject",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
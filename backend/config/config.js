require('dotenv').config({ path: `${process.cwd()}/.env` });

// Smart host detection: if DB_HOST is 'mysql' and we're not in Docker, use localhost
let dbHost = process.env.DB_HOST;
if (dbHost === 'mysql' && !process.env.DOCKER_ENV) {
  // If DOCKER_ENV is not set and host is 'mysql', assume local development
  dbHost = 'localhost';
}

// Default to 127.0.0.1 if DB_HOST is not set
if (!dbHost) {
  dbHost = '127.0.0.1';
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: dbHost || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: dbHost || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: dbHost || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
  },
};

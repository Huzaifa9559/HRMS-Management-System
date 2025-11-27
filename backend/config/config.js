require('dotenv').config({ path: `${process.cwd()}/.env` });

// Smart host detection: if DB_HOST is 'mysql' and we're not in Docker, use localhost
// Environment variables take precedence over .env file
let dbHost = process.env.DB_HOST;

// Debug logging (only in development/test or when DEBUG is set)
if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
  console.log('[config.js] DB_HOST from env:', dbHost);
  console.log('[config.js] DOCKER_ENV:', process.env.DOCKER_ENV);
}

if (dbHost === 'mysql' && !process.env.DOCKER_ENV) {
  // If DOCKER_ENV is not set and host is 'mysql', assume local development
  dbHost = 'localhost';
  if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
    console.log('[config.js] Changed DB_HOST to localhost (not in Docker)');
  }
}

// Default to 127.0.0.1 if DB_HOST is not set
if (!dbHost) {
  dbHost = '127.0.0.1';
  if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
    console.log('[config.js] DB_HOST not set, defaulting to 127.0.0.1');
  }
}

if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
  console.log('[config.js] Final dbHost value:', dbHost);
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

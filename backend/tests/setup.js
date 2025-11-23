// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'testpassword';
process.env.DB_NAME = 'test_db';
process.env.DB_PORT = '3306';
process.env.DB_DIALECT = 'mysql';

// Increase timeout for tests
process.env.TEST_TIMEOUT = '10000';

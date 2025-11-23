// Test setup file
// Only set defaults if not already set (allows CI/CD to override)
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.DB_HOST = process.env.DB_HOST || '127.0.0.1';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'testpassword';
process.env.DB_NAME = process.env.DB_NAME || 'test_db';
process.env.DB_PORT = process.env.DB_PORT || '3307'; // Default to 3307 for docker-compose.test.yml
process.env.DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Increase timeout for tests
process.env.TEST_TIMEOUT = process.env.TEST_TIMEOUT || '10000';

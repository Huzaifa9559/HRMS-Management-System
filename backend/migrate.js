import fs from 'fs';
import path from 'path';
import db from './config/db.js'; // Import your database connection
import { pathToFileURL } from 'url';  // Import the pathToFileURL function to convert paths to valid file URLs

const migrationsDir = path.resolve('./migrations'); // Use absolute path to avoid issues

const createMigrationsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await db.promise().query(query);
    } catch (error) {
        console.log("error occurred:", error);
    }
};

const runMigrations = async (direction) => {
    const files = fs.readdirSync(migrationsDir);
    const executedMigrations = await getExecutedMigrations();

    for (const file of files) {
        const migrationName = path.basename(file, '.js'); // Get the migration name
        const migrationPath = pathToFileURL(path.join(migrationsDir, file)).href; // Convert to file URL

        if (direction === 'up' && !executedMigrations.includes(migrationName)) {
            const migration = await import(migrationPath); // Dynamically import the migration
            await migration.up();
            await markMigrationAsExecuted(migrationName);
        } else if (direction === 'down' && executedMigrations.includes(migrationName)) {
            const migration = await import(migrationPath); // Dynamically import the migration
            await migration.down();
            await markMigrationAsRolledBack(migrationName);
        }
    }
};

const getExecutedMigrations = async () => {
    const query = 'SELECT name FROM migrations';
    const [rows] = await db.promise().query(query);  // Use db.promise() instead of con.promise()
    return rows.map(row => row.name);
};

const markMigrationAsExecuted = async (name) => {
    const query = 'INSERT INTO migrations (name) VALUES (?)';
    await db.promise().query(query, [name]);
};

const markMigrationAsRolledBack = async (name) => {
    const query = 'DELETE FROM migrations WHERE name = ?';
    await db.promise().query(query, [name]);
};

// End the database connection
const closeDbConnection = async () => {
    await db.promise().end();
};

// Command line arguments
const direction = process.argv[2]; // 'up' or 'down'
if (direction !== 'up' && direction !== 'down') {
    console.error('Please specify "up" or "down" as an argument.');
    process.exit(1);
}

const run = async () => {
    try {
        await createMigrationsTable();
        await runMigrations(direction);
    } catch (error) {
        console.error('An error occurred during the migration:', error);
    } finally {
        await closeDbConnection(); // Ensure that the DB connection is closed
    }
};

run();

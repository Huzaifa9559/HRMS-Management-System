#!/usr/bin/env node

/**
 * Safe Migration Script
 *
 * This script runs migrations with automatic rollback on failure.
 * It captures the current migration state before running migrations,
 * and if migration fails, it rolls back to the previous state.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATION_STATE_FILE = path.join(__dirname, '../.migration-state.json');

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function getCurrentMigrations() {
  try {
    log('📊 Getting current migration status...');
    const output = execSync('npm run migrate:status', {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: path.join(__dirname, '..'),
    });

    // Parse migration status
    const lines = output.split('\n').filter((line) => line.trim());
    const migrations = [];

    lines.forEach((line) => {
      // Match both formats: "up   20241203081637-create-department-table.js" and "up 20241203081637-create-department-table.js"
      const match = line.match(/^(up|down)\s+(.+)$/);
      if (match) {
        migrations.push({
          state: match[1],
          name: match[2].trim(),
        });
      }
    });

    return migrations;
  } catch (error) {
    log(
      '⚠️  Could not get migration status (this is OK if no migrations exist yet)'
    );
    log(`   Error: ${error.message}`);
    return [];
  }
}

function saveMigrationState(migrations) {
  const state = {
    timestamp: new Date().toISOString(),
    migrations: migrations,
  };

  fs.writeFileSync(MIGRATION_STATE_FILE, JSON.stringify(state, null, 2));
  log(`💾 Saved migration state: ${migrations.length} migrations`);
}

function getPendingMigrations(currentState, previousState) {
  if (!previousState) {
    return currentState.filter((m) => m.state === 'down');
  }

  // Find migrations that were 'down' before but are now 'up'
  const previousNames = new Set(previousState.migrations.map((m) => m.name));
  return currentState.filter(
    (m) => m.state === 'up' && !previousNames.has(m.name)
  );
}

function rollbackMigrations(migrationsToRollback) {
  if (migrationsToRollback.length === 0) {
    log('ℹ️  No migrations to rollback');
    return;
  }

  log(`🔄 Rolling back ${migrationsToRollback.length} migration(s)...`);

  // Rollback in reverse order (most recent first)
  const migrationsToRollbackReversed = [...migrationsToRollback].reverse();

  for (const migration of migrationsToRollbackReversed) {
    try {
      log(`   ↻ Rolling back: ${migration.name}`);
      execSync('npm run migrate:undo', {
        stdio: 'inherit',
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..'),
      });
      log(`   ✅ Rolled back: ${migration.name}`);
    } catch (error) {
      log(`   ❌ Failed to rollback: ${migration.name}`);
      log(`   Error: ${error.message}`);
      throw error;
    }
  }

  log('✅ All migrations rolled back successfully');
}

function main() {
  log('🚀 Starting safe migration process...');

  // Step 1: Get current migration state (before migration)
  const stateBefore = getCurrentMigrations();
  saveMigrationState(stateBefore);

  // Step 2: Run migrations
  log('🔄 Running database migrations...');
  let migrationOutput = '';
  let migrationError = '';

  try {
    // Capture both stdout and stderr
    migrationOutput = execSync('npm run migrate', {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    });

    // If we get here, migration succeeded
    console.log(migrationOutput);
    log('✅ Migrations completed successfully');
  } catch (error) {
    // Capture full error details
    migrationError = error.stderr ? error.stderr.toString() : '';
    migrationOutput = error.stdout ? error.stdout.toString() : '';

    // Display full error information
    log('❌ Migration failed! Starting automatic rollback...');
    log('═══════════════════════════════════════════════════════════');
    log('📋 MIGRATION ERROR DETAILS:');
    log('═══════════════════════════════════════════════════════════');

    if (error.message) {
      log(`❌ Error Message: ${error.message}`);
    }

    if (migrationOutput) {
      log('\n📤 Migration Output:');
      console.log(migrationOutput);
    }

    if (migrationError) {
      log('\n❌ Migration Error Output:');
      console.error(migrationError);
    }

    if (error.status) {
      log(`\n📊 Exit Code: ${error.status}`);
    }

    log('═══════════════════════════════════════════════════════════\n');

    // Step 3: Get state after failed migration attempt
    log('📊 Checking which migrations were applied before failure...');
    const stateAfter = getCurrentMigrations();
    const migrationsToRollback = getPendingMigrations(stateAfter, stateBefore);

    if (migrationsToRollback.length > 0) {
      log(
        `📋 Found ${migrationsToRollback.length} migration(s) that need to be rolled back:`
      );
      migrationsToRollback.forEach((m) => log(`   - ${m.name}`));

      log('\n🔄 Starting automatic rollback...');
      try {
        rollbackMigrations(migrationsToRollback);
        log('✅ Rollback completed successfully');
        log(
          '📋 Database has been restored to the state before migration attempt'
        );
      } catch (rollbackError) {
        log('═══════════════════════════════════════════════════════════');
        log('❌ ROLLBACK FAILED! Manual intervention required.');
        log('═══════════════════════════════════════════════════════════');
        if (rollbackError.message) {
          log(`❌ Rollback Error: ${rollbackError.message}`);
        }
        log('\n📋 Manual Rollback Instructions:');
        log('   1. Check migration status: npm run migrate:status');
        log('   2. Rollback migrations one by one: npm run migrate:undo');
        log('   3. Repeat step 2 until all failed migrations are rolled back');
        log('   4. Verify database state: npm run migrate:status');
        log('═══════════════════════════════════════════════════════════');
        process.exit(1);
      }
    } else {
      log(
        'ℹ️  No migrations to rollback (migration failed before applying any changes)'
      );
      log('📋 Database state is unchanged');
    }

    // Clean up state file
    if (fs.existsSync(MIGRATION_STATE_FILE)) {
      fs.unlinkSync(MIGRATION_STATE_FILE);
    }

    log('\n❌ Migration process failed. Process stopped.');
    process.exit(1);
  }

  // Step 4: Verify migration status
  log('📊 Verifying migration status...');
  try {
    execSync('npm run migrate:status', {
      stdio: 'inherit',
      encoding: 'utf-8',
    });
    log('✅ All migrations verified');
  } catch (error) {
    log('⚠️  Migration status check failed, but migrations were applied');
    log('📋 Please verify manually: npm run migrate:status');
  }

  // Clean up state file on success
  if (fs.existsSync(MIGRATION_STATE_FILE)) {
    fs.unlinkSync(MIGRATION_STATE_FILE);
  }

  log('✅ Safe migration process completed successfully');
}

// Run the script
main();

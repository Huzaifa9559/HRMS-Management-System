#!/bin/bash

# Production Migration Script
# This script runs migrations on production database with automatic rollback on failure
# Usage: ./scripts/run-production-migration.sh

set -e  # Exit on error

echo "═══════════════════════════════════════════════════════════"
echo "🚀 Production Database Migration Script"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if running in Docker container
if [ -f /.dockerenv ] || [ -n "$DOCKER_CONTAINER" ]; then
    echo "📦 Running inside Docker container"
    CONTAINER_MODE=true
else
    echo "💻 Running on host system"
    CONTAINER_MODE=false
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "   Make sure environment variables are set"
fi

# Show current migration status
echo ""
echo "📊 Current Migration Status (Before):"
echo "───────────────────────────────────────────────────────────"
npm run migrate:status || echo "   (No migrations found or error getting status)"
echo ""

# Confirm before proceeding
if [ "$CONTAINER_MODE" = false ]; then
    read -p "⚠️  Are you sure you want to run migrations on PRODUCTION database? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Migration cancelled by user"
        exit 0
    fi
fi

echo ""
echo "🔄 Running migrations with automatic rollback..."
echo "───────────────────────────────────────────────────────────"

# Run safe migration script (includes automatic rollback)
if npm run migrate:safe; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "✅ MIGRATION SUCCESSFUL"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Final Migration Status:"
    echo "───────────────────────────────────────────────────────────"
    npm run migrate:status
    echo ""
    echo "✅ All migrations completed successfully!"
    exit 0
else
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "❌ MIGRATION FAILED - ROLLBACK COMPLETED"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "📊 Migration Status After Rollback:"
    echo "───────────────────────────────────────────────────────────"
    npm run migrate:status || true
    echo ""
    echo "❌ Migration failed and has been rolled back."
    echo "📋 Database has been restored to previous state."
    echo "📋 Please review the error messages above and fix the migration issues."
    exit 1
fi


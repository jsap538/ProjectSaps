#!/usr/bin/env node

/**
 * Database Backup Script for SAPS Marketplace
 * 
 * This script creates automated backups of your MongoDB database
 * and stores them securely for disaster recovery.
 * 
 * Usage:
 *   node scripts/backup-database.js
 * 
 * Environment Variables Required:
 *   MONGODB_URI - Your MongoDB connection string
 *   BACKUP_BUCKET - S3 bucket for storing backups (optional)
 *   AWS_ACCESS_KEY_ID - AWS credentials (if using S3)
 *   AWS_SECRET_ACCESS_KEY - AWS credentials (if using S3)
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const BACKUP_DIR = process.env.BACKUP_DIR || './backups';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  process.exit(1);
}

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFilename = `saps-backup-${timestamp}`;
const backupPath = path.join(BACKUP_DIR, backupFilename);

console.log('🔄 Starting database backup...');
console.log(`📁 Backup directory: ${BACKUP_DIR}`);
console.log(`📄 Backup filename: ${backupFilename}`);

// Extract database name from URI
const dbName = MONGODB_URI.split('/').pop().split('?')[0];

// Create mongodump command
const mongodumpCommand = `mongodump --uri="${MONGODB_URI}" --out="${backupPath}"`;

console.log('📦 Running mongodump...');

exec(mongodumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }

  if (stderr) {
    console.warn('⚠️  mongodump warnings:', stderr);
  }

  console.log('✅ Database backup completed successfully!');
  console.log(`📁 Backup location: ${backupPath}`);

  // Compress the backup
  console.log('🗜️  Compressing backup...');
  
  const tarCommand = `tar -czf "${backupPath}.tar.gz" -C "${BACKUP_DIR}" "${backupFilename}"`;
  
  exec(tarCommand, (tarError, tarStdout, tarStderr) => {
    if (tarError) {
      console.error('❌ Compression failed:', tarError.message);
      return;
    }

    console.log('✅ Backup compressed successfully!');
    console.log(`📦 Compressed file: ${backupPath}.tar.gz`);

    // Clean up uncompressed directory
    const rmCommand = `rm -rf "${backupPath}"`;
    exec(rmCommand, (rmError) => {
      if (rmError) {
        console.warn('⚠️  Could not remove uncompressed backup:', rmError.message);
      } else {
        console.log('🧹 Cleaned up uncompressed backup');
      }
    });

    // Clean up old backups
    console.log('🧹 Cleaning up old backups...');
    cleanupOldBackups();
  });
});

function cleanupOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (RETENTION_DAYS * 24 * 60 * 60 * 1000));

    let deletedCount = 0;

    files.forEach(file => {
      if (file.startsWith('saps-backup-') && file.endsWith('.tar.gz')) {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filePath);
          deletedCount++;
          console.log(`🗑️  Deleted old backup: ${file}`);
        }
      }
    });

    console.log(`✅ Cleanup completed. Deleted ${deletedCount} old backups.`);
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Backup interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Backup terminated');
  process.exit(0);
});


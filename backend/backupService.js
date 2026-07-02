import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database/database.db');
const BACKUPS_DIR = path.join(__dirname, 'database/backups');

// Ensure backups directory exists
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Function to perform a backup
export const performBackup = () => {
  if (!fs.existsSync(DB_PATH)) {
    console.error('Backup failed: database.db not found');
    return;
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
  const backupFileName = `database_${timestamp}.db`;
  const backupPath = path.join(BACKUPS_DIR, backupFileName);

  try {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`Database backup created successfully: ${backupFileName}`);
    cleanupOldBackups();
  } catch (err) {
    console.error('Failed to create database backup:', err);
  }
};

// Function to clean up backups older than 7 days
const cleanupOldBackups = () => {
  const RETENTION_DAYS = 7;
  const now = Date.now();

  fs.readdir(BACKUPS_DIR, (err, files) => {
    if (err) {
      console.error('Failed to read backups directory for cleanup:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(BACKUPS_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        const fileAgeDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
        if (fileAgeDays > RETENTION_DAYS) {
          fs.unlink(filePath, err => {
            if (err) console.error(`Failed to delete old backup ${file}:`, err);
            else console.log(`Deleted old backup: ${file}`);
          });
        }
      });
    });
  });
};

// Schedule backup to run every 4 hours
// 0 */4 * * * means "at minute 0 past every 4th hour"
cron.schedule('0 */4 * * *', () => {
  console.log('Running scheduled database backup...');
  performBackup();
});

// Perform an initial backup on startup
console.log('Automated backup service initialized.');
performBackup();

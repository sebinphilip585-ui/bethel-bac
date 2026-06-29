import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  return new Promise((resolveInit, rejectInit) => {
    const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'database.db');
    
    // We NO LONGER delete the existing database file here!
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        return rejectInit(err);
      }
      console.log('Connected to SQLite database for initialization.');

      db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON;");

        // Profiles
        db.run(`
          CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL,
            phone TEXT,
            password_hash TEXT NOT NULL,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Guests
        db.run(`
          CREATE TABLE IF NOT EXISTS guests (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            id_type TEXT,
            id_number TEXT,
            address TEXT,
            notes TEXT,
            total_stays INTEGER DEFAULT 0,
            last_stay TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Room Types
        db.run(`
          CREATE TABLE IF NOT EXISTS room_types (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            base_price REAL NOT NULL,
            capacity INTEGER NOT NULL,
            size INTEGER,
            bed_type TEXT,
            facilities TEXT DEFAULT '[]',
            images TEXT DEFAULT '[]',
            featured INTEGER DEFAULT 0,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Rooms
        db.run(`
          CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            room_number TEXT UNIQUE NOT NULL,
            room_type_id TEXT REFERENCES room_types(id),
            floor INTEGER,
            status TEXT DEFAULT 'available',
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Bookings
        db.run(`
          CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            guest_id TEXT REFERENCES guests(id),
            room_id TEXT REFERENCES rooms(id),
            room_type_id TEXT REFERENCES room_types(id),
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            actual_check_in TEXT,
            actual_check_out TEXT,
            guests_count INTEGER DEFAULT 1,
            status TEXT DEFAULT 'pending',
            total_amount REAL NOT NULL,
            amount_paid REAL DEFAULT 0,
            payment_status TEXT DEFAULT 'pending',
            payment_method TEXT,
            payment_source TEXT,
            source TEXT DEFAULT 'direct',
            special_requests TEXT,
            notes TEXT,
            created_by TEXT REFERENCES profiles(id),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Expenses
        db.run(`
          CREATE TABLE IF NOT EXISTS expenses (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            vendor_name TEXT,
            payment_status TEXT DEFAULT 'Paid',
            attachment_url TEXT,
            created_by TEXT REFERENCES profiles(id),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Calendar Events
        db.run(`
          CREATE TABLE IF NOT EXISTS calendar_events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            start_time TEXT NOT NULL,
            end_time TEXT NOT NULL,
            type TEXT DEFAULT 'meeting',
            description TEXT,
            color TEXT DEFAULT '#3b82f6',
            staff_id TEXT REFERENCES profiles(id),
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Digital Queue
        db.run(`
          CREATE TABLE IF NOT EXISTS digital_queue (
            id TEXT PRIMARY KEY,
            token_number TEXT NOT NULL,
            guest_id TEXT REFERENCES guests(id),
            guest_name TEXT,
            purpose TEXT NOT NULL,
            status TEXT DEFAULT 'waiting',
            priority TEXT DEFAULT 'normal',
            assigned_staff TEXT REFERENCES profiles(id),
            notes TEXT,
            joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
            completed_at TEXT
          )
        `);

        // Pricing Rules
        db.run(`
          CREATE TABLE IF NOT EXISTS pricing_rules (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            multiplier REAL NOT NULL,
            start_date TEXT,
            end_date TEXT,
            threshold INTEGER,
            description TEXT,
            active INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Notifications
        db.run(`
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            priority TEXT DEFAULT 'low',
            type TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            link TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `);

        db.run("SELECT 1", (err) => {
          if (err) {
            console.error('Error verifying tables:', err);
            return rejectInit(err);
          }
          console.log('Database tables verified/created successfully.');

          const runDb = (sql, params) => new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
              if (err) reject(err);
              else resolve(this);
            });
          });

          console.log('Verifying demo users exist...');
          
          (async () => {
            try {
              const password_hash = await bcrypt.hash('password', 10);
              
              const users = [
                { id: crypto.randomUUID(), name: 'Admin User', email: 'admin@bethelmeadows.com', role: 'admin' },
                { id: crypto.randomUUID(), name: 'Manager User', email: 'manager@bethelmeadows.com', role: 'manager' },
                { id: crypto.randomUUID(), name: 'Receptionist User', email: 'reception@bethelmeadows.com', role: 'receptionist' }
              ];

              for (const user of users) {
                await runDb(
                  'INSERT OR IGNORE INTO profiles (id, name, email, role, password_hash) VALUES (?, ?, ?, ?, ?)',
                  [user.id, user.name, user.email, user.role, password_hash]
                );
              }
              
              console.log('Demo users verified successfully!');
              
              // Seed some room types and rooms ONLY if empty
              const countRow = await new Promise((res, rej) => {
                  db.get('SELECT COUNT(*) as count FROM room_types', (err, row) => {
                      if (err) rej(err); else res(row);
                  });
              });

              if (countRow.count === 0) {
                  const dlxId = crypto.randomUUID();
                  await runDb(
                    `INSERT INTO room_types (id, name, description, base_price, capacity, size, bed_type, facilities) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [dlxId, 'Deluxe Room', 'Beautiful deluxe room', 2500, 2, 300, 'King Size', JSON.stringify(['AC', 'TV'])]
                  );

                  await runDb(
                    `INSERT INTO rooms (id, room_number, room_type_id, floor, status) VALUES (?, ?, ?, ?, ?)`,
                    [crypto.randomUUID(), '101', dlxId, 1, 'available']
                  );
                  console.log('Base property data seeded successfully!');
              }

            } catch (e) {
              console.error('Error seeding data:', e);
            } finally {
              db.close();
              console.log('Database initialization check complete.');
              resolveInit();
            }
          })();
        });
      });
    });
  });
}

// Allow running this script manually (like before)
if (process.argv[1] === __filename) {
  initDatabase().catch(console.error);
}

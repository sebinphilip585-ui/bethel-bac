import sqlite3 from 'sqlite3';
import path from 'path';

// Connect to the SQLite database
const dbPath = process.env.DB_PATH || path.resolve('database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

console.log('--- CONNECTED TO SQLITE DATABASE ---');

const runQuery = (sql) => {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

async function main() {
  try {
    console.log('\n--- 👥 STAFF PROFILES IN DATABASE ---');
    const profiles = await runQuery('SELECT id, name, email, role, active FROM profiles');
    console.table(profiles);

    console.log('\n--- 🏨 HOTEL ROOM INVENTORY (STATUSES) ---');
    const rooms = await runQuery(`
      SELECT r.room_number, rt.name as type, r.floor, r.status 
      FROM rooms r 
      JOIN room_types rt ON r.room_type_id = rt.id 
      LIMIT 10
    `);
    console.table(rooms);

    console.log('\n--- 📅 ACTIVE BOOKINGS ---');
    const bookings = await runQuery(`
      SELECT b.id, g.name as guest_name, b.check_in, b.check_out, b.status, b.total_amount 
      FROM bookings b 
      LEFT JOIN guests g ON b.guest_id = g.id
      ORDER BY b.check_in DESC
    `);
    console.table(bookings);
  } catch (err) {
    console.error('Query error:', err);
  } finally {
    db.close();
  }
}

main();

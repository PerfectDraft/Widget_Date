import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'user.sqlite');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize schema
export function initSchema() {
  console.log('📦 Initializing User Database schema...');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      phone TEXT PRIMARY KEY,
      password_hash TEXT,
      google_id TEXT,
      preferences TEXT,
      last_tab TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_saved_places (
      phone TEXT,
      place_id TEXT,
      place_data TEXT,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (phone, place_id),
      FOREIGN KEY (phone) REFERENCES users(phone) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      action TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (phone) REFERENCES users(phone) ON DELETE CASCADE
    );
  `);

  // Migration for existing DB
  try {
    db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT');
  } catch (e) {
    // Column might already exist
  }
  
  console.log('✅ User Database schema ready.');
}

export default db;

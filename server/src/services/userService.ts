import db from '../db/client.js';
import bcrypt from 'bcryptjs';

export interface UserProfile {
  phone: string;
  password_hash?: string;
  google_id?: string;
  preferences?: string[];
  last_tab?: string;
  updated_at?: string;
}

export interface SavedPlace {
  phone: string;
  place_id: string;
  place_data: any;
  added_at: string;
}

export const userService = {
  async createUser(phone: string, passwordPlain: string) {
    const passwordHash = await bcrypt.hash(passwordPlain, 10);
    const stmt = db.prepare(`
      INSERT INTO users (phone, password_hash, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    return stmt.run(phone, passwordHash);
  },

  async verifyUser(phone: string, passwordPlain: string) {
    const user = this.getUser(phone);
    if (!user || !user.password_hash) return null;
    
    const isValid = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isValid) return null;

    return user;
  },

  upsertUser(phone: string, googleId?: string, preferences?: string[], lastTab?: string) {
    const prefJson = preferences ? JSON.stringify(preferences) : null;
    const stmt = db.prepare(`
      INSERT INTO users (phone, google_id, preferences, last_tab, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(phone) DO UPDATE SET
        google_id = COALESCE(excluded.google_id, users.google_id),
        preferences = COALESCE(excluded.preferences, users.preferences),
        last_tab = COALESCE(excluded.last_tab, users.last_tab),
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(phone, googleId, prefJson, lastTab);
  },

  getUser(phone: string): UserProfile | null {
    const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
    const row: any = stmt.get(phone);
    if (!row) return null;
    return {
      ...row,
      preferences: row.preferences ? JSON.parse(row.preferences) : []
    };
  },

  savePlace(phone: string, placeId: string, placeData: any) {
    const dataJson = JSON.stringify(placeData);
    const stmt = db.prepare(`
      INSERT INTO user_saved_places (phone, place_id, place_data, added_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(phone, place_id) DO UPDATE SET
        place_data = excluded.place_data,
        added_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(phone, placeId, dataJson);
  },

  getSavedPlaces(phone: string): SavedPlace[] {
    const stmt = db.prepare('SELECT * FROM user_saved_places WHERE phone = ? ORDER BY added_at DESC');
    const rows: any[] = stmt.all(phone);
    return rows.map(r => ({
      ...r,
      place_data: JSON.parse(r.place_data)
    }));
  },

  logAction(phone: string, action: string, metadata?: any) {
    const metaJson = metadata ? JSON.stringify(metadata) : null;
    const stmt = db.prepare(`
      INSERT INTO user_history (phone, action, metadata)
      VALUES (?, ?, ?)
    `);
    return stmt.run(phone, action, metaJson);
  }
};

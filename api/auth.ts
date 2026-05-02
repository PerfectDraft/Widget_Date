import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-action');
};

async function ensureTable() {
  await sql`CREATE TABLE IF NOT EXISTS users (
    phone TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    google_id TEXT,
    preferences TEXT,
    last_tab TEXT,
    display_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  // Ensure columns exist for older tables
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
}

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = (req.headers['x-action'] || req.query.action) as string;

  // ── LOGIN ─────────────────────────────────────────────
  if (action === 'login') {
    if (req.method !== 'POST') return res.status(405).end();
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password are required' });
    try {
      await ensureTable();
      const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
      const user = result.rows[0];
      if (!user || !user.password_hash) return res.status(401).json({ error: 'Số điện thoại hoặc mật khẩu không đúng' });
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) return res.status(401).json({ error: 'Số điện thoại hoặc mật khẩu không đúng' });
      const { password_hash, ...profile } = user;
      return res.json({ success: true, user: profile });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
    }
  }

  // ── REGISTER ───────────────────────────────────────────
  if (action === 'register') {
    if (req.method !== 'POST') return res.status(405).end();
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ error: 'Phone and password are required' });
    try {
      await ensureTable();
      const existing = await sql`SELECT phone FROM users WHERE phone = ${phone}`;
      if (existing.rows.length > 0) return res.status(409).json({ error: 'Số điện thoại đã được đăng ký' });
      const hash = await bcrypt.hash(password, 10);
      await sql`INSERT INTO users (phone, password_hash) VALUES (${phone}, ${hash})`;
      return res.json({ success: true });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
    }
  }

  // ── CHANGE PASSWORD ───────────────────────────────────
  if (action === 'change-password') {
    if (req.method !== 'POST') return res.status(405).end();
    const { phone, oldPassword, newPassword } = req.body;
    if (!phone || !oldPassword || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Mật khẩu mới phải từ 6 ký tự' });
    try {
      const result = await sql`SELECT password_hash FROM users WHERE phone = ${phone}`;
      const user = result.rows[0];
      if (!user) return res.status(404).json({ error: 'Không tìm thấy tài khoản' });
      const isValid = await bcrypt.compare(oldPassword, user.password_hash);
      if (!isValid) return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
      const newHash = await bcrypt.hash(newPassword, 10);
      await sql`UPDATE users SET password_hash = ${newHash}, updated_at = NOW() WHERE phone = ${phone}`;
      return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (err) {
      console.error('Change password error:', err);
      return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
    }
  }

  // ── UPDATE PROFILE ─────────────────────────────────────
  if (action === 'update-profile') {
    if (req.method !== 'POST') return res.status(405).end();
    const { phone, userName } = req.body;
    if (!phone || !userName?.trim()) return res.status(400).json({ error: 'Thiếu thông tin' });
    try {
      await ensureTable();
      await sql`UPDATE users SET display_name = ${userName.trim()}, updated_at = NOW() WHERE phone = ${phone}`;
      return res.json({ success: true, userName: userName.trim() });
    } catch (err) {
      console.error('Update profile error:', err);
      return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
}

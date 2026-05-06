import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
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
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT`;
}

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, password } = req.body || {};
  if (!phone || !password)
    return res.status(400).json({ error: 'Phone and password are required' });

  try {
    await ensureTable();
    const existing = await sql`SELECT phone FROM users WHERE phone = ${phone}`;
    if (existing.rows.length > 0)
      return res.status(409).json({ success: false, error: 'Số điện thoại đã được đăng ký' });

    const hash = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (phone, password_hash) VALUES (${phone}, ${hash})`;

    const secret = process.env.JWT_SECRET || 'widget_date_secret';
    const token = jwt.sign(
      { phone, sub: phone },
      secret,
      { expiresIn: '30d' }
    );

    return res.json({ success: true, token, user: { phone } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Lỗi server, vui lòng thử lại' });
  }
}

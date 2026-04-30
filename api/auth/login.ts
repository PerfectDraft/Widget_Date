import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      phone TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      google_id TEXT,
      preferences TEXT,
      last_tab TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
    await ensureTable();
    const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Số điện thoại hoặc mật khẩu không đúng' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Số điện thoại hoặc mật khẩu không đúng' });
    }

    const { password_hash, ...profile } = user;
    return res.json({ success: true, user: profile });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
  }
}

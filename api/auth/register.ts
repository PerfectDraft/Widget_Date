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

    const existing = await sql`SELECT phone FROM users WHERE phone = ${phone}`;
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (phone, password_hash, updated_at)
      VALUES (${phone}, ${passwordHash}, CURRENT_TIMESTAMP)
    `;

    return res.json({ success: true, message: 'Đăng ký thành công' });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
  }
}

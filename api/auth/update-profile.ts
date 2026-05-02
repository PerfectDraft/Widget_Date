import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, userName } = req.body;
  if (!phone || !userName || !userName.trim()) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }

  try {
    // Add display_name column if not exists
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT`;
    await sql`UPDATE users SET display_name = ${userName.trim()}, updated_at = NOW() WHERE phone = ${phone}`;
    return res.json({ success: true, userName: userName.trim() });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Lỗi server, vui lòng thử lại' });
  }
}

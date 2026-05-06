import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, password } = req.body || {};
  if (!phone || !password)
    return res.status(400).json({ error: 'Phone and password are required' });

  try {
    const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    const user = result.rows[0];
    if (!user || !user.password_hash)
      return res.status(401).json({ error: 'S\u1ed1 \u0111i\u1ec7n tho\u1ea1i ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng \u0111\u00fang' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ error: 'S\u1ed1 \u0111i\u1ec7n tho\u1ea1i ho\u1eb7c m\u1eadt kh\u1ea9u kh\u00f4ng \u0111\u00fang' });

    const { password_hash, ...profile } = user;
    return res.json({ success: true, user: profile });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'L\u1ed7i server, vui l\u00f2ng th\u1eed l\u1ea1i' });
  }
}

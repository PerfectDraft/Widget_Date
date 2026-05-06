import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      return res.status(401).json({ success: false, error: 'Số điện thoại hoặc mật khẩu không đúng' });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ success: false, error: 'Số điện thoại hoặc mật khẩu không đúng' });

    const secret = process.env.JWT_SECRET || 'widget_date_secret';
    const token = jwt.sign(
      { phone: user.phone, sub: user.phone },
      secret,
      { expiresIn: '30d' }
    );

    const { password_hash, ...profile } = user;
    return res.json({ success: true, token, user: profile });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Lỗi server, vui lòng thử lại' });
  }
}

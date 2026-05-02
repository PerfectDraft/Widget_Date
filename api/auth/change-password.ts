import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { phone, oldPassword, newPassword } = req.body;
  if (!phone || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Mật khẩu mới phải từ 6 ký tự' });
  }

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

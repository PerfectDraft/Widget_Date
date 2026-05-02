import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export const config = { api: { bodyParser: false } };

const CORS = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-phone');
};

export default async function handler(req: any, res: any) {
  CORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const phone = req.headers['x-phone'] as string;
  if (!phone) return res.status(400).json({ error: 'Thiếu phone header' });

  const contentType = (req.headers['content-type'] || 'image/jpeg') as string;
  if (!contentType.startsWith('image/')) {
    return res.status(400).json({ error: 'Chỉ hỗ trợ file ảnh' });
  }

  try {
    const filename = `avatars/${phone.replace(/\D/g, '')}_${Date.now()}.jpg`;
    const blob = await put(filename, req, { access: 'public', contentType });
    await sql`UPDATE users SET avatar_url = ${blob.url}, updated_at = NOW() WHERE phone = ${phone}`;
    return res.json({ success: true, url: blob.url });
  } catch (err: any) {
    console.error('Upload avatar error:', err);
    return res.status(500).json({ error: err?.message || 'Lỗi upload, vui lòng thử lại' });
  }
}
